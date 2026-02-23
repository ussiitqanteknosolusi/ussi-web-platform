import { db } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { getSiteSettings, getWhatsAppUrl } from "@/lib/settings";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

interface PageProps {
  params: Promise<{ slug: string; productSlug: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const [{ productSlug }, settings] = await Promise.all([
    params,
    getSiteSettings()
  ]);
  
  const product = await db.product.findUnique({
    where: { slug: productSlug },
    include: {
      service: {
        select: {
          title: true,
        },
      },
    },
  });

  if (!product) {
    return {
      title: `Product Not Found | ${settings.site_title}`,
    };
  }

  return {
    title: `${product.name} | ${product.service.title} | ${settings.site_title}`,
    description: product.description || `Detail produk ${product.name}`,
  };
}

export default async function ProductDetailPage({ params }: PageProps) {
  const [{ slug, productSlug }, settings] = await Promise.all([
    params,
    getSiteSettings()
  ]);
  
  const product = await db.product.findUnique({
    where: { slug: productSlug },
    include: {
      service: {
        select: {
          id: true,
          title: true,
          slug: true,
        },
      },
      prices: {
        orderBy: { displayOrder: "asc" },
      },
    },
  });

  if (!product || product.service.slug !== slug) {
    notFound();
  }

  const features = Array.isArray(product.features) ? product.features : [];

  const jsonLd = {
    "@context": "https://schema.org/",
    "@type": "Product",
    name: product.name,
    image: product.detailImage ? `${process.env.NEXT_PUBLIC_APP_URL}${product.detailImage}` : undefined,
    description: product.description,
    brand: {
      "@type": "Brand",
      name: "USSI ITS"
    },
    offers: {
      "@type": "AggregateOffer",
      url: `${process.env.NEXT_PUBLIC_APP_URL}/layanan/${slug}/${productSlug}`,
      priceCurrency: "IDR",
      lowPrice: product.prices[0]?.price ? Number(product.prices[0].price) : 0,
      offerCount: product.prices.length,
      availability: "https://schema.org/InStock"
    }
  };

  return (
    <div className="min-h-screen bg-background pt-32 pb-20">
      <div className="container mx-auto px-4 md:px-6">
        {/* Back Button */}
        <Button asChild variant="ghost" className="mb-8">
          <Link href={`/layanan/${slug}`}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Kembali ke {product.service.title}
          </Link>
        </Button>

        {/* Product Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            {product.name}
          </h1>
          {product.description && (
            <p className="text-lg text-muted-foreground mb-8">
              {product.description}
            </p>
          )}

          {product.prices.length > 0 ? (
            <div className="max-w-5xl mx-auto px-12 md:px-0">
              <Carousel
                opts={{
                  align: "start",
                }}
                className="w-full"
              >
                <CarouselContent className="-ml-4">
                  {product.prices.map((price) => (
                    <CarouselItem key={price.id} className="pl-4 basis-full md:basis-1/3">
                      <div className="h-full">
                        <div
                          className={`bg-card rounded-xl p-6 shadow-sm border-2 flex flex-col h-full ${
                            price.isBestValue ? "border-primary relative" : "border-border"
                          }`}
                        >
                          {price.isBestValue && (
                            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-medium">
                              Best Value
                            </div>
                          )}
                          <h3 className="text-xl font-bold mb-2">{price.name}</h3>
                          <div className="mb-6">
                            {parseFloat(price.price.toString()) === 0 ? (
                              <>
                                <p className="text-sm text-muted-foreground mb-1 whitespace-nowrap">Harga</p>
                                <p className="text-xl md:text-2xl font-bold text-primary whitespace-nowrap tracking-tight">
                                    Hubungi Kami
                                </p>
                              </>
                            ) : (
                              <>
                                <p className="text-sm text-muted-foreground mb-1 whitespace-nowrap">Mulai dari</p>
                                <p className="text-2xl md:text-3xl font-bold text-primary whitespace-nowrap tracking-tight">
                                  Rp {parseFloat(price.price.toString()).toLocaleString("id-ID")}
                                </p>
                              </>
                            )}
                          </div>
                          
                          {Array.isArray(price.features) && price.features.length > 0 && (
                            <ul className="space-y-3 mb-8 flex-1 text-left">
                              {(price.features as string[]).map((feature, idx) => (
                                <li key={idx} className="flex items-start gap-3 text-sm">
                                  <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                                    <svg className="w-3 h-3 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                  </div>
                                  <span>{feature}</span>
                                </li>
                              ))}
                            </ul>
                          )}

                          <Button asChild className="w-full mt-auto" variant={price.isBestValue ? "default" : "outline"}>
                            <Link
                              href={price.whatsappUrl || getWhatsAppUrl(settings, `Halo, saya tertarik dengan produk ${product.name} paket ${price.name}, mohon info lebih lanjut.`)}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              Pilih Paket
                            </Link>
                          </Button>
                        </div>
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
              </Carousel>
            </div>
          ) : (
            <div className="inline-block bg-muted/50 rounded-2xl px-6 py-4">
              <p className="text-muted-foreground">Hubungi kami untuk penawaran harga terbaik</p>
            </div>
          )}
        </div>

        {/* Product Detail Image */}
        {product.detailImage && (
          <div className="relative w-full h-[500px] rounded-2xl overflow-hidden mb-16">
            <Image
              src={product.detailImage}
              alt={product.name}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}

        {/* Features */}
        {features.length > 0 && (
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center">Fitur Produk</h2>
            <div className="grid md:grid-cols-2 gap-4">

              {(features as string[]).map((feature, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg
                      className="w-4 h-4 text-primary"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <p className="text-sm">{String(feature)}</p>
                </div>
              ))}

            </div>
          </div>
        )}

        {/* CTA Section */}
        <div className="mt-16 text-center">
          <div className="bg-muted/50 rounded-2xl p-8 md:p-12 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold mb-4">Tertarik dengan produk ini?</h3>
            <p className="text-muted-foreground mb-6">
              Hubungi tim marketing kami untuk informasi lebih lanjut dan penawaran terbaik
            </p>
            <Button asChild size="lg">
              <Link
                href={getWhatsAppUrl(settings, `Halo, saya tertarik dengan produk ${product.name}, mohon info lebih lanjut.`)}
                target="_blank"
                rel="noopener noreferrer"
              >
                Tanya Marketing
              </Link>
            </Button>
          </div>
        </div>
      </div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </div>
  );
}
