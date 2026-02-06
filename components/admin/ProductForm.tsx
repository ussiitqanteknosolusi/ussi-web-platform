"use client";

import { useTransition, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createProduct, updateProduct } from "@/actions/products";
import { useRouter } from "next/navigation";
import { X, Plus } from "lucide-react";

interface ProductFormProps {
  initialData?: {
    id: number;
    name: string;
    slug: string;
    serviceId: number;
    description: string | null;
    thumbnail: string | null;
    detailImage: string | null;
    price?: number | null;
    features: any;
    isActive: boolean;
  };
  services: Array<{ id: number; title: string }>;
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
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function ProductForm({ initialData, services }: ProductFormProps) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const [isActive, setIsActive] = useState(initialData?.isActive ?? true);
  const [selectedService, setSelectedService] = useState<string>(
    initialData?.serviceId?.toString() || ""
  );
  
  // Confirmation Dialog State
  const [openConfirm, setOpenConfirm] = useState(false);
  const [pendingFormData, setPendingFormData] = useState<FormData | null>(null);

  // ... (features state logic remains same)
  const initialFeatures = Array.isArray(initialData?.features)
    ? initialData.features
    : [];
  const [features, setFeatures] = useState<string[]>(
    initialFeatures.length > 0 ? initialFeatures : [""]
  );

  const addFeature = () => {
    setFeatures([...features, ""]);
  };

  const removeFeature = (index: number) => {
    setFeatures(features.filter((_, i) => i !== index));
  };

  const updateFeature = (index: number, value: string) => {
    const newFeatures = [...features];
    newFeatures[index] = value;
    setFeatures(newFeatures);
  };

  // Helper to trigger verification
  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    setPendingFormData(formData);
    setOpenConfirm(true);
  };

  const executeSubmit = async () => {
    if (!pendingFormData) return;
    
    // Add features as JSON string
    const validFeatures = features.filter((f) => f.trim() !== "");
    pendingFormData.set("features", JSON.stringify(validFeatures));
    pendingFormData.set("serviceId", selectedService);
    pendingFormData.set("isActive", isActive.toString());

    startTransition(async () => {
      let result;
      if (initialData) {
        result = await updateProduct(initialData.id, pendingFormData);
      } else {
        result = await createProduct(pendingFormData);
      }

      if (result.error) {
        toast.error(result.error);
        setOpenConfirm(false);
      } else {
        toast.success(result.success);
        setOpenConfirm(false);
        router.push("/admin/products");
        router.refresh();
      }
    });
  };

  return (
    <>
      <form onSubmit={handleFormSubmit} className="space-y-6">
        
        {/* ... INPUT FIELDS REMAIN THE SAME ... */}
        
        <div className="space-y-2">
            <Label htmlFor="name">Nama Produk *</Label>
            <Input
            id="name"
            name="name"
            placeholder="Contoh: IBS Core Basic"
            required
            defaultValue={initialData?.name}
            />
        </div>

        <div className="space-y-2">
            <Label htmlFor="slug">Slug (Opsional)</Label>
            <Input
            id="slug"
            name="slug"
            placeholder="Otomatis dari nama jika dikosongkan"
            defaultValue={initialData?.slug}
            />
            <p className="text-xs text-muted-foreground">Contoh: ibs-core-basic</p>
        </div>

        <div className="space-y-2">
            <Label htmlFor="serviceId">Layanan *</Label>
            <Select value={selectedService} onValueChange={setSelectedService} required>
            <SelectTrigger>
                <SelectValue placeholder="Pilih layanan" />
            </SelectTrigger>
            <SelectContent>
                {services.map((service) => (
                <SelectItem key={service.id} value={service.id.toString()}>
                    {service.title}
                </SelectItem>
                ))}
            </SelectContent>
            </Select>
        </div>

        <div className="space-y-2">
            <Label htmlFor="description">Deskripsi (Opsional)</Label>
            <Textarea
            id="description"
            name="description"
            placeholder="Jelaskan tentang produk ini..."
            className="min-h-[120px]"
            defaultValue={initialData?.description || ""}
            />
        </div>

        <div className="space-y-2">
            <Label htmlFor="thumbnail">Thumbnail (Opsional)</Label>
            <Input
            id="thumbnail"
            name="thumbnail"
            type="file"
            accept="image/*"
            />
            {initialData?.thumbnail && (
            <p className="text-xs text-muted-foreground">
                Current: <a href={initialData.thumbnail} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">{initialData.thumbnail}</a>
            </p>
            )}
            <p className="text-xs text-muted-foreground">Gambar untuk card produk (400x300px recommended)</p>
        </div>

        <div className="space-y-2">
            <Label htmlFor="detailImage">Detail Image (Opsional)</Label>
            <Input
            id="detailImage"
            name="detailImage"
            type="file"
            accept="image/*"
            />
            {initialData?.detailImage && (
            <p className="text-xs text-muted-foreground">
                Current: <a href={initialData.detailImage} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">{initialData.detailImage}</a>
            </p>
            )}
            <p className="text-xs text-muted-foreground">Gambar untuk halaman detail produk (1200x600px recommended)</p>
        </div>

        <div className="space-y-2">
            <Label>Fitur Produk (Opsional)</Label>
            <div className="space-y-2">
            {features.map((feature, index) => (
                <div key={index} className="flex gap-2">
                <Input
                    value={feature}
                    onChange={(e) => updateFeature(index, e.target.value)}
                    placeholder={`Fitur ${index + 1}`}
                />
                {features.length > 1 && (
                    <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => removeFeature(index)}
                    >
                    <X className="h-4 w-4" />
                    </Button>
                )}
                </div>
            ))}
            </div>
            <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addFeature}
            className="mt-2"
            >
            <Plus className="h-4 w-4 mr-2" />
            Tambah Fitur
            </Button>
        </div>

        <div className="flex items-center space-x-2">
            <Checkbox
            id="isActive"
            checked={isActive}
            onCheckedChange={(checked) => setIsActive(checked as boolean)}
            />
            <Label htmlFor="isActive" className="cursor-pointer">
            Produk Aktif
            </Label>
        </div>

        <div className="flex gap-4">
          <Button type="submit" disabled={isPending || !selectedService}>
            {isPending ? "Menyimpan..." : initialData ? "Simpan Perubahan" : "Buat Produk"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/admin/products")}
          >
            Batal
          </Button>
        </div>
      </form>

      <AlertDialog open={openConfirm} onOpenChange={setOpenConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Konfirmasi Penyimpanan</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin {initialData ? "menyimpan perubahan pada" : "membuat"} produk ini?
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
