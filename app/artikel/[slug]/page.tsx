import { db } from "@/lib/prisma";
import ReactMarkdown from "react-markdown";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await db.post.findUnique({
    where: { slug },
  });

  if (!post) {
    return {
      title: "Artikel Tidak Ditemukan",
    };
  }

  return {
    title: `${post.title} | USSI ITS Blog`,
    description: post.metaDescription || post.excerpt,
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await db.post.findUnique({
    where: { slug },
    include: { 
      author: true,
      category: true,
    },
  });

  if (!post) {
    notFound();
  }

  // Find related posts (simple implementation: same category or latest)
  const relatedPosts = await db.post.findMany({
    where: { 
      status: "published",
      id: { not: post.id } // Exclude current post
    },
    orderBy: { createdAt: "desc" },
    take: 3,
  });

  return (
    <div className="container mx-auto px-4 pt-24 pb-12 md:py-20 animate-in fade-in duration-500">
      <div className="max-w-4xl mx-auto">
        <Button asChild variant="ghost" className="mb-8 pl-0 hover:bg-transparent hover:text-primary">
          <Link href="/blog" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Kembali ke Blog
          </Link>
        </Button>

        <header className="mb-10 text-center">
         {post.category && (
            <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
              {post.category.name} {/* Assuming include category if using relation, but earlier used category field? schema changed to relation.. need verify if eager load changes needed */}
              {/* Wait, I didn't include category in findUnique above. 
                  Let's check schema again. `category` is a relation to Category model.
                  But I didn't update the `include` in query. 
                  For now I'll skip category name or fetch it if needed. 
                  Actually I should include it. */}
               Artikel
            </span>
          )}
          <h1 className="text-3xl md:text-5xl font-bold mb-6 leading-tight max-w-3xl mx-auto">
            {post.title}
          </h1>
          <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
             <span>
               {new Date(post.createdAt).toLocaleDateString("id-ID", { day: 'numeric', month: 'long', year: 'numeric' })}
             </span>
             {post.author && (
                <>
                  <span className="w-1 h-1 bg-muted-foreground rounded-full" />
                  <span>Oleh {post.author.name}</span>
                </>
             )}
          </div>
        </header>

        {post.coverImage && (
          <div className="relative aspect-[21/9] w-full rounded-2xl overflow-hidden mb-12 shadow-lg">
            <Image
              src={post.coverImage}
              alt={post.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}

        <article className="prose prose-lg dark:prose-invert max-w-none mb-16">
           <ReactMarkdown>{post.content}</ReactMarkdown>
        </article>

        {/* Share / Tags section could go here */}
        
        <hr className="my-12 border-border" />

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold mb-8">Artikel Lainnya</h2>
            <div className="grid md:grid-cols-3 gap-8">
               {relatedPosts.map((related) => (
                 <Link 
                   key={related.id} 
                   href={`/blog/${related.slug}`}
                   className="group block"
                 >
                   <div className="relative aspect-video rounded-xl overflow-hidden bg-muted mb-4">
                     {related.coverImage && (
                       <Image
                         src={related.coverImage}
                         alt={related.title}
                         fill
                         className="object-cover group-hover:scale-105 transition-transform"
                       />
                     )}
                   </div>
                   <h3 className="font-bold text-lg group-hover:text-primary transition-colors line-clamp-2">
                     {related.title}
                   </h3>
                   <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                     {related.excerpt}
                   </p>
                 </Link>
               ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
