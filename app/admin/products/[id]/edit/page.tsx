import { db } from "@/lib/prisma";
import { notFound } from "next/navigation";
import ProductForm from "@/components/admin/ProductForm";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditProductPage({ params }: PageProps) {
  const { id } = await params;
  const productId = parseInt(id);

  const product = await db.product.findUnique({
    where: { id: productId },
  });

  if (!product) {
    notFound();
  }

  const services = await db.service.findMany({
    where: { isActive: true },
    select: {
      id: true,
      title: true,
    },
    orderBy: { title: "asc" },
  });

  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Edit Produk</h1>
        <p className="text-muted-foreground">
          Update informasi produk {product.name}
        </p>
      </div>

      <ProductForm initialData={product} services={services} />
    </div>
  );
}
