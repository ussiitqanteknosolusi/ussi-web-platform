import { db } from "@/lib/prisma";
import PostForm from "@/components/admin/PostForm";
import { notFound } from "next/navigation";

export default async function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const post = await db.post.findUnique({
    where: { 
      id: parseInt(id) 
    },
  });

  if (!post) {
    notFound();
  }

  // Cast enum status to string literal type expected by PostForm
  const formattedPost = {
    ...post,
    status: post.status as "draft" | "published"
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Edit Artikel</h1>
        <p className="text-muted-foreground">
          Perbarui konten artikel "{post.title}"
        </p>
      </div>
      <PostForm initialData={formattedPost} />
    </div>
  );
}
