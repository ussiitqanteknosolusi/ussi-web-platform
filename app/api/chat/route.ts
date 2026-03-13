import { NextResponse } from "next/server";
import OpenAI from "openai";
import { db } from "@/lib/prisma";
import { getSiteSettings } from "@/lib/settings";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: process.env.OPENAI_BASE_URL,
  defaultHeaders: {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "Accept": "application/json",
  }
});

// Model name as specified by the user
const MODEL_NAME = "openai-gpt-oss-120b";

// --- RETRY LOGIC FOR RATE LIMITS ---
async function callOpenAIWithRetry<T>(fn: () => Promise<T>, retries = 5, delay = 3000): Promise<T> {
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (error: unknown) {
      // Deteksi error 429 secara lebih akurat pada objek error OpenAI
      const status = (error as { status?: number })?.status;
      
      if (status === 429 && i < retries - 1) {
        const jitter = Math.floor(Math.random() * 1500);
        const waitTime = delay + jitter;
        console.warn(`[RETRY] IP Hosting sibuk. Mencoba lagi dalam ${waitTime}ms... (${i + 2}/5)`);
        await new Promise(resolve => setTimeout(resolve, waitTime));
        delay *= 2; 
        continue;
      }
      throw error;
    }
  }
  throw new Error("Sistem sedang sangat sibuk. Silakan coba sesaat lagi.");
}

// --- IN-MEMORY RATE LIMITER ---
// Menyimpan riwayat akses IP. Format: Map<IP_Address, { count: number, resetTime: number }>
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const MAX_REQUESTS_PER_MINUTE = 15; // Maksimal chat per menit
const BLOCK_DURATION_MS = 60 * 1000; // Reset setiap 1 menit

export async function POST(req: Request) {
  try {
    // 1. SECURITY HONEYPOT: Validasi User-Agent
    const userAgent = req.headers.get("user-agent");
    if (!userAgent || userAgent.length < 10) {
        // Blokir script python/curl/bot otomatis yang tidak memiliki User-Agent valid
        return NextResponse.json({ error: "Access Denied: Invalid Request Signature" }, { status: 403 });
    }

    // 2. RATE LIMITING: Validasi batas penggunaan per IP
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0] || "unknown-ip";
    const now = Date.now();
    const clientRecord = rateLimitMap.get(ip);

    if (clientRecord) {
        if (now > clientRecord.resetTime) {
            // Waktu blokir sudah habis, reset hitungan
            rateLimitMap.set(ip, { count: 1, resetTime: now + BLOCK_DURATION_MS });
        } else if (clientRecord.count >= MAX_REQUESTS_PER_MINUTE) {
            // Terlalu banyak request, tolak akses dan beri tahu pengguna
            console.warn(`[RATE LIMIT] IP ${ip} blocked! Too many chat requests.`);
            return NextResponse.json(
                { error: "Terlalu banyak pesan. Silakan tunggu beberapa saat." },
                { status: 429 } // 429 Too Many Requests
            );
        } else {
            // Tambahkan hitungan
            clientRecord.count += 1;
            rateLimitMap.set(ip, clientRecord);
        }
    } else {
        // Klien baru
        rateLimitMap.set(ip, { count: 1, resetTime: now + BLOCK_DURATION_MS });
    }

    // 3. Ambil Payload Pesan
    const { message, sessionId, city, country, device } = await req.json();

    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    let currentSessionId = sessionId;

    // 1. Identify or create session
    try {
        if (!currentSessionId) {
            const session = await db.aiChatSession.create({
                data: { city, country, device },
            });
            currentSessionId = session.id;
        } else {
            const session = await db.aiChatSession.findUnique({ where: { id: currentSessionId } });
            if (!session) {
                const newSession = await db.aiChatSession.create({
                    data: { id: currentSessionId, city, country, device },
                });
                currentSessionId = newSession.id;
            }
        }
    } catch (e) {
        console.error("Session selection error:", e);
        // Fallback to a temporary ID if DB fails for session
        currentSessionId = currentSessionId || "temp-" + Date.now();
    }

    // 2. Fetch Context (RAG)
    const [settings, services, projects] = await Promise.all([
      getSiteSettings(),
      db.service.findMany({ 
        where: { isActive: true }, 
        include: { products: { where: { isActive: true } } } 
      }),
      db.project.findMany({ 
        take: 5, 
        orderBy: { projectDate: 'desc' },
        include: { service: true }
      }),
    ]);

    // 3. Fetch History
    let history: OpenAI.Chat.Completions.ChatCompletionMessage[] = [];
    try {
        const fetchedHistory = await db.aiChatMessage.findMany({
            where: { sessionId: currentSessionId },
            orderBy: { createdAt: "asc" },
            take: 15, // Keep last 15 messages for context
        });
        // Map Prisma model to OpenAI type
        history = fetchedHistory.map(h => ({
            role: h.role as "user" | "assistant",
            content: h.content,
        })) as OpenAI.Chat.Completions.ChatCompletionMessage[];
    } catch (e) {
        console.error("History fetch error:", e);
    }

    // 4. Construct System Prompt
    const servicesContext = services.map(s => {
        const products = s.products.map(p => `- ${p.name}`).join("\n");
        return `### ${s.title}\n${s.description}\nProduk:\n${products || "Informasi produk tersedia di website."}`;
    }).join("\n\n");

    const projectsContext = projects.map(p => `- ${p.title} (${p.service?.title || "Solusi Digital"})`).join("\n");

    const systemPrompt = `
Anda adalah Asisten AI Resmi dari PT. USSI ItQan Tekno Solusi (USSI ITS).
Tugas Anda adalah memberikan informasi profesional dan konsultatif kepada calon klien (seperti BPR, Koperasi, LKM, dan institusi keuangan mikro lainnya).

PROFIL PERUSAHAAN:
${settings.site_description || "Penyedia ekosistem digital perbankan mikro terpercaya."}
Alamat: ${settings.contact_address || "Jakarta, Indonesia"}
WhatsApp Support: ${settings.whatsapp_number || "-"}

LAYANAN & PRODUK KAMI:
${servicesContext}

PROYEK TERBARU:
${projectsContext}

INSTRUKSI PENTING:
- Gunakan Bahasa Indonesia yang FORMAL dan PROFESIONAL.
- Gunakan FORMAT MARKDOWN untuk membuat jawaban lebih mudah dibaca (gunakan bold **teks** untuk poin penting, gunakan bullet points untuk daftar layanan, dsb).
- Berikan jawaban yang terstruktur dan rapi agar pengunjung nyaman membaca di website.
- Fokus pada solusi IBS Core System, Mobile Banking, dan digitalisasi lembaga keuangan.
- Jika pengunjung tertarik pada produk atau bertanya tentang harga, mintalah data mereka: Nama Lengkap, Nomor WhatsApp, dan Nama Instansi (BPR/Koperasi).
- Setelah mendeteksi Nama, Nomor WhatsApp, dan Nama Instansi, gunakan tool 'create_inquiry' untuk menyimpan data calon klien tersebut.
- Jika pengguna ingin berbicara dengan manusia, berikan link WhatsApp Kami: [Hubungi Tim Sales di WhatsApp](${settings.whatsapp_url}) (Pastikan menggunakan format markdown [Teks](URL) agar muncul sebagai tombol).
- Jangan memberikan informasi di luar lingkup USSI ITS.
`;

    const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
      { role: "system", content: systemPrompt },
      ...history.map((h) => ({ role: h.role, content: h.content })),
      { role: "user", content: message },
    ];

    // 5. Call OpenAI with tools (with Retry & IP Passthrough)
    const response = await callOpenAIWithRetry(() => openai.chat.completions.create({
      model: MODEL_NAME,
      messages,
      tools: [
        {
          type: "function",
          function: {
            name: "create_inquiry",
            description: "Menyimpan data prospek/calon klien yang tertarik dengan produk USSI ITS.",
            parameters: {
              type: "object",
              properties: {
                fullName: { type: "string", description: "Nama lengkap calon klien" },
                phone: { type: "string", description: "Nomor WhatsApp/Telepon yang bisa dihubungi" },
                companyName: { type: "string", description: "Nama BPR atau Koperasi asal" },
                message: { type: "string", description: "Ringkasan ketertarikan atau pertanyaan user" },
              },
              required: ["fullName", "phone", "companyName"],
            },
          },
        },
      ],
      tool_choice: "auto",
    }, {
      // Meneruskan IP asli user ke Gateway agar tidak dianggap spam dari satu IP Hosting
      headers: {
        "X-Forwarded-For": ip,
        "X-Real-IP": ip,
        "CF-Connecting-IP": ip
      }
    }));

    const aiResponse = response.choices[0].message;

    // 6. Handle Tool Calls
    if (aiResponse.tool_calls && aiResponse.tool_calls.length > 0) {
      const toolCall = aiResponse.tool_calls[0];
      
      if (toolCall.type === "function" && toolCall.function.name === "create_inquiry") {
        let toolResult;
        try {
            // SAFE PARSING: Prevent crash on malformed AI output
            const args = JSON.parse(toolCall.function.arguments);
            
            // DATABASE EXECUTION
            await db.inquiry.create({
              data: {
                fullName: args.fullName,
                email: "-", // Default placeholder
                phone: args.phone,
                companyName: args.companyName,
                message: args.message || "Tertarik melalui Chat AI",
                status: "New",
              },
            });

            toolResult = "SUCCESS: Data prospek berhasil disimpan. Beritahu user tim sales akan menghubungi mereka.";
        } catch (e) {
            console.error("Agent Tool Execution Error:", e);
            toolResult = `ERROR: Gagal menyimpan data. Pastikan format benar. Error: ${e instanceof Error ? e.message : "Internal Error"}`;
        }

        // SECOND STEP: Agent Observes Tool Result & Responds (with IP Passthrough)
        const secondResponse = await callOpenAIWithRetry(() => openai.chat.completions.create({
          model: MODEL_NAME,
          messages: [
            ...messages,
            aiResponse,
            {
              role: "tool",
              tool_call_id: toolCall.id,
              content: toolResult
            }
          ],
        }, {
          headers: {
            "X-Forwarded-For": ip,
            "X-Real-IP": ip,
          }
        }));

        const finalContent = secondResponse.choices[0].message.content || "Terima kasih, data Anda sudah kami terima.";
        
        // Log final conversation
        await db.aiChatMessage.createMany({
          data: [
            { sessionId: currentSessionId, role: "user", content: message },
            { sessionId: currentSessionId, role: "assistant", content: finalContent },
          ],
        }).catch(err => console.error("History logging error:", err));

        return NextResponse.json({
          content: finalContent,
          sessionId: currentSessionId,
        });
      }
    }

    // 7. Standard Response (No Tool Call)
    const finalContent = aiResponse.content || "Maaf, saya tidak bisa memproses permintaan Anda saat ini.";
    
    await db.aiChatMessage.createMany({
      data: [
        { sessionId: currentSessionId, role: "user", content: message },
        { sessionId: currentSessionId, role: "assistant", content: finalContent },
      ],
    }).catch(err => console.error("History logging error:", err));

    return NextResponse.json({
      content: finalContent,
      sessionId: currentSessionId,
    });

  } catch (error: unknown) {
    console.error("Chat API Error:", error);
    const errorMessage = error instanceof Error ? error.message : "Terjadi kesalahan tidak dikenal.";
    return NextResponse.json(
      { error: "Terjadi kesalahan pada server AI.", details: errorMessage },
      { status: 500 }
    );
  }
}
