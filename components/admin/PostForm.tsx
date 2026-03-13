"use client";

import RichTextEditor from "./RichTextEditor";
import Image from "next/image";
import { useTransition, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createPost, updatePost } from "@/actions/blog";
import { useRouter } from "next/navigation";

interface PostFormProps {
  initialData?: {
    id: number;
    title: string;
    slug: string;
    content: string;
    excerpt: string | null;
    metaDescription: string | null;
    coverImage: string | null;
    status: "draft" | "published";
    categoryId: number | null;
  };
  categories?: Array<{ id: number; name: string }>; // Optional for now
}

import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function PostForm({ initialData }: PostFormProps) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const [status, setStatus] = useState<string>(initialData?.status || "draft");
  const [content, setContent] = useState<string>(initialData?.content || "");
  
  // Confirmation State
  const [openConfirm, setOpenConfirm] = useState(false);
  const [pendingFormData, setPendingFormData] = useState<FormData | null>(null);

  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    setPendingFormData(formData);
    setOpenConfirm(true);
  };

  const executeSubmit = async () => {
    if (!pendingFormData) return;
    
    pendingFormData.set("status", status);
    pendingFormData.set("content", content);

    startTransition(async () => {
      try {
        const result = initialData
          ? await updatePost(initialData.id, pendingFormData)
          : await createPost(pendingFormData);

        if (result.error) {
           toast.error(result.error);
           setOpenConfirm(false);
        } else {
           toast.success(result.success);
           setOpenConfirm(false);
           router.push("/admin/blog");
        }
      } catch {
        toast.error("Something went wrong");
        setOpenConfirm(false);
      }
    });
  };

  return (
    <>
      <form onSubmit={handleFormSubmit} className="space-y-6">
        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Judul *</Label>
              <Input
                id="title"
                name="title"
                placeholder="Judul artikel..."
                required
                defaultValue={initialData?.title}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="slug">Slug (Opsional)</Label>
              <Input
                id="slug"
                name="slug"
                placeholder="url-artikel-anda"
                defaultValue={initialData?.slug}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="excerpt">Kutipan Singkat (Excerpt)</Label>
              <Textarea
                id="excerpt"
                name="excerpt"
                placeholder="Ringkasan singkat untuk kartu artikel..."
                className="h-20"
                defaultValue={initialData?.excerpt || ""}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">Konten *</Label>
              <RichTextEditor 
                  content={content} 
                  onChange={setContent} 
                  placeholder="Mulai tulis artikel anda di sini..." 
              />
              {content.trim() === "" && <input className="sr-only" required />} 
            </div>
          </div>

          <div className="space-y-6">
            <div className="p-4 border rounded-lg bg-card space-y-4">
              <h3 className="font-semibold">Publikasi</h3>
              
              <div className="space-y-2">
                <Label>Status</Label>
                <Select value={status} onValueChange={setStatus}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="coverImage">Cover Image</Label>
                <Input
                  id="coverImage"
                  name="coverImage"
                  type="file"
                  accept="image/*"
                />
                {initialData?.coverImage && (
                  <div className="mt-2">
                    <p className="text-xs text-muted-foreground mb-1">Current:</p>
                    <Image 
                        src={initialData.coverImage} 
                        alt="Cover" 
                        width={400}
                        height={128}
                        className="w-full h-32 object-cover rounded-md border"
                    />
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="metaDescription">Meta Description (SEO)</Label>
                <Textarea
                  id="metaDescription"
                  name="metaDescription"
                  placeholder="Deskripsi untuk SEO..."
                  className="h-24"
                  defaultValue={initialData?.metaDescription || ""}
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Button type="submit" disabled={isPending} className="w-full">
                {isPending ? "Menyimpan..." : initialData ? "Update Post" : "Publish Post"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/admin/blog")}
                className="w-full"
              >
                Batal
              </Button>
            </div>
          </div>
        </div>
      </form>

      <AlertDialog open={openConfirm} onOpenChange={setOpenConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Konfirmasi Publikasi</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin {initialData ? "menyimpan perubahan pada" : "mempublikasikan"} artikel ini?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={executeSubmit}>
              {initialData ? "Simpan" : "Publish"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
