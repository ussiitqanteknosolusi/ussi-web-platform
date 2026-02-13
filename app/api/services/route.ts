import { db } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { unstable_cache } from "next/cache";

// ✅ PERFORMANCE: Cache services list for 5 minutes
// Services rarely change, no need to query DB on every navbar load
const getCachedServices = unstable_cache(
  async () => {
    return db.service.findMany({
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
  },
  ["active-services"],
  { revalidate: 300, tags: ["services"] }
);

export async function GET() {
  try {
    const services = await getCachedServices();

    // ✅ PERFORMANCE: Set Cache-Control headers for CDN/browser caching
    return NextResponse.json(services, {
      headers: {
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
      },
    });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
}
