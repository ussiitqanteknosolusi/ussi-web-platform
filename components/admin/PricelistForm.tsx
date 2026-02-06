"use client";

import { useTransition, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createPricelist, updatePricelist } from "@/actions/pricelists";
import { useRouter } from "next/navigation";
import { X, Plus } from "lucide-react";

interface PricelistFormProps {
  serviceId: number;
  initialData?: {
    id: number;
    tier: string;
    title: string;
    price: any;
    features: any;
    whatsappUrl: string | null;
  };
}

export default function PricelistForm({ serviceId, initialData }: PricelistFormProps) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const [error, setError] = useState<string | undefined>("");
  const [selectedTier, setSelectedTier] = useState<string>(initialData?.tier || "");

  // Features state
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

  const onSubmit = async (formData: FormData) => {
    setError("");

    // Add features as JSON string
    const validFeatures = features.filter((f) => f.trim() !== "");
    formData.set("features", JSON.stringify(validFeatures));
    formData.set("tier", selectedTier);

    startTransition(async () => {
      let result;
      if (initialData) {
        result = await updatePricelist(initialData.id, serviceId, formData);
      } else {
        result = await createPricelist(serviceId, formData);
      }

      if (result.error) {
        setError(result.error);
      } else {
        router.push(`/admin/services/${serviceId}/pricelists`);
        router.refresh();
      }
    });
  };

  const isCustomTier = selectedTier === "Custom";

  return (
    <form action={onSubmit} className="space-y-6">
      {error && (
        <div className="bg-destructive/15 text-destructive px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="tier">Tier *</Label>
        <Select value={selectedTier} onValueChange={setSelectedTier} required>
          <SelectTrigger>
            <SelectValue placeholder="Pilih tier" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Basic">Basic</SelectItem>
            <SelectItem value="Professional">Professional</SelectItem>
            <SelectItem value="Custom">Custom</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="title">Judul Paket *</Label>
        <Input
          id="title"
          name="title"
          placeholder="Contoh: Paket Startup"
          required
          defaultValue={initialData?.title}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="price">Harga {isCustomTier ? "(Opsional)" : "*"}</Label>
        <Input
          id="price"
          name="price"
          type="number"
          placeholder={isCustomTier ? "Kosongkan untuk Custom" : "Contoh: 5000000"}
          required={!isCustomTier}
          defaultValue={initialData?.price ? parseFloat(initialData.price.toString()) : ""}
        />
        <p className="text-xs text-muted-foreground">
          {isCustomTier ? "Untuk paket Custom, harga bisa dikosongkan" : "Masukkan harga dalam Rupiah"}
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="whatsappUrl">WhatsApp URL (Opsional)</Label>
        <Input
          id="whatsappUrl"
          name="whatsappUrl"
          type="url"
          placeholder="https://wa.me/6287787125466?text=..."
          defaultValue={initialData?.whatsappUrl || ""}
        />
        <p className="text-xs text-muted-foreground">
          Link WhatsApp untuk button CTA. Jika kosong, akan gunakan default.
        </p>
      </div>

      <div className="space-y-2">
        <Label>Fitur Paket (Opsional)</Label>
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

      <div className="flex gap-4">
        <Button type="submit" disabled={isPending || !selectedTier}>
          {isPending ? "Menyimpan..." : initialData ? "Update Pricelist" : "Buat Pricelist"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push(`/admin/services/${serviceId}/pricelists`)}
        >
          Batal
        </Button>
      </div>
    </form>
  );
}
