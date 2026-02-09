import { db } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const services = await db.service.findMany({
      where: {
        isActive: true,
      },
      select: {
        id: true,
        title: true,
        slug: true,
        isActive: true,
      },
      orderBy: {
        title: "asc",
      },
    });

    return NextResponse.json(services);
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json({ error: "Internal Error", details: String(error) }, { status: 500 });
  }
}
