import { db } from "@/lib/prisma";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, Building, Tag } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const project = await db.project.findUnique({
    where: { slug: resolvedParams.slug },
  });

  if (!project) return { title: "Project Not Found" };

  return {
    title: `${project.title} | Portofolio USSI ITS`,
    description: project.description?.slice(0, 160),
  };
}

export default async function ProjectDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const project = await db.project.findUnique({
    where: { slug: resolvedParams.slug },
    include: {
      client: true,
      service: true,
      images: true, // Assuming this relation exists based on schema
    },
  });

  if (!project) notFound();

  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="container mx-auto px-4">
        {/* Breadcrumb / Back */}
        <div className="mb-8">
             <Button asChild variant="ghost" className="pl-0 hover:pl-2 transition-all">
                <Link href="/portfolio">
                    <ArrowLeft className="mr-2 h-4 w-4" /> Kembali ke Portofolio
                </Link>
             </Button>
        </div>

        {/* Hero Header */}
        <div className="grid lg:grid-cols-2 gap-12 mb-16 items-start">
            <div className="space-y-6">
                <div className="flex flex-wrap gap-2 text-sm font-medium text-muted-foreground">
                    {project.service && (
                        <Badge variant="secondary" className="flex items-center gap-1">
                            <Tag className="h-3 w-3" /> {project.service.title}
                        </Badge>
                    )}
                    {project.projectDate && (
                        <span className="flex items-center gap-1 bg-muted px-2.5 py-0.5 rounded-full text-xs">
                           <Calendar className="h-3 w-3" /> 
                           {new Date(project.projectDate).toLocaleDateString("id-ID", { year: 'numeric', month: 'long' })}
                        </span>
                    )}
                </div>

                <h1 className="text-4xl font-bold md:text-5xl leading-tight">
                    {project.title}
                </h1>

                {project.client && (
                    <div className="flex items-center gap-4 p-4 border rounded-xl bg-card shadow-sm max-w-md">
                        <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                             <Building className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                            <div className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Klien</div>
                            <div className="font-bold text-lg">{project.client.name}</div>
                            <div className="text-xs text-muted-foreground">{project.client.industry}</div>
                        </div>
                    </div>
                )}
            </div>
            
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl bg-muted">
                 {project.thumbnailUrl ? (
                    <Image
                      src={project.thumbnailUrl}
                      alt={project.title}
                      fill
                      className="object-cover"
                      priority
                    />
                 ) : (
                    <div className="flex items-center justify-center h-full text-muted-foreground">
                        No Thumbnail
                    </div>
                 )}
            </div>
        </div>

        {/* Content */}
        <div className="grid lg:grid-cols-12 gap-12">
            <div className="lg:col-span-8 space-y-12">
                <section className="prose prose-lg dark:prose-invert max-w-none">
                    <h3 className="text-2xl font-bold mb-4">Tentang Project ini</h3>
                    <div className="whitespace-pre-wrap leading-relaxed text-muted-foreground">
                        {project.description || "Tidak ada deskripsi detail untuk project ini."}
                    </div>
                </section>

                {/* Gallery if images exist */}
                {project.images && project.images.length > 0 && (
                    <section>
                         <h3 className="text-2xl font-bold mb-6">Galeri Project</h3>
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                             {project.images.map((img) => (
                                 <div key={img.id} className="relative aspect-video rounded-xl overflow-hidden bg-muted border">
                                     <Image 
                                        src={img.imageUrl} 
                                        alt={img.caption || `Gallery image for ${project.title}`} 
                                        fill 
                                        className="object-cover hover:scale-105 transition-transform duration-500"
                                     />
                                     {img.caption && (
                                         <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-xs p-2 backdrop-blur-sm">
                                             {img.caption}
                                         </div>
                                     )}
                                 </div>
                             ))}
                         </div>
                    </section>
                )}
            </div>
            
            {/* Sidebar / CTA */}
            <div className="lg:col-span-4 space-y-8">
                 <div className="bg-primary text-primary-foreground rounded-2xl p-8 sticky top-24">
                     <h3 className="text-xl font-bold mb-4">Tertarik dengan Solusi Serupa?</h3>
                     <p className="mb-6 opacity-90">
                         Konsultasikan kebutuhan teknologi lembaga keuangan Anda bersama tim ahli kami.
                     </p>
                     <Button asChild variant="secondary" className="w-full font-bold">
                         <Link href="/contact">Hubungi Kami</Link>
                     </Button>
                 </div>
            </div>
        </div>
      </div>
    </div>
  );
}
