"use server";

import { z } from "zod";
import { db } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { uploadFile, deleteFile } from "@/lib/upload";
import { Client } from "@prisma/client";

const ClientSchema = z.object({
  name: z.string().min(1, "Name is required"),
  industry: z.enum(["Koperasi", "BPR", "LKM", "Pesantren", "Lainnya"]),
  testimonial: z.string().optional(),
  isFeatured: z.boolean().optional(),
});

export async function createClient(formData: FormData) {
  const validatedFields = ClientSchema.safeParse({
    name: formData.get("name"),
    industry: formData.get("industry"),
    testimonial: formData.get("testimonial"),
    isFeatured: formData.get("isFeatured") === "on",
  });

  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  const { name, industry, testimonial, isFeatured } = validatedFields.data;

  // Handle Logo Upload
  const logoFile = formData.get("logo") as File;
  let logoUrl = "";

  if (logoFile && logoFile.size > 0) {
    try {
      logoUrl = await uploadFile(logoFile, "client_logo");
    } catch (error) {
      return { error: "Failed to upload logo." };
    }
  }

  try {
    await db.client.create({
      data: {
        name,
        industry,
        testimonial: testimonial || null,
        isFeatured: isFeatured || false,
        logoUrl: logoUrl || null,
      },
    });
  } catch (error) {
    console.error("Database Error:", error);
    return { error: "Failed to create client." };
  }

  revalidatePath("/admin/clients");
  revalidatePath("/");
  return { success: "Client created successfully!" };
}

export async function updateClient(id: number, formData: FormData) {
  const validatedFields = ClientSchema.safeParse({
    name: formData.get("name"),
    industry: formData.get("industry"),
    testimonial: formData.get("testimonial"),
    isFeatured: formData.get("isFeatured") === "on",
  });

  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  const { name, industry, testimonial, isFeatured } = validatedFields.data;

  // Handle Logo Upload
  const logoFile = formData.get("logo") as File;
  const existingLogoUrl = formData.get("existingLogoUrl") as string;
  let logoUrl = existingLogoUrl;

  if (logoFile && logoFile.size > 0) {
    try {
      if (existingLogoUrl) {
        await deleteFile(existingLogoUrl);
      }
      logoUrl = await uploadFile(logoFile, "client_logo");
    } catch (error) {
      return { error: "Failed to upload logo." };
    }
  }

  try {
    await db.client.update({
      where: { id },
      data: {
        name,
        industry,
        testimonial: testimonial || null,
        isFeatured: isFeatured || false,
        logoUrl: logoUrl || null,
      },
    });
  } catch (error) {
    return { error: "Failed to update client." };
  }

  revalidatePath("/admin/clients");
  revalidatePath("/");
  return { success: "Client updated successfully!" };
}

export async function deleteClient(id: number) {
  try {
    const client = await db.client.findUnique({ where: { id } });
    if (client?.logoUrl) {
       await deleteFile(client.logoUrl);
    }
    
    await db.client.delete({ where: { id } });
    revalidatePath("/admin/clients");
    revalidatePath("/");
    return { success: "Client deleted successfully!" };
  } catch (error) {
    return { error: "Failed to delete client." };
  }
}
