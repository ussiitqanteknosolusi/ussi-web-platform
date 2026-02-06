import { MetadataRoute } from "next";
import { db } from "@/lib/prisma";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://ussiits.com";

  // 1. Static Routes
  const staticRoutes = [
    "",
    "/about",
    "/layanan",
    "/clients",
    "/portfolio",
    "/blog",
    "/contact",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: route === "" ? 1 : 0.8,
  }));

  // 2. Fetch Dynamic Services
  const services = await db.service.findMany({
    where: { isActive: true },
    select: { slug: true, updatedAt: true },
  });

  const serviceRoutes = services.map((service) => ({
    url: `${baseUrl}/layanan/${service.slug}`,
    lastModified: service.updatedAt,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  // 3. Fetch Dynamic Products
  const products = await db.product.findMany({
    where: { isActive: true },
    select: { 
      slug: true, 
      updatedAt: true,
      service: {
        select: { slug: true }
      }
    },
  });

  const productRoutes = products.map((product) => ({
    url: `${baseUrl}/layanan/${product.service.slug}/${product.slug}`,
    lastModified: product.updatedAt,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [...staticRoutes, ...serviceRoutes, ...productRoutes];
}
