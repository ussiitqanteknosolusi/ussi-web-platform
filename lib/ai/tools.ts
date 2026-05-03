import { tool } from '@openrouter/sdk/lib/tool.js';
import { z } from 'zod';
import { db } from '@/lib/prisma';

// Helper untuk "membohongi" pengecekan isZodSchema internal SDK
function createCompatibleSchema(schema: any) {
  if (schema && typeof schema === 'object' && !schema._zod) {
    schema._zod = { type: 'custom' }; 
  }
  return schema;
}

export const inquiryTool = tool({
  name: 'create_inquiry',
  description: 'Menyimpan data prospek/calon klien yang tertarik dengan produk USSI ITS.',
  inputSchema: createCompatibleSchema(z.object({
    fullName: z.string().describe('Nama lengkap calon klien'),
    phone: z.string().describe('Nomor WhatsApp/Telepon yang bisa dihubungi'),
    companyName: z.string().describe('Nama BPR atau Koperasi asal'),
    message: z.string().nullish().describe('Ringkasan ketertarikan atau pertanyaan user'),
  })),
  execute: async ({ fullName, phone, companyName, message }: any) => {
    try {
      // Log info umum tanpa data sensitif
      console.log(`Tool: create_inquiry executed for ${companyName.substring(0, 3)}***`);
      await db.inquiry.create({
        data: {
          fullName,
          email: "-", 
          phone,
          companyName,
          message: message || "Tertarik melalui Chat AI",
          status: "New",
        },
      });
      return { 
        status: 'success', 
        message: 'Data prospek berhasil disimpan. Tim sales akan segera menghubungi.' 
      };
    } catch (error) {
      console.error("Agent Tool Execution Error:", error);
      return { 
        status: 'error', 
        message: `Gagal menyimpan data: ${error instanceof Error ? error.message : "Internal Error"}` 
      };
    }
  },
} as any);

export const defaultTools = [inquiryTool];
