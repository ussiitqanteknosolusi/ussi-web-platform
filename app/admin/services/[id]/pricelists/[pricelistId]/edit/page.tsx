import { db } from "@/lib/prisma";
import { notFound } from "next/navigation";
import PricelistForm from "@/components/admin/PricelistForm";

interface PageProps {
  params: Promise<{ id: string; pricelistId: string }>;
}

export default async function EditPricelistPage({ params }: PageProps) {
  const { id, pricelistId } = await params;
  const serviceId = parseInt(id);
  const itemId = parseInt(pricelistId);

  const service = await db.service.findUnique({
    where: { id: serviceId },
    select: {
      id: true,
      title: true,
    },
  });

  const pricelist = await db.pricelistItem.findUnique({
    where: { id: itemId },
  });

  if (!service || !pricelist) {
    notFound();
  }

  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Edit Pricelist</h1>
        <p className="text-muted-foreground">
          Update paket {pricelist.title} untuk {service.title}
        </p>
      </div>

      <PricelistForm serviceId={serviceId} initialData={pricelist} />
    </div>
  );
}
