import { db } from "@/lib/prisma";
import ProductForm from "@/components/admin/ProductForm";

export default async function NewProductPage() {
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
        <h1 className="text-3xl font-bold">Tambah Produk Baru</h1>
        <p className="text-muted-foreground">
          Buat produk baru untuk layanan yang ada
        </p>
      </div>

      <ProductForm services={services} />
    </div>
  );
}
