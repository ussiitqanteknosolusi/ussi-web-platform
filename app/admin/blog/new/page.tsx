import PostForm from "@/components/admin/PostForm";

export default function NewPostPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Tulis Artikel Baru</h1>
        <p className="text-muted-foreground">
          Buat konten menarik untuk blog perusahaan
        </p>
      </div>
      <PostForm />
    </div>
  );
}
