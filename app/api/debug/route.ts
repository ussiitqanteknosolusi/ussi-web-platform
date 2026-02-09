
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = 'force-dynamic'; // Ensure it's not cached

export async function GET() {
  const status: any = {
    serverTime: new Date().toISOString(),
    env: {
      NODE_ENV: process.env.NODE_ENV,
      DATABASE_URL_SET: !!process.env.DATABASE_URL,
      NEXTAUTH_URL_SET: !!process.env.NEXTAUTH_URL,
    },
    database: "checking...",
  };

  try {
    // fast check
    await prisma.$queryRaw`SELECT 1`;
    status.database = "connected";
  } catch (error: any) {
    status.database = "error";
    status.dbError = error.message;
  }

  return NextResponse.json(status);
}
