"use server";

import { z } from "zod";
import { db } from "@/lib/prisma";
import { PostSchema } from "@/schemas";
import { revalidatePath } from "next/cache";
import { uploadFile, deleteFile } from "@/lib/upload";

export async function createPost(formData: FormData) {
  // Track uploaded files for rollback
  const uploadedFiles: string[] = [];
  
  // Handle file upload
  let coverImageUrl: string | null = null;
  const coverImageFile = formData.get("coverImage") as File | null;
  
  if (coverImageFile && coverImageFile.size > 0) {
    try {
      coverImageUrl = await uploadFile(coverImageFile, "blog");
      uploadedFiles.push(coverImageUrl);
    } catch (error) {
      console.error("Upload Error:", error);
      return { error: "Failed to upload cover image" };
    }
  }

  const validatedFields = PostSchema.safeParse({
    title: formData.get("title"),
    slug: formData.get("slug") || undefined,
    content: formData.get("content"),
    excerpt: formData.get("excerpt") || undefined,
    metaDescription: formData.get("metaDescription") || undefined,
    coverImage: coverImageUrl || undefined,
    categoryId: formData.get("categoryId") || undefined,
    status: formData.get("status") || "draft",
  });

  if (!validatedFields.success) {
    console.error("Validation Error:", validatedFields.error);
    // Rollback uploads on validation error
    if (uploadedFiles.length > 0) {
      await Promise.all(uploadedFiles.map(file => deleteFile(file)));
    }
    return { error: "Invalid fields!" };
  }

  const { title, slug, content, excerpt, metaDescription, coverImage, categoryId, status } = validatedFields.data;

  // Generate Slug safely
  const finalSlug = slug || title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

  try {
    await db.post.create({
      data: {
        title,
        slug: finalSlug,
        content,
        excerpt,
        metaDescription,
        coverImage: coverImage || null,
        status: status as "draft" | "published",
        categoryId: categoryId ? parseInt(categoryId) : null,
      },
    });
  } catch (error) {
    console.error("Database Error:", error);
    // Rollback uploads on database error
    if (uploadedFiles.length > 0) {
      await Promise.all(uploadedFiles.map(file => deleteFile(file)));
    }
    return { error: "Failed to create post. Slug might be taken." };
  }

  revalidatePath("/admin/blog");
  revalidatePath("/blog");
  return { success: "Post created successfully!" };
}

export async function updatePost(id: number, formData: FormData) {
  // Track uploaded files for rollback
  const uploadedFiles: string[] = [];

  // Handle file upload
  let coverImageUrl: string | null = null;
  const coverImageFile = formData.get("coverImage") as File | null;
  
  if (coverImageFile && coverImageFile.size > 0) {
    try {
      coverImageUrl = await uploadFile(coverImageFile, "blog");
      uploadedFiles.push(coverImageUrl);
    } catch (error) {
      console.error("Upload Error:", error);
      return { error: "Failed to upload cover image" };
    }
  }

  const validatedFields = PostSchema.safeParse({
    title: formData.get("title"),
    slug: formData.get("slug") || undefined,
    content: formData.get("content"),
    excerpt: formData.get("excerpt") || undefined,
    metaDescription: formData.get("metaDescription") || undefined,
    coverImage: coverImageUrl || undefined,
    categoryId: formData.get("categoryId") || undefined,
    status: formData.get("status") || "draft",
  });

  if (!validatedFields.success) {
    // Rollback uploads on validation error
    if (uploadedFiles.length > 0) {
      await Promise.all(uploadedFiles.map(file => deleteFile(file)));
    }
    return { error: "Invalid fields!" };
  }

  const { title, slug, content, excerpt, metaDescription, coverImage, categoryId, status } = validatedFields.data;

  try {
    const existingPost = await db.post.findUnique({ where: { id } });
    
    if (!existingPost) {
        // Rollback uploads if post not found
        if (uploadedFiles.length > 0) {
            await Promise.all(uploadedFiles.map(file => deleteFile(file)));
        }
        return { error: "Post not found" };
    }

    // Prepare update data
    const updateData: any = {
        title,
        slug: slug || existingPost?.slug,
        content,
        excerpt,
        metaDescription,
        status: status as "draft" | "published",
        categoryId: categoryId ? parseInt(categoryId) : null,
    }
    
    if (coverImage) updateData.coverImage = coverImage;

    await db.post.update({
      where: { id },
      data: updateData,
    });

    // Delete old image ONLY after successful update
    if (existingPost?.coverImage && coverImage) {
      await deleteFile(existingPost.coverImage);
    }

  } catch (error) {
    console.error("Database Error:", error);
    // Rollback NEW uploads on database error
    if (uploadedFiles.length > 0) {
      await Promise.all(uploadedFiles.map(file => deleteFile(file)));
    }
    return { error: "Failed to update post." };
  }

  revalidatePath("/admin/blog");
  revalidatePath("/blog");
  return { success: "Post updated successfully!" };
}

export async function deletePost(id: number) {
  try {
    const post = await db.post.findUnique({ where: { id } });
    
    if (post?.coverImage) {
      await deleteFile(post.coverImage);
    }

    await db.post.delete({ where: { id } });
    
    revalidatePath("/admin/blog");
    revalidatePath("/blog");
    return { success: "Post deleted!" };
  } catch (error) {
    return { error: "Failed to delete post." };
  }
}
