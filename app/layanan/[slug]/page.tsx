import { db } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { ProductsGrid } from "@/components/products/ProductsGrid";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  
  const service = await db.service.findUnique({
    where: { slug },
  });

  if (!service) {
    return {
      title: "Service Not Found",
    };
  }

  return {
    title: `${service.title} | USSI ITS`,
    description: service.metaDescription || service.description || `Layanan ${service.title} dari USSI ITS`,
  };
}

export default async function ServiceDetailPage({ params }: PageProps) {
  const { slug } = await params;
  
  const service = await db.service.findUnique({
    where: { slug },
    include: {
      products: {
        where: { isActive: true },
        orderBy: { displayOrder: "asc" },
      },
    },
  });

  if (!service) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-background pt-32 pb-20">
      <div className="container mx-auto px-4 md:px-6">
        {/* Header with Image */}
        <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center mb-16">
          {/* Left: Description */}
          <div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              {service.title}
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              {service.description || "Solusi teknologi untuk kebutuhan bisnis Anda"}
            </p>
          </div>

          {/* Right: Square Hero Image */}
          <div className="relative aspect-square rounded-2xl overflow-hidden bg-muted">
            {service.heroImage ? (
              <Image
                src={service.heroImage}
                alt={service.title}
                fill
                className="object-cover"
                priority
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

        {/* Products Section */}
        {service.products.length > 0 && (
          <div className="mb-20">
            <h2 className="text-3xl font-bold mb-8 text-center">Produk Kami</h2>
            <ProductsGrid 
              products={service.products} 
              serviceSlug={slug}
              itemsPerPage={9}
            />
          </div>
        )}

        {/* Empty State */}
        {service.products.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              Informasi produk akan segera tersedia
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
