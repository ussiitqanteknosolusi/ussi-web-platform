"use server";

import { z } from "zod";
import { db } from "@/lib/prisma";
import { ProductSchema } from "@/schemas";
import { revalidatePath } from "next/cache";
import { uploadFile, deleteFile } from "@/lib/upload";

export async function createProduct(formData: FormData) {
  // Track uploaded files for rollback
  const uploadedFiles: string[] = [];
  
  // Handle file uploads first
  let thumbnailUrl: string | null = null;
  let detailImageUrl: string | null = null;
  
  const thumbnailFile = formData.get("thumbnail") as File | null;
  const detailImageFile = formData.get("detailImage") as File | null;
  
  try {
    if (thumbnailFile && thumbnailFile.size > 0) {
      thumbnailUrl = await uploadFile(thumbnailFile, "products");
      uploadedFiles.push(thumbnailUrl);
    }
    
    if (detailImageFile && detailImageFile.size > 0) {
      detailImageUrl = await uploadFile(detailImageFile, "products");
      uploadedFiles.push(detailImageUrl);
    }
  } catch (error: any) {
    console.error("Upload Error:", error);
    // Cleanup any files uploaded before the error
    if (uploadedFiles.length > 0) {
      await Promise.all(uploadedFiles.map(file => deleteFile(file)));
    }
    return { error: error.message || "Failed to upload images" };
  }

  // Parse features from JSON string
  const featuresStr = formData.get("features") as string;
  const features = featuresStr ? JSON.parse(featuresStr) : [];

  const validatedFields = ProductSchema.safeParse({
    name: formData.get("name"),
    slug: formData.get("slug") || undefined,
    serviceId: parseInt(formData.get("serviceId") as string),
    description: formData.get("description") || undefined,
    features,
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

  const { name, slug, serviceId, description, features: validatedFeatures, isActive } = validatedFields.data;

  // Generate Slug safely and ensure uniqueness
  const baseSlug = slug || name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  const finalSlug = await generateUniqueSlug(baseSlug);

  try {
    await db.product.create({
      data: {
        name,
        slug: finalSlug,
        serviceId,
        description,
        thumbnail: thumbnailUrl,
        detailImage: detailImageUrl,
        features: validatedFeatures || [],
        isActive,
      },
    });
  } catch (error: any) {
    console.error("Database Error:", error);
    // Rollback uploads on database error
    if (uploadedFiles.length > 0) {
      await Promise.all(uploadedFiles.map(file => deleteFile(file)));
    }
    return { error: `Database Error: ${error.message || "Failed to create product."}` };
  }

  revalidatePath("/admin/products");
  return { success: "Product created successfully!" };
}

// Helper function for optimized slug generation
async function generateUniqueSlug(baseSlug: string): Promise<string> {
  // Check if the exact slug exists
  const exactMatch = await db.product.findUnique({
    where: { slug: baseSlug },
    select: { slug: true },
  });

  if (!exactMatch) return baseSlug;

  // Find all slugs that start with baseSlug + "-"
  // We use a raw query or a startsWith filter to find collisions in one go
  const collisions = await db.product.findMany({
    where: {
      slug: {
        startsWith: `${baseSlug}-`,
      },
    },
    select: { slug: true },
  });

  // Extract suffixes and find the next available number
  const suffixes = collisions
    .map((p) => {
      const parts = p.slug.split(`${baseSlug}-`);
      return parseInt(parts[1]);
    })
    .filter((n) => !isNaN(n))
    .sort((a, b) => a - b);

  let nextNumber = 1;
  for (const n of suffixes) {
    if (n === nextNumber) {
      nextNumber++;
    } else if (n > nextNumber) {
      // If we find a gap, use it (optional, but simply incrementing max is safer/easier)
      break; 
    }
  }
  
  // Actually, strictly incrementing from max is safer to avoid race conditions filling gaps,
  // but strictly appending nextNumber is standard.
  // Let's just find the max and add 1.
  if (suffixes.length > 0) {
      nextNumber = suffixes[suffixes.length - 1] + 1;
  }

  return `${baseSlug}-${nextNumber}`;
}


export async function updateProduct(id: number, formData: FormData) {
  // Track uploaded files for rollback
  const uploadedFiles: string[] = [];

  // Handle file uploads first
  let thumbnailUrl: string | null = null;
  let detailImageUrl: string | null = null;
  
  const thumbnailFile = formData.get("thumbnail") as File | null;
  const detailImageFile = formData.get("detailImage") as File | null;
  
  if (thumbnailFile && thumbnailFile.size > 0) {
    try {
      thumbnailUrl = await uploadFile(thumbnailFile, "products");
      uploadedFiles.push(thumbnailUrl);
    } catch (error) {
      console.error("Upload Error:", error);
      return { error: "Failed to upload thumbnail" };
    }
  }
  
  if (detailImageFile && detailImageFile.size > 0) {
    try {
      detailImageUrl = await uploadFile(detailImageFile, "products");
      uploadedFiles.push(detailImageUrl);
    } catch (error) {
      console.error("Upload Error:", error);
      // Clean up previous upload if exists
      if (uploadedFiles.length > 0) {
        await Promise.all(uploadedFiles.map(file => deleteFile(file)));
      }
      return { error: "Failed to upload detail image" };
    }
  }

  // Parse features from JSON string
  const featuresStr = formData.get("features") as string;
  const features = featuresStr ? JSON.parse(featuresStr) : [];

  const validatedFields = ProductSchema.safeParse({
    name: formData.get("name"),
    slug: formData.get("slug") || undefined,
    serviceId: parseInt(formData.get("serviceId") as string),
    description: formData.get("description") || undefined,
    features,
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

  const { name, slug, serviceId, description, features: validatedFeatures, isActive } = validatedFields.data;

  // Get existing product first to check for existence and handle slug/image logic
  const existingProduct = await db.product.findUnique({ where: { id } });

  if (!existingProduct) {
      // Rollback uploads if product not found
      if (uploadedFiles.length > 0) {
        await Promise.all(uploadedFiles.map(file => deleteFile(file)));
      }
      return { error: "Product not found" };
  }

  // Determine if slug needs updating
  let slugToUpdate: string | undefined = undefined;
  if (slug && slug !== existingProduct.slug) {
      // If a new slug is explicitly provided and different, optimize it
      slugToUpdate = await generateUniqueSlug(slug);
  }

  try {
    // Prepare update data
    const updateData: any = {
        name,
        serviceId,
        description,
        features: validatedFeatures || [],
        isActive,
    }

    // Only add slug to update if it changed
    if (slugToUpdate) {
        updateData.slug = slugToUpdate;
    }

    if (thumbnailUrl) updateData.thumbnail = thumbnailUrl;
    if (detailImageUrl) updateData.detailImage = detailImageUrl;

    await db.product.update({
      where: { id },
      data: updateData
    });

    // Delete old images ONLY after successful update
    if (thumbnailUrl && existingProduct.thumbnail) {
      await deleteFile(existingProduct.thumbnail);
    }
    if (detailImageUrl && existingProduct.detailImage) {
      await deleteFile(existingProduct.detailImage);
    }

  } catch (error: any) {
    console.error("Database Error:", error);
    // Rollback NEW uploads on database error
    if (uploadedFiles.length > 0) {
      await Promise.all(uploadedFiles.map(file => deleteFile(file)));
    }
    return { error: `Database Error: ${error.message || "Failed to update product."}` };
  }

  revalidatePath("/admin/products");
  revalidatePath(`/admin/products/${id}/edit`);
  return { success: "Product updated successfully!" };
}

export async function deleteProduct(id: number) {
  try {
    const existingProduct = await db.product.findUnique({
      where: { id },
    });

    if (existingProduct) {
      if (existingProduct.thumbnail) {
        await deleteFile(existingProduct.thumbnail);
      }
      if (existingProduct.detailImage) {
        await deleteFile(existingProduct.detailImage);
      }
    }

    await db.product.delete({
      where: { id },
    });
    revalidatePath("/admin/products");
    return { success: "Product deleted!" };
  } catch (error) {
    console.error("Database Error:", error);
    return { error: "Failed to delete product." };
  }
}
