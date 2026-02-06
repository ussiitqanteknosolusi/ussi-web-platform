import { db } from "@/lib/prisma";
import ServiceForm from "@/components/admin/ServiceForm";
import { notFound } from "next/navigation";

export default async function EditServicePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  const service = await db.service.findUnique({
    where: { id: parseInt(id) },
  });

  if (!service) {
    notFound();
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Edit Service</h1>
        <p className="text-muted-foreground">Update informasi service</p>
      </div>

      <ServiceForm initialData={service} />
    </div>
  );
}
