"use server";

import { z } from "zod";
import { db } from "@/lib/prisma";
import { ProjectSchema } from "@/schemas";
import { uploadFile, deleteFile } from "@/lib/upload";
import { revalidatePath } from "next/cache";

export async function createProject(formData: FormData) {
  // Track uploaded files for rollback
  const uploadedFiles: string[] = [];

  const validatedFields = ProjectSchema.safeParse({
    title: formData.get("title"),
    slug: formData.get("slug") || undefined,
    clientId: formData.get("clientId") || undefined,
    serviceId: formData.get("serviceId") || undefined,
    description: formData.get("description"),
    projectDate: formData.get("projectDate") || undefined,
    status: formData.get("status"),
  });

  if (!validatedFields.success) {
    console.error("Validation Error:", validatedFields.error);
    return { error: "Invalid fields!" };
  }

  const { title, slug, clientId, serviceId, description, projectDate, status } = validatedFields.data;

  // Handle File Upload
  const file = formData.get("thumbnail") as File;
  let thumbnailUrl = "";
  if (file && file.size > 0) {
    try {
      thumbnailUrl = await uploadFile(file, "projects");
      uploadedFiles.push(thumbnailUrl);
    } catch (error) {
       return { error: "Failed to upload image." };
    }
  }

  // Generate Slug if not provided
  const finalSlug = slug || title.toLowerCase().replace(/ /g, "-") + "-" + Date.now();

  try {
    await db.project.create({
      data: {
        title,
        slug: finalSlug,
        clientId: clientId ? parseInt(clientId) : null,
        serviceId: serviceId ? parseInt(serviceId) : null,
        description,
        projectDate: projectDate ? new Date(projectDate) : null,
        status: status as "Ongoing" | "Completed", // Cast to enum
        thumbnailUrl: thumbnailUrl || null,
      },
    });
  } catch (error) {
    console.error("Database Error:", error);
    // Rollback uploads on database error
    if (uploadedFiles.length > 0) {
      await Promise.all(uploadedFiles.map(file => deleteFile(file)));
    }
    return { error: "Database Error: Failed to create project." };
  }

  revalidatePath("/products");
  revalidatePath("/admin/projects");
  return { success: "Project created successfully!" };
}

export async function updateProject(id: number, formData: FormData) {
  // Track uploaded files for rollback
  const uploadedFiles: string[] = [];

  const validatedFields = ProjectSchema.safeParse({
    title: formData.get("title"),
    slug: formData.get("slug") || undefined,
    clientId: formData.get("clientId") || undefined,
    serviceId: formData.get("serviceId") || undefined,
    description: formData.get("description"),
    projectDate: formData.get("projectDate") || undefined,
    status: formData.get("status"),
  });

  if (!validatedFields.success) {
     console.error("Validation Error:", validatedFields.error);
    return { error: "Invalid fields!" };
  }
  
  const { title, slug, clientId, serviceId, description, projectDate, status } = validatedFields.data;

  // Handle File Upload (Optional update)
  const file = formData.get("thumbnail") as File;
  let thumbnailUrl = undefined;
  if (file && file.size > 0) {
    try {
      thumbnailUrl = await uploadFile(file, "projects");
      uploadedFiles.push(thumbnailUrl);
    } catch (error) {
       return { error: "Failed to upload image." };
    }
  }

    try {
    // Get existing project to check for old image
    const existingProject = await db.project.findUnique({
      where: { id },
    });

    if (!existingProject) {
        // Rollback if not found
        if (uploadedFiles.length > 0) {
            await Promise.all(uploadedFiles.map(file => deleteFile(file)));
        }
        return { error: "Project not found" };
    }

    await db.project.update({
      where: { id },
      data: {
        title,
        slug,
        clientId: clientId ? parseInt(clientId) : null,
        serviceId: serviceId ? parseInt(serviceId) : null,
        description,
        projectDate: projectDate ? new Date(projectDate) : null,
        status: status as "Ongoing" | "Completed",
        ...(thumbnailUrl && { thumbnailUrl }), // Only update if new image exists
      },
    });

    // Delete old image if new one is uploaded AND DB update succeeded
    if (thumbnailUrl && existingProject.thumbnailUrl) {
      await deleteFile(existingProject.thumbnailUrl);
    }

  } catch (error) {
    console.error("Database Error:", error);
    // Rollback NEW uploads on database error
    if (uploadedFiles.length > 0) {
      await Promise.all(uploadedFiles.map(file => deleteFile(file)));
    }
    return { error: "Database Error: Failed to update project." };
  }

  revalidatePath("/products");
  revalidatePath("/admin/projects");
  return { success: "Project updated successfully!" };
}

export async function deleteProject(id: number) {
  try {
    const existingProject = await db.project.findUnique({
      where: { id },
    });

    if (existingProject?.thumbnailUrl) {
      await deleteFile(existingProject.thumbnailUrl);
    }
    
    await db.project.delete({
      where: { id },
    });
    revalidatePath("/products");
    revalidatePath("/admin/projects");
    return { success: "Project deleted!" };
  } catch (error) {
    return { error: "Failed to delete project." };
  }
}
