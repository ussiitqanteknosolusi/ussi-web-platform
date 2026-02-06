import { db } from "@/lib/prisma";
import { notFound } from "next/navigation";
import ProductPriceForm from "@/components/admin/ProductPriceForm";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function NewProductPricePage({ params }: PageProps) {
  const { id } = await params;
  const productId = parseInt(id);

  const product = await db.product.findUnique({
    where: { id: productId },
  });

  if (!product) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Tambah Harga Baru</h1>
          <p className="text-muted-foreground">
            Menambahkan opsi harga baru untuk: {product.name}
          </p>
        </div>
      </div>

      <ProductPriceForm productId={productId} />
    </div>
  );
}
