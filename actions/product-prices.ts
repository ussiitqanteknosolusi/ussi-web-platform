"use server";

import { z } from "zod";
import { db } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

const ProductPriceSchema = z.object({
  name: z.string().min(1, { message: "Nama paket harga diperlukan" }),
  price: z.string().min(1, { message: "Harga diperlukan" }),
  features: z.array(z.string()).optional(),
  whatsappUrl: z.string().optional(),
  isBestValue: z.boolean().default(false),
  displayOrder: z.number().default(0),
});

export async function createProductPrice(productId: number, formData: FormData) {
  // Parse features from JSON string
  const featuresStr = formData.get("features") as string;
  const features = featuresStr ? JSON.parse(featuresStr) : [];

  const validatedFields = ProductPriceSchema.safeParse({
    name: formData.get("name"),
    price: formData.get("price") as string,
    features,
    whatsappUrl: formData.get("whatsappUrl") || undefined,
    isBestValue: formData.get("isBestValue") === "true",
    displayOrder: parseInt(formData.get("displayOrder") as string) || 0,
  });

  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  const { name, price, features: validatedFeatures, whatsappUrl, isBestValue, displayOrder } = validatedFields.data;

  try {
    await db.productPrice.create({
      data: {
        productId,
        name,
        price: parseFloat(price),
        features: validatedFeatures || [],
        whatsappUrl,
        isBestValue,
        displayOrder,
      },
    });
  } catch (error) {
    console.error("Database Error:", error);
    return { error: "Failed to create price." };
  }

  revalidatePath(`/admin/products/${productId}/prices`);
  revalidatePath(`/layanan`); 
  return { success: "Price added successfully!" };
}

export async function updateProductPrice(id: number, productId: number, formData: FormData) {
  const featuresStr = formData.get("features") as string;
  const features = featuresStr ? JSON.parse(featuresStr) : [];

  const validatedFields = ProductPriceSchema.safeParse({
    name: formData.get("name"),
    price: formData.get("price") as string,
    features,
    whatsappUrl: formData.get("whatsappUrl") || undefined,
    isBestValue: formData.get("isBestValue") === "true",
    displayOrder: parseInt(formData.get("displayOrder") as string) || 0,
  });

  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  const { name, price, features: validatedFeatures, whatsappUrl, isBestValue, displayOrder } = validatedFields.data;

  try {
    await db.productPrice.update({
      where: { id },
      data: {
        name,
        price: parseFloat(price),
        features: validatedFeatures || [],
        whatsappUrl,
        isBestValue,
        displayOrder,
      },
    });
  } catch (error) {
    console.error("Database Error:", error);
    return { error: "Failed to update price." };
  }

  revalidatePath(`/admin/products/${productId}/prices`);
  revalidatePath(`/layanan`);
  return { success: "Price updated successfully!" };
}

export async function deleteProductPrice(id: number, productId: number) {
  try {
    await db.productPrice.delete({
      where: { id },
    });
    revalidatePath(`/admin/products/${productId}/prices`);
    revalidatePath(`/layanan`);
    return { success: "Price deleted!" };
  } catch (error) {
    console.error("Database Error:", error);
    return { error: "Failed to delete price." };
  }
}
