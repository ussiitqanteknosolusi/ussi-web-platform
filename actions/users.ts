"use server";

import { db } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { auth } from "@/auth";

const userSchema = z.object({
  name: z.string().min(2, "Nama minimal 2 karakter"),
  email: z.string().email("Email tidak valid"),
  password: z.string().min(6, "Password minimal 6 karakter"),
  role: z.enum(["SUPERADMIN", "EDITOR", "SALES", "CLIENT_ADMIN", "CLIENT_USER"]),
  clientId: z.coerce.number().optional().nullable(),
});

export async function createUser(formData: FormData) {
  const session = await auth();
  
  if (session?.user?.role !== "SUPERADMIN") {
    return { error: "Unauthorized: Only SUPERADMIN can create users" };
  }

  const rawData = {
    name: formData.get("name") as string,
    email: formData.get("email") as string,
    password: formData.get("password") as string,
    role: formData.get("role") as string,
    clientId: formData.get("clientId") ? parseInt(formData.get("clientId") as string) : null,
  };

  const parsed = userSchema.safeParse(rawData);
  
  if (!parsed.success) {
    return { error: parsed.error.errors[0].message };
  }

  const { name, email, password, role, clientId } = parsed.data;

  try {
    // Check if email already exists
    const existingUser = await db.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return { error: "Email sudah terdaftar" };
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    await db.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: role as any,
        clientId: clientId || null,
      },
    });

    revalidatePath("/admin/users");
    return { success: true };
  } catch (error) {
    console.error("Error creating user:", error);
    return { error: "Gagal membuat user baru" };
  }
}

export async function deleteUser(id: number) {
  const session = await auth();
  
  if (session?.user?.role !== "SUPERADMIN") {
    return { error: "Unauthorized: Only SUPERADMIN can delete users" };
  }

  try {
    // Prevent self-deletion
    const currentUser = await db.user.findFirst({
      where: { email: session.user.email! },
    });

    if (currentUser?.id === id) {
      return { error: "Tidak bisa menghapus akun sendiri" };
    }

    await db.user.delete({
      where: { id },
    });

    revalidatePath("/admin/users");
    return { success: true };
  } catch (error) {
    console.error("Error deleting user:", error);
    return { error: "Gagal menghapus user" };
  }
}

export async function updateUserRole(id: number, role: string) {
  const session = await auth();
  
  if (session?.user?.role !== "SUPERADMIN") {
    return { error: "Unauthorized: Only SUPERADMIN can update roles" };
  }

  try {
    await db.user.update({
      where: { id },
      data: { role: role as any },
    });

    revalidatePath("/admin/users");
    return { success: true };
  } catch (error) {
    console.error("Error updating user role:", error);
    return { error: "Gagal mengubah role user" };
  }
}

export async function resetUserPassword(id: number, newPassword: string) {
  const session = await auth();
  
  if (session?.user?.role !== "SUPERADMIN") {
    return { error: "Unauthorized: Only SUPERADMIN can reset passwords" };
  }

  if (newPassword.length < 6) {
    return { error: "Password minimal 6 karakter" };
  }

  try {
    const hashedPassword = await bcrypt.hash(newPassword, 12);

    await db.user.update({
      where: { id },
      data: { password: hashedPassword },
    });

    return { success: true };
  } catch (error) {
    return { error: "Gagal reset password" };
  }
}

export async function updateUser(id: number, formData: FormData) {
  const session = await auth();
  
  if (session?.user?.role !== "SUPERADMIN") {
    return { error: "Unauthorized: Only SUPERADMIN can update users" };
  }

  const rawData = {
    name: formData.get("name") as string,
    email: formData.get("email") as string,
    role: formData.get("role") as string,
    clientId: formData.get("clientId") ? parseInt(formData.get("clientId") as string) : null,
    password: formData.get("password") as string || undefined,
  };

  const updateSchema = userSchema.extend({
     password: z.string().min(6, "Password minimal 6 karakter").optional().or(z.literal("")),
  });

  const parsed = updateSchema.safeParse(rawData);
  
  if (!parsed.success) {
    return { error: parsed.error.errors[0].message };
  }

  const { name, email, role, clientId, password } = parsed.data;

  try {
    // Check if email already exists for other user
    const existingUser = await db.user.findFirst({
      where: { 
        email,
        NOT: { id }
      },
    });

    if (existingUser) {
      return { error: "Email sudah digunakan user lain" };
    }

    const dataToUpdate: any = {
      name,
      email,
      role: role as any,
      clientId: clientId || null,
    };

    // Only update password if provided and not empty
    if (password && password.length >= 6) {
      dataToUpdate.password = await bcrypt.hash(password, 12);
    }

    await db.user.update({
      where: { id },
      data: dataToUpdate,
    });

    revalidatePath("/admin/users");
    revalidatePath(`/admin/users/${id}/edit`);
    return { success: true };
  } catch (error) {
    console.error("Error updating user:", error);
    return { error: "Gagal mengupdate user" };
  }
}
