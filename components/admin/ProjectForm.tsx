"use client";

import { useTransition, useState, useEffect } from "react";
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
import { createProject, updateProject } from "@/actions/projects";
import { useRouter } from "next/navigation";
import Image from "next/image";

type Client = { id: number; name: string };
type Service = { id: number; title: string };

// Define simplified types for props to avoid deep imports
interface ProjectFormProps {
  initialData?: {
    id: number;
    title: string;
    slug: string;
    description: string | null;
    status: "Ongoing" | "Completed" | null;
    clientId: number | null;
    serviceId: number | null;
    thumbnailUrl: string | null;
    projectDate: Date | null;
  }
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

export default function ProjectForm({ initialData }: ProjectFormProps) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const [preview, setPreview] = useState<string | null>(initialData?.thumbnailUrl || null);
  const [clients, setClients] = useState<Client[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [selectedClient, setSelectedClient] = useState<string>(initialData?.clientId?.toString() || "");
  const [selectedService, setSelectedService] = useState<string>(initialData?.serviceId?.toString() || "");

  // Confirmation State
  const [openConfirm, setOpenConfirm] = useState(false);
  const [pendingFormData, setPendingFormData] = useState<FormData | null>(null);

  useEffect(() => {
    // Fetch clients and services
    Promise.all([
      fetch("/api/clients").then(res => res.json()),
      fetch("/api/services").then(res => res.json())
    ]).then(([clientsData, servicesData]) => {
      setClients(clientsData);
      setServices(servicesData);
    }).catch(err => console.error("Failed to fetch data:", err));
  }, []);

  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    setPendingFormData(formData);
    setOpenConfirm(true);
  };

  const executeSubmit = async () => {
    if (!pendingFormData) return;

    // Add selected values to formData (skip if 'none')
    if (selectedClient && selectedClient !== "none") pendingFormData.set("clientId", selectedClient);
    if (selectedService && selectedService !== "none") pendingFormData.set("serviceId", selectedService);
    
    startTransition(async () => {
      try {
        const result = initialData
          ? await updateProject(initialData.id, pendingFormData)
          : await createProject(pendingFormData);

        if (result.error) {
          toast.error(result.error);
          setOpenConfirm(false);
        } else {
          toast.success(result.success);
          setOpenConfirm(false);
          router.push("/admin/projects");
        }
      } catch (e) {
        toast.error("Something went wrong!");
        setOpenConfirm(false);
      }
    });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPreview(url);
    }
  };

  return (
    <>
      <form onSubmit={handleFormSubmit} className="space-y-6 max-w-2xl bg-card p-6 rounded-lg border shadow-sm">
        <div className="space-y-2">
            <Label htmlFor="title">Judul Project</Label>
            <Input
            id="title"
            name="title"
            required
            minLength={3}
            placeholder="Contoh: Implementasi Core Banking BPR... (minimal 3 karakter)"
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
            <p className="text-xs text-muted-foreground">Contoh: implementasi-core-banking-bpr</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
            <Label htmlFor="clientId">Client (Opsional)</Label>
            <Select value={selectedClient} onValueChange={setSelectedClient}>
                <SelectTrigger>
                <SelectValue placeholder="Pilih client..." />
                </SelectTrigger>
                <SelectContent>
                <SelectItem value="none">Tidak ada client</SelectItem>
                {clients.map((client) => (
                    <SelectItem key={client.id} value={client.id.toString()}>
                    {client.name}
                    </SelectItem>
                ))}
                </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">Pilih client yang terkait dengan project ini</p>
            </div>
            <div className="space-y-2">
            <Label htmlFor="serviceId">Service (Opsional)</Label>
            <Select value={selectedService} onValueChange={setSelectedService}>
                <SelectTrigger>
                <SelectValue placeholder="Pilih service..." />
                </SelectTrigger>
                <SelectContent>
                <SelectItem value="none">Tidak ada service</SelectItem>
                {services.map((service) => (
                    <SelectItem key={service.id} value={service.id.toString()}>
                    {service.title}
                    </SelectItem>
                ))}
                </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">Pilih jenis layanan yang diimplementasikan</p>
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
                <Label htmlFor="projectDate">Tanggal Project</Label>
                <Input
                id="projectDate"
                name="projectDate"
                type="date"
                defaultValue={initialData?.projectDate ? new Date(initialData.projectDate).toISOString().split('T')[0] : ""}
                />
                <p className="text-xs text-muted-foreground">Tanggal implementasi atau selesai</p>
            </div>
            <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select name="status" defaultValue={initialData?.status || "Completed"}>
                    <SelectTrigger>
                        <SelectValue placeholder="Pilih Status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="Completed">Completed</SelectItem>
                        <SelectItem value="Ongoing">Ongoing</SelectItem>
                    </SelectContent>
                </Select>
            </div>
        </div>

        <div className="space-y-2">
            <Label htmlFor="description">Deskripsi Project</Label>
            <Textarea
            id="description"
            name="description"
            required
            minLength={10}
            placeholder="Jelaskan detail implementasi project ini... (minimal 10 karakter)"
            className="min-h-[120px]"
            defaultValue={initialData?.description || ""}
            />
        </div>

        <div className="space-y-2">
            <Label htmlFor="thumbnail">Thumbnail Cover</Label>
            <Input
            id="thumbnail"
            name="thumbnail"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            />
            {preview && (
                <div className="mt-4 relative h-48 w-full rounded-md overflow-hidden border">
                    <Image src={preview} alt="Preview" fill className="object-cover" />
                </div>
            )}
        </div>

        <div className="flex justify-end gap-4">
            <Button variant="outline" type="button" onClick={() => router.back()}>
            Batal
            </Button>
            <Button type="submit" disabled={isPending}>
            {isPending ? "Menyimpan..." : initialData ? "Update Project" : "Simpan Project"}
            </Button>
        </div>
      </form>

      <AlertDialog open={openConfirm} onOpenChange={setOpenConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Konfirmasi Penyimpanan</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin {initialData ? "menyimpan perubahan pada" : "membuat"} project ini?
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
