"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

// Kategori Filter
const categories = [
  { id: "all", label: "Semua" },
  { id: "tech", label: "Teknologi" },
  { id: "digmar", label: "Digital Marketing" },
  { id: "creative", label: "Creative & Branding" },
  { id: "training", label: "Training & Consultant" },
];

// Interface data dari Database
export interface PortfolioItem {
  id: number;
  title: string;
  category: string;
  description: string;
  image: string;
  tags: string[];
}

interface ProductPortfolioProps {
  items: PortfolioItem[];
}

export default function ProductPortfolio({ items }: ProductPortfolioProps) {
  const [activeCategory, setActiveCategory] = useState("all");

  const filteredProducts = activeCategory === "all"
    ? items
    : items.filter(p => p.category === activeCategory);

  return (
    <section className="py-12">
      <div className="container px-4 md:px-6">
        
        {/* Filter Link Tabs */}
        <div className="flex gap-6 md:gap-8 mb-16 animate-in fade-in slide-in-from-bottom-4 overflow-x-auto justify-center pb-2 scrollbar-hide">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={cn(
                "text-lg font-medium transition-colors hover:text-foreground relative px-2 py-1 whitespace-nowrap flex-shrink-0",
                activeCategory === cat.id 
                  ? "text-foreground font-bold" 
                  : "text-muted-foreground"
              )}
            >
              {cat.label}
              {activeCategory === cat.id && (
                <motion.div 
                  layoutId="underline"
                  className="absolute left-0 right-0 -bottom-1 h-0.5 bg-primary"
                />
              )}
            </button>
          ))}
        </div>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence mode="popLayout">
            {filteredProducts.map((product) => (
              <motion.div
                layout
                key={product.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                className="group relative bg-card border border-border rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300"
              >
                 {/* Image Container */}
                 <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                    <Image
                      src={product.image}
                      alt={product.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <Button variant="secondary" size="sm" className="gap-2 rounded-full">
                           Lihat Detail <ArrowUpRight className="w-4 h-4" />
                        </Button>
                    </div>
                 </div>

                 {/* Content */}
                 <div className="p-6">
                    <h3 className="text-xl font-bold text-card-foreground mb-2 group-hover:text-primary transition-colors">
                      {product.title}
                    </h3>
                    <p className="text-muted-foreground text-sm mb-6 line-clamp-3">
                      {product.description}
                    </p>
                    
                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mt-auto">
                      {product.tags.map(tag => (
                        <Badge key={tag} variant="secondary" className="font-normal px-4">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                 </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

      </div>
    </section>
  );
}
