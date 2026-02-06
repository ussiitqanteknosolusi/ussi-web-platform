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

  // Generate Slug safely and ensure uniqueness
  let finalSlug = slug || name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  
  // Check for uniqueness
  let slugExists = await db.product.findUnique({ where: { slug: finalSlug } });
  let counter = 1;
  const originalSlug = finalSlug;
  
  while (slugExists) {
    finalSlug = `${originalSlug}-${counter}`;
    slugExists = await db.product.findUnique({ where: { slug: finalSlug } });
    counter++;
  }

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

  try {
    // Get existing product to check for old images
    const existingProduct = await db.product.findUnique({
      where: { id },
    });

    if (!existingProduct) {
      // Rollback uploads if product not found
      if (uploadedFiles.length > 0) {
        await Promise.all(uploadedFiles.map(file => deleteFile(file)));
      }
      return { error: "Product not found" };
    }

    // Prepare update data
    const updateData: any = {
        name,
        slug,
        serviceId,
        description,
        features: validatedFeatures || [],
        isActive,
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

  } catch (error) {
    console.error("Database Error:", error);
    // Rollback NEW uploads on database error
    if (uploadedFiles.length > 0) {
      await Promise.all(uploadedFiles.map(file => deleteFile(file)));
    }
    return { error: "Database Error: Failed to update product." };
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
