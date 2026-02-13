import { db } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus, Pencil, Trash2, Eye } from "lucide-react";
import { deletePost } from "@/actions/blog";
import DeleteButton from "@/components/admin/DeleteButton";

export default async function BlogAdminPage() {
  const posts = await db.post.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      title: true,
      slug: true,
      status: true,
      createdAt: true,
      author: { select: { name: true } },
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Blog & Artikel</h1>
          <p className="text-muted-foreground">
            Kelola artikel dan berita perusahaan
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/blog/new">
            <Plus className="mr-2 h-4 w-4" />
            Tulis Artikel
          </Link>
        </Button>
      </div>

      <div className="border rounded-lg">
        <div className="relative w-full overflow-auto">
          <table className="w-full caption-bottom text-sm">
            <thead className="[&_tr]:border-b">
              <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                  Judul
                </th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                  Status
                </th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                  Tanggal
                </th>
                <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="[&_tr:last-child]:border-0">
              {posts.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-muted-foreground">
                    Belum ada artikel. Silakan buat baru.
                  </td>
                </tr>
              ) : (
                posts.map((post) => (
                  <tr
                    key={post.id}
                    className="border-b transition-colors hover:bg-muted/50"
                  >
                    <td className="p-4 align-middle font-medium">
                      {post.title}
                      <div className="text-xs text-muted-foreground font-normal mt-0.5">
                        /{post.slug}
                      </div>
                    </td>
                    <td className="p-4 align-middle">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          post.status === "published"
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {post.status === "published" ? "Published" : "Draft"}
                      </span>
                    </td>
                    <td className="p-4 align-middle">
                      {new Date(post.createdAt).toLocaleDateString("id-ID")}
                    </td>
                    <td className="p-4 align-middle text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          asChild
                          title="Lihat"
                        >
                          <Link href={`/blog/${post.slug}`} target="_blank">
                             <Eye className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          asChild
                          title="Edit"
                        >
                          <Link href={`/admin/blog/${post.id}/edit`}>
                             <Pencil className="h-4 w-4" />
                          </Link>
                        </Button>
                        <DeleteButton 
                          onDelete={deletePost.bind(null, post.id)} 
                          title={`Hapus Artikel ${post.title}?`}
                          description="Tindakan ini tidak dapat dibatalkan. Artikel akan dihapus permanen."
                        />
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
