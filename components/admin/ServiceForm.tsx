"use client";

import { useTransition, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { createService, updateService } from "@/actions/services";
import { useRouter } from "next/navigation";

interface ServiceFormProps {
  initialData?: {
    id: number;
    title: string;
    slug: string;
    description: string | null;
    metaDescription: string | null;
    heroImage: string | null;
    isActive: boolean;
  };
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

export default function ServiceForm({ initialData }: ServiceFormProps) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const [isActive, setIsActive] = useState(initialData?.isActive ?? true);
  
  // Confirmation state
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

    // Add isActive to formData
    pendingFormData.set("isActive", isActive.toString());
    
    startTransition(async () => {
      try {
        const result = initialData
          ? await updateService(initialData.id, pendingFormData)
          : await createService(pendingFormData);

        if (result.error) {
          toast.error(result.error);
          setOpenConfirm(false);
        } else {
          toast.success(result.success);
          setOpenConfirm(false);
          router.push("/admin/services");
        }
      } catch (e) {
        toast.error("Something went wrong!");
        setOpenConfirm(false);
      }
    });
  };

  return (
    <>
      <form onSubmit={handleFormSubmit} className="space-y-6 max-w-2xl bg-card p-6 rounded-lg border shadow-sm">
        <div className="space-y-2">
          <Label htmlFor="title">Nama Service</Label>
          <Input
            id="title"
            name="title"
            required
            minLength={3}
            placeholder="Contoh: IBS Mobile (minimal 3 karakter)"
            defaultValue={initialData?.title}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="slug">Slug (URL-friendly)</Label>
          <Input
            id="slug"
            name="slug"
            placeholder="Otomatis dari judul jika dikosongkan"
            defaultValue={initialData?.slug}
          />
          <p className="text-xs text-muted-foreground">Contoh: ibs-mobile, core-banking</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Deskripsi (Opsional)</Label>
          <Textarea
            id="description"
            name="description"
            placeholder="Jelaskan tentang service ini..."
            className="min-h-[120px]"
            defaultValue={initialData?.description || ""}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="metaDescription">Meta Description (SEO)</Label>
          <Textarea
            id="metaDescription"
            name="metaDescription"
            placeholder="Deskripsi singkat untuk SEO (maksimal 160 karakter)"
            maxLength={160}
            className="min-h-[80px]"
            defaultValue={initialData?.metaDescription || ""}
          />
          <p className="text-xs text-muted-foreground">Untuk hasil pencarian Google. Maksimal 160 karakter.</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="heroImage">Hero Image (Opsional)</Label>
          <Input
            id="heroImage"
            name="heroImage"
            type="file"
            accept="image/*"
          />
          {initialData?.heroImage && (
            <p className="text-xs text-muted-foreground">
              Current: <a href={initialData.heroImage} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">{initialData.heroImage}</a>
            </p>
          )}
          <p className="text-xs text-muted-foreground">Upload gambar banner untuk halaman layanan (1200x400px recommended)</p>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="isActive"
            checked={isActive}
            onCheckedChange={(checked) => setIsActive(checked as boolean)}
          />
          <Label htmlFor="isActive" className="cursor-pointer">
            Service Aktif
          </Label>
        </div>

        <div className="flex justify-end gap-4">
          <Button variant="outline" type="button" onClick={() => router.back()}>
            Batal
          </Button>
          <Button type="submit" disabled={isPending}>
            {isPending ? "Menyimpan..." : initialData ? "Simpan Perubahan" : "Buat Service"}
          </Button>
        </div>
      </form>

      <AlertDialog open={openConfirm} onOpenChange={setOpenConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Konfirmasi Penyimpanan</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin {initialData ? "menyimpan perubahan pada" : "membuat"} layanan ini?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={executeSubmit}>
              {initialData ? "Simpan" : "Buat"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
