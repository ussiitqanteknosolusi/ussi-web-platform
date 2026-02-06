"use client";

import { useTransition, useState } from "react";
import { createClient, updateClient } from "@/actions/clients";
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
import { Checkbox } from "@/components/ui/checkbox";
import { Client } from "@prisma/client";
import Link from "next/link";
import { ArrowLeft, Save } from "lucide-react";
import { useRouter } from "next/navigation";
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

interface ClientFormProps {
  client?: Client;
}

const INDUSTRIES = ["Koperasi", "BPR", "LKM", "Pesantren", "Lainnya"];

export default function ClientForm({ client }: ClientFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
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

    startTransition(async () => {
      try {
        const result = client 
          ? await updateClient(client.id, pendingFormData) 
          : await createClient(pendingFormData);

        if (result.error) {
           toast.error(result.error);
           setOpenConfirm(false);
        } else {
           toast.success(result.success);
           setOpenConfirm(false);
           router.push("/admin/clients");
        }
      } catch (error) {
        toast.error("Something went wrong");
        setOpenConfirm(false);
      }
    });
  };

  return (
    <>
        <form onSubmit={handleFormSubmit} className="space-y-8 max-w-2xl bg-card p-8 rounded-xl border shadow-sm">
        <div className="space-y-4">
            <div className="grid gap-2">
            <Label htmlFor="name">Nama Klien / Institusi <span className="text-destructive">*</span></Label>
            <Input
                id="name"
                name="name"
                defaultValue={client?.name}
                placeholder="Contoh: BMT Amanah Sejahtera"
                required
            />
            </div>

            <div className="grid gap-2">
            <Label htmlFor="industry">Industri</Label>
            <Select name="industry" defaultValue={client?.industry || "Lainnya"}>
                <SelectTrigger>
                <SelectValue placeholder="Pilih Industri" />
                </SelectTrigger>
                <SelectContent>
                {INDUSTRIES.map((industry) => (
                    <SelectItem key={industry} value={industry}>
                    {industry}
                    </SelectItem>
                ))}
                </SelectContent>
            </Select>
            </div>

            <div className="grid gap-2">
                <Label htmlFor="logo">Logo (Optional)</Label>
                <Input
                    id="logo"
                    name="logo"
                    type="file"
                    accept="image/*"
                />
                {client?.logoUrl && (
                    <div className="mt-2">
                        <p className="text-xs text-muted-foreground mb-1">Current Logo:</p>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src={client.logoUrl}
                            alt="Current Logo"
                            className="h-16 w-auto object-contain border rounded p-1 bg-white"
                        />
                        <input type="hidden" name="existingLogoUrl" value={client.logoUrl} />
                    </div>
                )}
                <p className="text-xs text-muted-foreground">Upload gambar logo perusahaan. Format: .jpg, .png, .webp</p>
            </div>

            <div className="grid gap-2">
                <Label htmlFor="testimonial">Testimoni (Optional)</Label>
                <Textarea
                    id="testimonial"
                    name="testimonial"
                    defaultValue={client?.testimonial || ""}
                    placeholder="Apa kata mereka tentang layanan kami..."
                    className="h-32"
                />
            </div>

            <div className="flex items-center space-x-2 border p-4 rounded-md">
                <Checkbox id="isFeatured" name="isFeatured" defaultChecked={client?.isFeatured} />
                <div className="grid gap-1.5 leading-none">
                    <Label htmlFor="isFeatured" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                        Featured Client?
                    </Label>
                    <p className="text-xs text-muted-foreground">
                        Jika dicentang, klien ini akan diprioritaskan tampil di halaman depan.
                    </p>
                </div>
            </div>
        </div>

        <div className="flex items-center gap-4 pt-4 border-t">
            <Button asChild variant="outline">
            <Link href="/admin/clients">
                <ArrowLeft className="mr-2 h-4 w-4" /> Batal
            </Link>
            </Button>
            <Button type="submit" disabled={isPending}>
            <Save className="mr-2 h-4 w-4" />
            {isPending ? "Menyimpan..." : client ? "Simpan Perubahan" : "Tambah Klien"}
            </Button>
        </div>
        </form>

        <AlertDialog open={openConfirm} onOpenChange={setOpenConfirm}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Konfirmasi Penyimpanan</AlertDialogTitle>
                    <AlertDialogDescription>
                        Apakah Anda yakin ingin {client ? "menyimpan perubahan pada" : "menambahkan"} klien ini?
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Batal</AlertDialogCancel>
                    <AlertDialogAction onClick={executeSubmit}>
                        {client ? "Simpan" : "Tambah"}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    </>
  );
}
