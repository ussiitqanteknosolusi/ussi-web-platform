"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Pagination } from "@/components/ui/pagination";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface Product {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  thumbnail: string | null;
  features: unknown;
}

interface ProductsGridProps {
  products: Product[];
  serviceSlug: string;
  itemsPerPage?: number;
}

export function ProductsGrid({ products, serviceSlug, itemsPerPage = 9 }: ProductsGridProps) {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(products.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProducts = products.slice(startIndex, endIndex);

  return (
    <>
      <div className={
        products.length === 1 
          ? "flex justify-center" 
          : "grid md:grid-cols-2 lg:grid-cols-3 gap-6"
      }>
        {currentProducts.map((product) => {
          const features = Array.isArray(product.features) ? product.features.slice(0, 3) : [];
          
          return (
            <div
              key={product.id}
              className={cn(
                "border rounded-xl overflow-hidden hover:shadow-lg transition-shadow",
                products.length === 1 && "max-w-md w-full"
              )}
            >
              {product.thumbnail && (
                <div className="relative w-full h-48">
                  <Image
                    src={product.thumbnail}
                    alt={product.name}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">{product.name}</h3>
                <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                  {product.description || "Solusi terbaik untuk kebutuhan Anda"}
                </p>
                
                {features.length > 0 && (
                  <ul className="space-y-2 mb-4">
                    {features.map((feature: string, idx: number) => (
                      <li key={idx} className="flex items-start gap-2 text-sm">
                        <Check className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                )}
                
                <Button asChild variant="outline" className="w-full">
                  <Link href={`/layanan/${serviceSlug}/${product.slug}`}>
                    Lihat Detail
                  </Link>
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </>
  );
}
