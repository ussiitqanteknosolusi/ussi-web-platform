import { db } from "@/lib/prisma";
import { notFound } from "next/navigation";
import ProductPriceForm from "@/components/admin/ProductPriceForm";

interface PageProps {
  params: Promise<{ id: string; priceId: string }>;
}

export default async function EditProductPricePage({ params }: PageProps) {
  const { id, priceId } = await params;
  const pId = parseInt(id);
  const priceIdInt = parseInt(priceId);

  const product = await db.product.findUnique({
    where: { id: pId },
  });

  if (!product) {
    notFound();
  }

  const price = await db.productPrice.findUnique({
    where: { id: priceIdInt },
  });

  if (!price) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Edit Harga</h1>
          <p className="text-muted-foreground">
            Mengedit opsi harga untuk: {product.name}
          </p>
        </div>
      </div>

      <ProductPriceForm productId={pId} initialData={price} />
    </div>
  );
}
