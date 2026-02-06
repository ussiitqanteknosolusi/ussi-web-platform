import { db } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2, ArrowLeft } from "lucide-react";
import { deletePricelist } from "@/actions/pricelists";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ServicePricelistsPage({ params }: PageProps) {
  const { id } = await params;
  const serviceId = parseInt(id);

  const service = await db.service.findUnique({
    where: { id: serviceId },
    include: {
      pricelistItems: {
        orderBy: { displayOrder: "asc" },
      },
    },
  });

  if (!service) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button asChild variant="ghost" size="sm">
          <Link href="/admin/services">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Services
          </Link>
        </Button>
      </div>

      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Manage Pricelists</h1>
          <p className="text-muted-foreground">
            Kelola paket pricing untuk {service.title}
          </p>
        </div>
        <Button asChild>
          <Link href={`/admin/services/${serviceId}/pricelists/new`}>
            <Plus className="mr-2 h-4 w-4" />
            Tambah Pricelist
          </Link>
        </Button>
      </div>

      {service.pricelistItems.length === 0 ? (
        <div className="text-center py-12 bg-muted rounded-lg">
          <p className="text-muted-foreground mb-4">Belum ada pricelist</p>
          <Button asChild>
            <Link href={`/admin/services/${serviceId}/pricelists/new`}>
              Buat Pricelist Pertama
            </Link>
          </Button>
        </div>
      ) : (
        <div className="grid gap-4">
          {service.pricelistItems.map((item) => {
            const features = Array.isArray(item.features) ? item.features : [];
            
            return (
              <div
                key={item.id}
                className="flex items-start justify-between p-6 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-semibold">{item.title}</h3>
                    <span className="px-2 py-1 text-xs bg-primary/10 text-primary rounded">
                      {item.tier}
                    </span>
                  </div>
                  
                  {item.price && (
                    <p className="text-2xl font-bold mb-3">
                      Rp {parseFloat(item.price.toString()).toLocaleString("id-ID")}
                    </p>
                  )}
                  
                  {features.length > 0 && (
                    <ul className="space-y-1 mb-3">
                      {features.slice(0, 3).map((feature: string, index: number) => (
                        <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                          <span className="text-primary">✓</span>
                          {feature}
                        </li>
                      ))}
                      {features.length > 3 && (
                        <li className="text-sm text-muted-foreground">
                          +{features.length - 3} fitur lainnya
                        </li>
                      )}
                    </ul>
                  )}
                  
                  {item.whatsappUrl && (
                    <p className="text-xs text-muted-foreground">
                      WhatsApp: {item.whatsappUrl}
                    </p>
                  )}
                </div>
                
                <div className="flex gap-2">
                  <Button asChild variant="outline" size="sm">
                    <Link href={`/admin/services/${serviceId}/pricelists/${item.id}/edit`}>
                      <Pencil className="h-4 w-4" />
                    </Link>
                  </Button>
                  <form
                    action={async () => {
                      "use server";
                      await deletePricelist(item.id, serviceId);
                    }}
                  >
                    <Button
                      type="submit"
                      variant="outline"
                      size="sm"
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </form>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
