import { auth } from "@/auth";
import { db } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await auth();

  if (!session) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const inquiries = await db.inquiry.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    // Map database fields to frontend expected fields
    const mappedInquiries = inquiries.map((inquiry) => ({
      id: inquiry.id.toString(),
      name: inquiry.fullName,
      email: inquiry.email,
      phone: inquiry.phone,
      company: inquiry.companyName,
      message: inquiry.message,
      status: inquiry.status,
      createdAt: inquiry.createdAt.toISOString(),
    }));

    return NextResponse.json(mappedInquiries);
  } catch (error) {
    console.error("API Error:", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
