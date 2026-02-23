import { db } from "@/lib/prisma";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus, Pencil } from "lucide-react";
import Image from "next/image";
import { deleteClient } from "@/actions/clients";
import DeleteButton from "@/components/admin/DeleteButton";


export default async function ClientsPage() {
  const clients = await db.client.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      industry: true,
      logoUrl: true,
      isFeatured: true,
    },
  });

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Clients</h1>
          <p className="text-muted-foreground">Kelola daftar klien dan partner</p>
        </div>
        <Button asChild>
          <Link href="/admin/clients/new">
            <Plus className="mr-2 h-4 w-4" />
            Tambah Klien
          </Link>
        </Button>
      </div>

      <div className="border rounded-lg">
        <table className="w-full">
          <thead className="bg-muted/50">
            <tr>
              <th className="text-left p-4 font-medium">Logo</th>
              <th className="text-left p-4 font-medium">Nama Klien</th>
              <th className="text-left p-4 font-medium">Industri</th>
              <th className="text-left p-4 font-medium">Featured</th>
              <th className="text-right p-4 font-medium">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {clients.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center p-8 text-muted-foreground">
                  Belum ada klien. Klik &quot;Tambah Klien&quot; untuk membuat yang pertama.
                </td>
              </tr>
            ) : (
              clients.map((client) => (
                <tr key={client.id} className="border-t hover:bg-muted/30">
                  <td className="p-4">
                    {client.logoUrl ? (
                        <div className="relative h-10 w-16">
                            <Image 
                                src={client.logoUrl} 
                                alt={client.name} 
                                fill 
                                className="object-contain" 
                            />
                        </div>
                    ) : (
                        <div className="h-10 w-16 bg-muted rounded flex items-center justify-center text-xs text-muted-foreground">No Logo</div>
                    )}
                  </td>
                  <td className="p-4 font-medium">{client.name}</td>
                  <td className="p-4 text-muted-foreground">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                        {client.industry}
                    </span>
                  </td>
                  <td className="p-4">
                    {client.isFeatured && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        Featured
                      </span>
                    )}
                  </td>
                  <td className="p-4">
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/admin/clients/${client.id}/edit`}>
                          <Pencil className="h-4 w-4" />
                        </Link>
                      </Button>
                      <DeleteButton 
                        onDelete={deleteClient.bind(null, client.id)} 
                        title={`Hapus Klien ${client.name}?`}
                        description="Tindakan ini tidak dapat dibatalkan. Data klien akan dihapus."
                      />
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
