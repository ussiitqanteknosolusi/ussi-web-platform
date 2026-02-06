"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const faqs = [
  {
    question: "Apa keunggulan USSI ITS dibandingkan penyedia layanan lainnya?",
    answer: `Keunggulan USSI ITS antara lain:

• Pengalaman luas dengan implementasi di ribuan lembaga keuangan mikro di seluruh Indonesia.
• Kompetensi dan komitmen tinggi dalam mendukung penguatan industri keuangan mikro.
• Layanan purna jual yang kuat dengan jaringan pelayanan di 12 kota besar di Indonesia.
• Produk berkualitas tinggi hasil dari riset dan pengembangan berkelanjutan.`,
  },
  {
    question: "Apakah USSI ITS menyediakan layanan konsultasi untuk lembaga keuangan?",
    answer: "Ya, USSI ITS menyediakan layanan konsultasi bagi lembaga keuangan yang ingin melakukan transformasi digital. Layanan ini mencakup asesmen kebutuhan, perencanaan sistem, implementasi teknologi, serta pelatihan bagi tim internal.",
  },
  {
    question: "Apakah produk USSI ITS sesuai dengan regulasi OJK dan BI?",
    answer: "Ya, semua produk dan layanan USSI ITS dikembangkan sesuai dengan regulasi yang ditetapkan oleh Otoritas Jasa Keuangan (OJK) dan Bank Indonesia (BI). Kami selalu memastikan kepatuhan terhadap standar industri perbankan dan keuangan di Indonesia.",
  },
  {
    question: "Apa yang Membedakan Kualitas Produk Kami dari Lainnya?",
    answer: `Di USSI ITS, kami tidak sekadar menciptakan software—kami membangun solusi berkelas dunia melalui riset dan pengembangan yang terus-menerus. Dengan menerapkan metode dan teknik pengembangan terkini, kami memastikan setiap produk yang kami hadirkan memiliki performa terbaik, aman, dan efisien.

**Pendekatan Modern:**
• Object-Oriented Programming untuk desain yang modular & scalable.
• Iterative Process guna memastikan kualitas optimal di setiap tahap pengembangan.
• UML (Unified Modelling Language) sebagai standar pemodelan sistem yang presisi.

**Arsitektur yang Andal:**
• SQL Database System untuk manajemen data yang kuat dan terstruktur.
• Client-Server & Three-Tier Architecture guna memastikan performa tinggi & efisiensi.
• Component-Based Development untuk fleksibilitas dan kemudahan pemeliharaan.

**Teknologi Transaksi Keuangan:**
• Switching Technology berbasis protokol ISO8583, XML, & proprietary protocol untuk komunikasi yang cepat dan aman.
• ATM & EDC System dengan dukungan NDC Protocol untuk transaksi tanpa hambatan.`,
  },
  {
    question: "Bagaimana cara menjadi mitra USSI ITS?",
    answer: "Untuk menjadi mitra USSI ITS, Anda dapat mengajukan permohonan melalui website resmi atau menghubungi tim kami secara langsung. Kami akan melakukan asesmen dan berdiskusi lebih lanjut mengenai kerja sama yang dapat dijalin.",
  },
];

export default function FAQ() {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const toggleExpand = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <section className="py-24 bg-muted/30 w-full">
      <div className="container px-4 md:px-6">
        {/* Header */}
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
            Pertanyaan Umum
          </h2>
          <p className="text-muted-foreground text-lg">
            Temukan jawaban atas pertanyaan yang sering diajukan tentang layanan dan produk USSI ITS
          </p>
        </div>

        {/* FAQ List */}
        <div className="max-w-4xl mx-auto space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className={cn(
                "bg-card border border-border rounded-xl overflow-hidden transition-all duration-300",
                expandedIndex === index && "shadow-lg"
              )}
            >
              {/* Question Button */}
              <button
                onClick={() => toggleExpand(index)}
                className="w-full text-left p-6 flex items-start justify-between gap-4 hover:bg-muted/50 transition-colors"
              >
                <h3 className="text-lg font-semibold pr-4 flex-1">
                  {faq.question}
                </h3>
                <ChevronDown
                  className={cn(
                    "h-5 w-5 text-primary transition-transform duration-300 flex-shrink-0 mt-1",
                    expandedIndex === index && "rotate-180"
                  )}
                />
              </button>

              {/* Answer Content */}
              <div
                className={cn(
                  "overflow-hidden transition-all duration-300",
                  expandedIndex === index ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"
                )}
              >
                <div className="px-6 pb-6 pt-0">
                  <div className="text-muted-foreground leading-relaxed whitespace-pre-line">
                    {faq.answer}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
