import { db } from "@/lib/prisma";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { getSiteSettings, getWhatsAppUrl } from "@/lib/settings";

export const metadata = {
  title: "Layanan Kami | USSI ITS",
  description: "Solusi teknologi terpadu untuk transformasi digital bisnis Anda",
};

export default async function LayananPage() {
  const [services, settings] = await Promise.all([
    db.service.findMany({
      where: { isActive: true },
      include: {
        _count: {
          select: { products: true }
        }
      },
      orderBy: { createdAt: "asc" },
    }),
    getSiteSettings(),
  ]);

  const ctaWhatsAppUrl = getWhatsAppUrl(settings, "Halo USSI ITS, saya tertarik dengan layanan Anda");

  return (
    <div className="min-h-screen bg-background pt-32 pb-20">
      <div className="container mx-auto px-4 md:px-6">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Layanan <span className="text-primary">Kami</span>
          </h1>
          <p className="text-lg text-muted-foreground">
            Solusi teknologi terpadu untuk transformasi digital bisnis Anda
          </p>
        </div>

        {/* Services List */}
        <div className="space-y-8 max-w-6xl mx-auto">
          {services.map((service, index) => (
            <div
              key={service.id}
              className="group bg-card border border-border rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 hover:border-primary/50"
            >
              <div className={`grid md:grid-cols-2 gap-0 ${index % 2 === 1 ? 'md:grid-flow-dense' : ''}`}>
                {/* Content Side */}
                <div className={`p-8 md:p-12 flex flex-col justify-center ${index % 2 === 1 ? 'md:col-start-2' : ''}`}>
                  <h3 className="text-3xl font-bold mb-4 group-hover:text-primary transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-muted-foreground mb-6 leading-relaxed line-clamp-3">
                    {service.description || "Solusi teknologi untuk kebutuhan bisnis Anda"}
                  </p>
                  
                  <div className="flex items-center gap-6 mb-6">
                    <span className="text-sm text-muted-foreground">
                      {service._count.products} produk tersedia
                    </span>
                  </div>

                  <div>
                    <Button asChild className="group-hover:shadow-lg transition-shadow">
                      <Link href={`/layanan/${service.slug}`}>
                        Lihat Detail
                        <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </Button>
                  </div>
                </div>

                {/* Image Side */}
                <div className={`relative h-64 md:h-full min-h-[300px] bg-muted ${index % 2 === 1 ? 'md:col-start-1 md:row-start-1' : ''}`}>
                  {service.heroImage ? (
                    <Image
                      src={service.heroImage}
                      alt={service.title}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center text-muted-foreground">
                        <svg
                          className="w-16 h-16 mx-auto mb-2 opacity-20"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                        <p className="text-sm">No image</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="mt-20 text-center bg-muted rounded-2xl p-12">
          <h2 className="text-3xl font-bold mb-4">
            Butuh Konsultasi?
          </h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Tim kami siap membantu Anda menemukan solusi terbaik untuk kebutuhan bisnis Anda
          </p>
          <Button asChild size="lg">
            <a 
              href={ctaWhatsAppUrl} 
              target="_blank"
              rel="noopener noreferrer"
            >
              Hubungi Kami
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
}
