"use client";

import { useTransition, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createProductPrice, updateProductPrice } from "@/actions/product-prices";
import { useRouter } from "next/navigation";
import { X, Plus } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

interface ProductPriceFormProps {
  productId: number;
  initialData?: {
    id: number;
    name: string;
    price: number | object;
    features: unknown;
    whatsappUrl: string | null;
    isBestValue: boolean;
    displayOrder: number;
  };
}

export default function ProductPriceForm({ productId, initialData }: ProductPriceFormProps) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const [error, setError] = useState<string | undefined>("");
  const [isBestValue, setIsBestValue] = useState(initialData?.isBestValue ?? false);

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
    formData.set("isBestValue", isBestValue.toString());

    startTransition(async () => {
      let result;
      if (initialData) {
        result = await updateProductPrice(initialData.id, productId, formData);
      } else {
        result = await createProductPrice(productId, formData);
      }

      if (result.error) {
        setError(result.error);
      } else {
        router.push(`/admin/products/${productId}/prices`);
        router.refresh();
      }
    });
  };

  // Helper to safely get price value
  const getPriceValue = () => {
    if (!initialData?.price) return "";
    // If it's a Prisma Decimal logic, it might come as object or number
    if (typeof initialData.price === 'object' && initialData.price !== null) {
        return initialData.price.toString();
    }
    return initialData.price.toString();
  };

  return (
    <form action={onSubmit} className="space-y-6 max-w-2xl bg-white p-8 rounded-lg border shadow-sm">
      {error && (
        <div className="bg-destructive/15 text-destructive px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="name">Nama Paket *</Label>
        <Input
          id="name"
          name="name"
          placeholder="Contoh: Lisensi Tahunan, Paket Basic"
          required
          defaultValue={initialData?.name}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="price">Harga (Rp) *</Label>
        <Input
          id="price"
          name="price"
          type="number"
          placeholder="0"
          required
          defaultValue={getPriceValue()}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="whatsappUrl">Link WhatsApp (Opsional)</Label>
        <Input
          id="whatsappUrl"
          name="whatsappUrl"
          placeholder="https://wa.me/..."
          defaultValue={initialData?.whatsappUrl || ""}
        />
        <p className="text-xs text-muted-foreground">Custom link WA jika ingin override default</p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="displayOrder">Urutan Tampilan</Label>
        <Input
          id="displayOrder"
          name="displayOrder"
          type="number"
          placeholder="0"
          defaultValue={initialData?.displayOrder}
        />
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          id="isBestValue"
          checked={isBestValue}
          onCheckedChange={(checked) => setIsBestValue(checked as boolean)}
        />
        <Label htmlFor="isBestValue" className="cursor-pointer">
          Best Value (Ditandai)
        </Label>
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

      <div className="flex gap-4 pt-4 border-t">
        <Button type="submit" disabled={isPending}>
          {isPending ? "Menyimpan..." : initialData ? "Update Harga" : "Simpan Harga"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push(`/admin/products/${productId}/prices`)}
        >
          Batal
        </Button>
      </div>
    </form>
  );
}
