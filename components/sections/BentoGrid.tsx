"use client";

import { Server, Smartphone, CreditCard, ArrowRight, MessageSquare, Mail, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";

const products = [
  {
    title: "IBS CORE",
    description: "Sistem inti perbankan mikro yang tangguh, modular, dan sesuai regulasi OJK.",
    icon: Server,
    image: "/images/products/IBS-core.png",
    color: "text-primary",
  },
  {
    title: "IBS LITE",
    description: "Solusi core banking ringan untuk operasional mikro yang efisien.",
    icon: CreditCard,
    image: "/images/products/IBS-LITE.png",
    color: "text-blue-600",
  },
  {
    title: "IBS MOBILE",
    description: "Mobile banking white-label untuk kemudahan transaksi nasabah.",
    icon: Smartphone,
    image: "/images/products/ibs-mobile.png",
    color: "text-accent",
  },
  {
    title: "WA MASKING",
    description: "Layanan notifikasi WhatsApp resmi dengan nama institusi Anda.",
    icon: MessageSquare,
    image: "/images/products/wa-masking.png",
    color: "text-green-600",
  },
  {
    title: "SMS MASKING",
    description: "Notifikasi SMS broadcast terpercaya ke seluruh provider seluler.",
    icon: Mail,
    image: "/images/products/sms-masking.png",
    color: "text-orange-600",
  },
];

export default function BentoGrid() {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { 
      loop: true,
      align: "start",
      skipSnaps: false,
    },
    [Autoplay({ delay: 4000, stopOnInteraction: true })]
  );

  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
    setCanScrollPrev(emblaApi.canScrollPrev());
    setCanScrollNext(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
  }, [emblaApi, onSelect]);

  return (
    <section id="products" className="py-24 bg-muted/30 w-full overflow-hidden">
      <div className="container px-4 md:px-6">
        <div className="text-center mb-16 max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl mb-4">
            Produk & Layanan Unggulan
          </h2>
          <p className="text-muted-foreground text-lg">
            Solusi teknologi komprehensif untuk lembaga keuangan mikro modern.
          </p>
        </div>

        {/* Universal Carousel */}
        <div className="relative max-w-7xl mx-auto">
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex">
              {products.map((product) => (
                <div 
                  key={product.title} 
                  className="flex-[0_0_85%] md:flex-[0_0_45%] lg:flex-[0_0_calc(33.333%-1rem)] min-w-0 pl-4"
                >
                    <Card className="h-full border-border/50 bg-card hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden relative flex flex-col">
                      {/* Decorative Line */}
                      <div className={cn(
                        "absolute top-0 left-0 w-1 h-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20",
                        product.title.includes("CORE") ? "bg-primary" : "bg-accent"
                      )} />
                      
                      {/* Image Section */}
                      <div className="relative w-full aspect-video overflow-hidden bg-muted/50 p-6">
                        <div className="absolute inset-0 bg-gradient-to-t from-background/10 to-transparent z-10 pointer-events-none" />
                        <Image 
                          src={product.image} 
                          alt={product.title}
                          fill
                          className="object-contain transition-transform duration-700 group-hover:scale-110 drop-shadow-md"
                        />
                      </div>

                      {/* Content Section */}
                      <div className="flex flex-col p-6 flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <div className={cn("p-2 rounded-lg bg-muted/50", product.color)}>
                            <product.icon className="h-5 w-5" />
                          </div>
                          <h3 className="text-lg font-bold group-hover:text-primary transition-colors">
                            {product.title}
                          </h3>
                        </div>
                        
                        <p className="text-muted-foreground text-sm line-clamp-3 mb-4 flex-1">
                          {product.description}
                        </p>
                       
                        <div className="flex items-center text-sm font-medium text-primary mt-auto group-hover:underline decoration-primary/30 underline-offset-4">
                          Pelajari Selengkapnya <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </div>
                      </div>
                    </Card>
                </div>
              ))}
            </div>
          </div>

          {/* Carousel Controls */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <button
              onClick={scrollPrev}
              disabled={!canScrollPrev}
              className="p-2 md:p-3 rounded-full bg-primary/10 text-primary disabled:opacity-30 disabled:cursor-not-allowed hover:bg-primary/20 transition-colors"
              aria-label="Previous"
            >
              <ChevronLeft className="h-5 w-5 md:h-6 md:w-6" />
            </button>
            
            <div className="flex gap-2">
              {products.map((_, index) => (
                <button
                  key={index}
                  onClick={() => emblaApi?.scrollTo(index)}
                  className={cn(
                    "h-2 rounded-full transition-all",
                    index === selectedIndex 
                      ? "w-8 bg-primary" 
                      : "w-2 bg-primary/30"
                  )}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>

            <button
              onClick={scrollNext}
              disabled={!canScrollNext}
              className="p-2 md:p-3 rounded-full bg-primary/10 text-primary disabled:opacity-30 disabled:cursor-not-allowed hover:bg-primary/20 transition-colors"
              aria-label="Next"
            >
              <ChevronRight className="h-5 w-5 md:h-6 md:w-6" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
