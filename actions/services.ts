"use server";

import { z } from "zod";
import { db } from "@/lib/prisma";
import { ServiceSchema } from "@/schemas";
import { revalidatePath } from "next/cache";
import { uploadFile, deleteFile } from "@/lib/upload";
import { auth } from "@/auth";

export async function createService(formData: FormData) {
  const session = await auth();
  if (!session) {
    return { error: "Unauthorized" };
  }

  // Track uploaded files for rollback
  const uploadedFiles: string[] = [];

  // Handle file upload first
  let heroImageUrl: string | null = null;
  const heroImageFile = formData.get("heroImage") as File | null;
  
  if (heroImageFile && heroImageFile.size > 0) {
    try {
      heroImageUrl = await uploadFile(heroImageFile, "services");
      uploadedFiles.push(heroImageUrl);
    } catch (error) {
      console.error("Upload Error:", error);
      return { error: "Failed to upload hero image" };
    }
  }

  const validatedFields = ServiceSchema.safeParse({
    title: formData.get("title"),
    slug: formData.get("slug") || undefined,
    description: formData.get("description") || undefined,
    metaDescription: formData.get("metaDescription") || undefined,
    heroImage: heroImageUrl || undefined,
    isActive: formData.get("isActive") === "true",
  });

  if (!validatedFields.success) {
    console.error("Validation Error:", validatedFields.error);
    // Rollback uploads on validation error
    if (uploadedFiles.length > 0) {
      await Promise.all(uploadedFiles.map(file => deleteFile(file)));
    }
    return { error: "Invalid fields!" };
  }

  const { title, slug, description, metaDescription, heroImage, isActive } = validatedFields.data;

  // Generate Slug if not provided
  const finalSlug = slug || title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

  try {
    await db.service.create({
      data: {
        title,
        slug: finalSlug,
        description,
        metaDescription,
        heroImage: heroImage || null,
        isActive,
      },
    });
  } catch (error) {
    console.error("Database Error:", error);
    // Rollback uploads on database error
    if (uploadedFiles.length > 0) {
      await Promise.all(uploadedFiles.map(file => deleteFile(file)));
    }
    return { error: "Database Error: Failed to create service." };
  }

  revalidatePath("/admin/services");
  return { success: "Service created successfully!" };
}


export async function updateService(id: number, formData: FormData) {
  const session = await auth();
  if (!session) {
    return { error: "Unauthorized" };
  }

  // Track uploaded files for rollback
  const uploadedFiles: string[] = [];

  // Handle file upload first
  let heroImageUrl: string | null = null;
  const heroImageFile = formData.get("heroImage") as File | null;
  
  if (heroImageFile && heroImageFile.size > 0) {
    try {
      heroImageUrl = await uploadFile(heroImageFile, "services");
      uploadedFiles.push(heroImageUrl);
    } catch (error) {
      console.error("Upload Error:", error);
      return { error: "Failed to upload hero image" };
    }
  }

  const validatedFields = ServiceSchema.safeParse({
    title: formData.get("title"),
    slug: formData.get("slug") || undefined,
    description: formData.get("description") || undefined,
    metaDescription: formData.get("metaDescription") || undefined,
    heroImage: heroImageUrl || undefined,
    isActive: formData.get("isActive") === "true",
  });

  if (!validatedFields.success) {
    console.error("Validation Error:", validatedFields.error);
    // Rollback uploads on validation error
    if (uploadedFiles.length > 0) {
      await Promise.all(uploadedFiles.map(file => deleteFile(file)));
    }
    return { error: "Invalid fields!" };
  }

  const { title, slug, description, metaDescription, heroImage, isActive } = validatedFields.data;

  try {
    // Get existing service to check for old image
    const existingService = await db.service.findUnique({
      where: { id },
    });

    if (!existingService) {
      // Rollback uploads if service not found
      if (uploadedFiles.length > 0) {
        await Promise.all(uploadedFiles.map(file => deleteFile(file)));
      }
      return { error: "Service not found" };
    }

    // Prepare update data
    const updateData: any = {
        title,
        slug,
        description,
        metaDescription,
        isActive,
    }

    if (heroImage) updateData.heroImage = heroImage;

    await db.service.update({
      where: { id },
      data: updateData,
    });

    // Delete old image if new one is uploaded AND DB update succeeded
    if (heroImage && existingService.heroImage) {
      await deleteFile(existingService.heroImage);
    }

  } catch (error) {
    console.error("Database Error:", error);
    // Rollback NEW uploads on database error
    if (uploadedFiles.length > 0) {
      await Promise.all(uploadedFiles.map(file => deleteFile(file)));
    }
    return { error: "Database Error: Failed to update service." };
  }

  revalidatePath("/admin/services");
  return { success: "Service updated successfully!" };
}

export async function deleteService(id: number) {
  const session = await auth();
  if (!session) {
    return { error: "Unauthorized" };
  }

  try {
    const existingService = await db.service.findUnique({
      where: { id },
    });

    if (existingService?.heroImage) {
      await deleteFile(existingService.heroImage);
    }

    await db.service.delete({
      where: { id },
    });
    revalidatePath("/admin/services");
    return { success: "Service deleted!" };
  } catch (error) {
    console.error("Database Error:", error);
    return { error: "Failed to delete service." };
  }
}
