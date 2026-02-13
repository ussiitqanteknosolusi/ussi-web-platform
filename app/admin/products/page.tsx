import { db } from "@/lib/prisma";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2, DollarSign } from "lucide-react";
import { deleteProduct } from "@/actions/products";
import DeleteButton from "@/components/admin/DeleteButton";

export default async function ProductsPage() {
  const products = await db.product.findMany({
    select: {
      id: true,
      name: true,
      slug: true,
      description: true, // Short descriptions shown in list
      isActive: true,
      serviceId: true,
      service: {
        select: {
          id: true,
          title: true,
        },
      },
    },
    orderBy: [
      { serviceId: "asc" },
      { displayOrder: "asc" },
      { name: "asc" },
    ],
  });

  // Group products by service
  const productsByService = products.reduce((acc, product) => {
    const serviceTitle = product.service.title;
    if (!acc[serviceTitle]) {
      acc[serviceTitle] = [];
    }
    acc[serviceTitle].push(product);
    return acc;
  }, {} as Record<string, typeof products>);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Products</h1>
          <p className="text-muted-foreground">
            Kelola produk untuk setiap layanan
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/products/new">
            <Plus className="mr-2 h-4 w-4" />
            Tambah Produk
          </Link>
        </Button>
      </div>

      {Object.keys(productsByService).length === 0 ? (
        <div className="text-center py-12 bg-muted rounded-lg">
          <p className="text-muted-foreground mb-4">Belum ada produk</p>
          <Button asChild>
            <Link href="/admin/products/new">Buat Produk Pertama</Link>
          </Button>
        </div>
      ) : (
        <div className="space-y-8">
          {Object.entries(productsByService).map(([serviceTitle, serviceProducts]) => (
            <div key={serviceTitle} className="space-y-4">
              <h2 className="text-xl font-semibold border-b pb-2">
                {serviceTitle}
              </h2>
              <div className="grid gap-4">
                {serviceProducts.map((product) => (
                  <div
                    key={product.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <h3 className="font-medium">{product.name}</h3>
                        {!product.isActive && (
                          <span className="px-2 py-1 text-xs bg-muted rounded">
                            Inactive
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {product.description || "Tidak ada deskripsi"}
                      </p>
                      <div className="flex gap-4 mt-2 text-xs text-muted-foreground">
                        <span>Slug: {product.slug}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button asChild variant="outline" size="sm">
                        <Link href={`/admin/products/${product.id}/prices`}>
                          <DollarSign className="h-4 w-4 mr-1" />
                          Harga
                        </Link>
                      </Button>
                      <Button asChild variant="outline" size="sm">
                        <Link href={`/admin/products/${product.id}/edit`}>
                          <Pencil className="h-4 w-4" />
                        </Link>
                      </Button>
                      <DeleteButton 
                        onDelete={deleteProduct.bind(null, product.id)} 
                        title={`Hapus Produk ${product.name}?`}
                        description="Tindakan ini tidak dapat dibatalkan. Produk akan dihapus permanen."
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
