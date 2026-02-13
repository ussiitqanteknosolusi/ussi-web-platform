import ProductPortfolio, { PortfolioItem } from "@/components/sections/ProductPortfolio";
import { db } from "@/lib/prisma";

export default async function ProductsPage() {
  const projects = await db.project.findMany({
    where: { status: "Completed" },
    orderBy: { projectDate: "desc" },
    select: {
      id: true,
      title: true,
      description: true,
      thumbnailUrl: true,
      service: { select: { slug: true, title: true } },
    },
  });

  // Transform DB data to UI format
  const portfolioItems: PortfolioItem[] = projects.map(p => ({
    id: p.id,
    title: p.title,
    // Map service slug/title to category logic or default to 'tech'
    category: mapServiceToCategory(p.service?.slug || ""), 
    description: p.description || "",
    image: p.thumbnailUrl || "/images/placeholder-project.jpg",
    tags: p.service ? [p.service.title] : ["Project"],
  }));

  return (
    <div className="pt-20 min-h-screen bg-background">
      <div className="container py-16 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">Project & Produk</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Eksplorasi inovasi kami di berbagai lini bisnis, mulai dari teknologi finansial hingga strategi digital kreatif.
        </p>
      </div>
      <ProductPortfolio items={portfolioItems} />
    </div>
  );
}

// Helper to map existing service slugs to hardcoded categories in filter
function mapServiceToCategory(slug: string): string {
    if (slug.includes("ibs") || slug.includes("core") || slug.includes("masking")) return "tech";
    if (slug.includes("social") || slug.includes("seo")) return "digmar";
    if (slug.includes("branding") || slug.includes("design")) return "creative";
    if (slug.includes("training") || slug.includes("academy")) return "training";
    return "tech"; // Default
}
