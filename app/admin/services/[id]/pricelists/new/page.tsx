import { db } from "@/lib/prisma";
import { notFound } from "next/navigation";
import PricelistForm from "@/components/admin/PricelistForm";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function NewPricelistPage({ params }: PageProps) {
  const { id } = await params;
  const serviceId = parseInt(id);

  const service = await db.service.findUnique({
    where: { id: serviceId },
    select: {
      id: true,
      title: true,
    },
  });

  if (!service) {
    notFound();
  }

  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Tambah Pricelist Baru</h1>
        <p className="text-muted-foreground">
          Buat paket pricing untuk {service.title}
        </p>
      </div>

      <PricelistForm serviceId={serviceId} />
    </div>
  );
}
