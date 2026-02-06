"use server";

import * as z from "zod";
import { InquirySchema } from "@/schemas";
import { db } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export const submitInquiry = async (values: z.infer<typeof InquirySchema>) => {
  const validatedFields = InquirySchema.safeParse(values);

  if (!validatedFields.success) {
    console.error("Validation Error:", validatedFields.error);
    return { error: "Kolom tidak valid!" };
  }

  const { name, email, phone, company, message } = validatedFields.data;

  try {
    await db.inquiry.create({
      data: {
        fullName: name,
        email,
        phone,
        companyName: company || null,
        message,
        status: "New",
      },
    });

    // In a real app, send email here
    
    revalidatePath("/admin/inquiries");
    return { success: "Pesan terkirim!" };
  } catch (error) {
    console.error("Database Error:", error);
    return { error: "Gagal mengirim pesan." };
  }
};
