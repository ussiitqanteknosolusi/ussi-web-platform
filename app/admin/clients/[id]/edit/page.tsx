import { db } from "@/lib/prisma";
import { notFound } from "next/navigation";
import ClientForm from "@/components/admin/ClientForm";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditClientPage({ params }: PageProps) {
  const { id } = await params;
  const clientId = parseInt(id);

  if (isNaN(clientId)) {
    notFound(); 
  }

  const client = await db.client.findUnique({
    where: { id: clientId },
  });

  if (!client) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Edit Klien</h1>
        <p className="text-muted-foreground">
          Update informasi klien {client.name}
        </p>
      </div>

      <ClientForm client={client} />
    </div>
  );
}
