"use server";

import { db } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function updateInquiryStatus(id: number, status: "New" | "Processed" | "Closed") {
  try {
    await db.inquiry.update({
      where: { id },
      data: { status },
    });

    revalidatePath("/admin/inquiries");
    return { success: "Status updated!" };
  } catch (error) {
    console.error("Database Error:", error);
    return { error: "Failed to update status." };
  }
}

export async function deleteInquiry(id: number) {
  try {
    await db.inquiry.delete({
      where: { id },
    });

    revalidatePath("/admin/inquiries");
    return { success: "Inquiry deleted!" };
  } catch (error) {
    console.error("Database Error:", error);
    return { error: "Failed to delete inquiry." };
  }
}
