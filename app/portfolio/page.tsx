import { db } from "@/lib/prisma";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export const metadata = {
  title: "Portofolio | USSI ITS",
  description: "Lihat hasil karya dan proyek yang telah kami kerjakan untuk berbagai klien di industri keuangan mikro.",
};

export default async function PortfolioPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const resolvedSearchParams = await searchParams;
  const categorySlug = resolvedSearchParams.category;

  // Build the where clause
  const where: any = {
    status: "Completed",
  };

  if (categorySlug) {
    where.service = {
      slug: categorySlug,
    };
  }

  // Fetch projects and services in parallel
  const [projects, services] = await Promise.all([
    db.project.findMany({
      where,
      orderBy: {
        projectDate: "desc",
      },
      include: {
        client: true,
        service: true,
      },
    }),
    db.service.findMany({
      where: {
        isActive: true,
      },
      orderBy: {
        title: "asc",
      },
    }),
  ]);

  return (
    <div className="min-h-screen pt-24 pb-12">
      {/* Hero Section */}
      <div className="bg-primary text-primary-foreground py-16 md:py-24 mb-12">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Portofolio Kami</h1>
          <p className="text-lg text-primary-foreground/80 max-w-2xl mx-auto">
            Bukti nyata komitmen kami dalam menghadirkan solusi teknologi terbaik bagi lembaga keuangan mikro di Indonesia.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4">
        {/* Category Filter */}
        <div className="flex gap-3 md:gap-4 mb-12 overflow-x-auto justify-start md:justify-center pb-2 scrollbar-hide">
          <Button 
            asChild 
            variant={!categorySlug ? "default" : "outline"}
            className="rounded-full whitespace-nowrap flex-shrink-0"
          >
            <Link href="/portfolio">Semua Project</Link>
          </Button>
          {services.map((service) => (
            <Button
              key={service.id}
              asChild
              variant={categorySlug === service.slug ? "default" : "outline"}
              className="rounded-full whitespace-nowrap flex-shrink-0"
            >
              <Link href={`/portfolio?category=${service.slug}`}>
                {service.title}
              </Link>
            </Button>
          ))}
        </div>

        {projects.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">
            <p className="text-xl">Belum ada portofolio yang ditampilkan untuk kategori ini.</p>
            {categorySlug && (
                <Button variant="link" asChild className="mt-4">
                    <Link href="/portfolio">Lihat Semua Project</Link>
                </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project) => (
              <div 
                key={project.id} 
                className="group bg-card border rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col h-full"
              >
                {/* Thumbnail */}
                <div className="relative h-64 w-full bg-muted overflow-hidden">
                  {project.thumbnailUrl ? (
                    <Image
                      src={project.thumbnailUrl}
                      alt={project.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-muted-foreground bg-secondary/20">
                      No Image
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <Button asChild variant="secondary" className="translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                      <Link href={`/portfolio/${project.slug}`}>Lihat Detail</Link>
                    </Button>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 flex flex-col flex-grow">
                  <div className="flex items-center justify-between mb-4">
                     {project.service ? (
                         <Badge variant="outline" className="text-xs font-normal">
                             {project.service.title}
                         </Badge>
                     ) : (
                         <span className="text-xs text-muted-foreground">Project</span>
                     )}
                     <span className="text-xs text-muted-foreground">
                        {project.projectDate ? new Date(project.projectDate).toLocaleDateString("id-ID", { year: 'numeric', month: 'long' }) : ""}
                     </span>
                  </div>

                  <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                    <Link href={`/portfolio/${project.slug}`}>
                        {project.title}
                    </Link>
                  </h3>

                  {project.client && (
                    <div className="text-sm text-muted-foreground mb-4">
                      Klien: <span className="font-medium text-foreground">{project.client.name}</span>
                    </div>
                  )}

                  <p className="text-muted-foreground text-sm line-clamp-3 mb-6 flex-grow">
                    {project.description}
                  </p>

                  <div className="mt-auto pt-4 border-t border-border">
                    <Link 
                      href={`/portfolio/${project.slug}`}
                      className="inline-flex items-center text-sm font-semibold text-primary hover:text-primary/80 transition-colors"
                    >
                      Pelajari Selengkapnya <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
