import Link from "next/link";
import Image from "next/image";
import { db } from "@/lib/prisma";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

export default async function BlogPage() {
  const posts = await db.post.findMany({
    where: { status: "published" },
    orderBy: { createdAt: "desc" },
    include: { author: true },
  });

  return (
    <div className="container mx-auto px-4 pt-24 md:pt-32 pb-12 md:pb-20">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h1 className="text-4xl md:text-5xl font-bold mb-6">Blog & Artikel</h1>
        <p className="text-lg text-muted-foreground">
          Wawasan terbaru seputar teknologi perbankan sekolah, digitalisasi koperasi, dan tips IT untuk lembaga keuangan mikro.
        </p>
      </div>

      {posts.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <Link 
              key={post.id} 
              href={`/blog/${post.slug}`}
              className="group flex flex-col bg-card border rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-300"
            >
              <div className="relative aspect-[16/9] w-full bg-muted">
                {post.coverImage ? (
                  <Image
                    src={post.coverImage}
                    alt={post.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-muted-foreground">
                    No Image
                  </div>
                )}
              </div>
              <div className="p-6 flex flex-col flex-1">
                <div className="flex items-center gap-2 text-sm text-primary font-medium mb-3">
                  <span>{new Date(post.createdAt).toLocaleDateString("id-ID", { 
                    day: 'numeric', month: 'long', year: 'numeric' 
                  })}</span>
                </div>
                <h2 className="text-xl font-bold mb-3 line-clamp-2 group-hover:text-primary transition-colors">
                  {post.title}
                </h2>
                <p className="text-muted-foreground text-sm line-clamp-3 mb-6 flex-1">
                  {post.excerpt || post.content.substring(0, 150) + "..."}
                </p>
                <div className="mt-auto">
                  <span className="text-sm font-medium text-primary flex items-center gap-1">
                    Baca Selengkapnya
                    <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="max-w-md mx-auto text-center p-12 border border-dashed rounded-xl bg-muted/30">
          <p className="text-lg font-medium text-foreground">Belum ada artikel</p>
          <p className="text-sm text-muted-foreground mt-1">
            Nantikan update artikel terbaru dari kami.
          </p>
        </div>
      )}
    </div>
  );
}
