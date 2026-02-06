"use client";

import { Award, Target, Headphones, CheckCircle2, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

const reasons = [
  {
    number: "01",
    icon: Award,
    title: "Pengalaman",
    description: "Kemudahan akan transformasi bisnis Anda ke dunia digital menjadi lebih mudah, cepat, dan efisien dengan menggunakan aplikasi software produk USSI. Optimal, mudah diintegrasikan, dan fleksibel dalam pengembangan bisnis menggunakan platform software USSI. Kematangan sistem yang relevan dengan perkembangan teknologi yang berkelanjutan.",
    highlights: [
      "Pengalaman luas dalam transformasi digital",
      "Sistem yang optimal dan mudah diintegrasikan",
      "Fleksibel dalam pengembangan bisnis",
      "Kematangan sistem yang relevan dengan perkembangan teknologi"
    ]
  },
  {
    number: "02",
    icon: Target,
    title: "Kompetensi dan Komitmen",
    description: "USSI Group berkomitmen menghadirkan produk dan layanan yang mendukung pertumbuhan industri keuangan mikro. Setiap solusi kami dirancang untuk memperkuat lembaga keuangan mikro dengan teknologi modern dan inovatif.",
    extendedDescription: "Produk utama kami, Integrated microBanking System (IBS), menjadi solusi utama dalam operasional keuangan mikro. Dengan pendekatan continual improvement, setiap pembaruan produk membawa inovasi yang lebih baik, menjawab kebutuhan industri yang terus berkembang.",
    highlights: [
      "Produk Terintegrasi: IBS sebagai solusi lengkap untuk lembaga keuangan mikro",
      "Inovasi Berkelanjutan: Setiap versi terbaru adalah penyempurnaan dari sebelumnya",
      "Fokus pada Industri Keuangan Mikro: Dirancang sesuai kebutuhan lembaga keuangan mikro"
    ]
  },
  {
    number: "03",
    icon: Headphones,
    title: "Purna Jual",
    description: "Jaringan layanan purna jual USSI tersebar di 12 kota besar di Indonesia. Kami tidak hanya memperluas cakupan layanan, tetapi juga meningkatkan kapasitas SDM untuk memastikan layanan yang cepat dan berkualitas. Selain itu, produk USSI terus diperbarui agar semakin mudah dalam troubleshooting, backup sistem, dan system crash recovery.",
    highlights: []
  },
  {
    number: "04",
    icon: CheckCircle2,
    title: "Kualitas Produk",
    description: "USSI berkomitmen menghadirkan produk berkelas dunia dengan menerapkan berbagai metode pengembangan software mutakhir, seperti Object-Oriented Programming (OOP), Unified Modeling Language (UML), SQL Database System, Client-Server Architecture, dan Three-Tier Architecture. Kami juga mengadopsi Switching Technology berbasis ISO8583, XML, serta teknologi ATM (NDC) dan EDC untuk transaksi keuangan modern.",
    highlights: []
  }
];

export default function WhyChooseUs() {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);

  const toggleExpand = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <section className="py-24 bg-primary relative overflow-hidden w-full">
      {/* Background Decoration */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute top-20 right-10 w-72 h-72 bg-accent rounded-full blur-[100px]" />
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-white rounded-full blur-[100px]" />
      </div>

      <div className="container px-4 md:px-6 relative z-10">
        {/* Header */}
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold tracking-tight text-primary-foreground sm:text-4xl mb-4">
            Mengapa Harus Memilih USSI
          </h2>
          <p className="text-primary-foreground/80 text-lg leading-relaxed">
            Dengan total penjualan dan implementasi di ribuan Lembaga Keuangan dan Perbankan Mikro di seluruh Indonesia, 
            menjadikan USSI sebagai satu-satunya provider sistem informasi yang paling berpengalaman dan paling memahami 
            berbagai seluk beluk permasalahan implementasi sistem informasi di lembaga keuangan dan mikro. Produk-produk 
            kami juga telah tersebar diseluruh Indonesia mulai dari Nangro Aceh Darussalam sampai Papua.
          </p>
        </div>

        {/* Reasons List */}
        <div className="flex flex-col gap-8 max-w-4xl mx-auto">
          {reasons.map((reason, index) => (
            <div
              key={reason.number}
              className={cn(
                "group relative bg-card border border-border rounded-2xl hover:shadow-xl transition-all duration-300 self-start",
                expandedIndex === index && "shadow-xl"
              )}
            >
              {/* Number Badge */}
              <div className="absolute -top-4 -left-4 w-16 h-16 bg-accent text-accent-foreground rounded-full flex items-center justify-center font-bold text-xl shadow-lg z-10">
                {reason.number}
              </div>

              {/* Clickable Header */}
              <button
                onClick={() => toggleExpand(index)}
                className="w-full text-left p-8 flex items-start justify-between gap-4 hover:bg-muted/5 transition-colors rounded-t-2xl"
              >
                <div className="flex items-center gap-4 flex-1">
                  {/* Icon */}
                  <div className="p-3 bg-accent/10 rounded-lg flex-shrink-0">
                    <reason.icon className="h-8 w-8 text-accent" />
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold">{reason.title}</h3>
                </div>
                
                {/* Expand/Collapse Icon */}
                <ChevronDown 
                  className={cn(
                    "h-6 w-6 text-primary transition-transform duration-300 flex-shrink-0",
                    expandedIndex === index && "rotate-180"
                  )} 
                />
              </button>

              {/* Expandable Content */}
              <div 
                className={cn(
                  "overflow-hidden transition-all duration-300",
                  expandedIndex === index ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"
                )}
              >
                <div className="px-8 pb-8 pt-0">
                  {/* Description */}
                  <p className="text-muted-foreground mb-4 leading-relaxed">
                    {reason.description}
                  </p>

                  {/* Extended Description (if exists) */}
                  {reason.extendedDescription && (
                    <p className="text-muted-foreground mb-4 leading-relaxed">
                      {reason.extendedDescription}
                    </p>
                  )}

                  {/* Highlights */}
                  {reason.highlights.length > 0 && (
                    <ul className="space-y-3 mt-6">
                      {reason.highlights.map((highlight, idx) => (
                        <li key={idx} className="flex items-start gap-3">
                          <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                          <span className="text-sm text-foreground leading-relaxed">{highlight}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>

              {/* Decorative line */}
              <div 
                className={cn(
                  "absolute bottom-0 left-8 right-8 h-1 bg-gradient-to-r from-primary/0 via-primary/50 to-primary/0 rounded-full transition-opacity duration-300",
                  expandedIndex === index ? "opacity-100" : "opacity-0"
                )} 
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
