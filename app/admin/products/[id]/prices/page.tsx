import { db } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus, Pencil, Trash2, ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";
import { deleteProductPrice } from "@/actions/product-prices";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ProductPricesPage({ params }: PageProps) {
  const { id } = await params;
  const productId = parseInt(id);

  const product = await db.product.findUnique({
    where: { id: productId },
    include: {
      prices: {
        orderBy: { displayOrder: "asc" },
      },
    },
  });

  if (!product) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/admin/products">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Harga Produk</h1>
          <p className="text-muted-foreground">
            Kelola daftar harga untuk produk: <span className="font-semibold text-primary">{product.name}</span>
          </p>
        </div>
        <div className="ml-auto">
          <Button asChild>
            <Link href={`/admin/products/${id}/prices/new`}>
              <Plus className="mr-2 h-4 w-4" />
              Tambah Harga
            </Link>
          </Button>
        </div>
      </div>

      <div className="border rounded-lg">
        <table className="w-full">
          <thead className="bg-muted/50">
            <tr>
              <th className="text-left p-4 font-medium">Nama Paket</th>
              <th className="text-left p-4 font-medium">Harga</th>
              <th className="text-left p-4 font-medium">Urutan</th>
              <th className="text-center p-4 font-medium">Best Value</th>
              <th className="text-right p-4 font-medium">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {product.prices.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center p-8 text-muted-foreground">
                    Belum ada harga. Tambahkan harga untuk produk ini.
                </td>
              </tr>
            ) : (
              product.prices.map((price) => (
                <tr key={price.id} className="border-t hover:bg-muted/30">
                  <td className="p-4 font-medium">{price.name}</td>
                  <td className="p-4">
                    Rp {parseFloat(price.price.toString()).toLocaleString("id-ID")}
                  </td>
                  <td className="p-4">{price.displayOrder}</td>
                  <td className="p-4 text-center">
                    {price.isBestValue && (
                      <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
                        Best Value
                      </span>
                    )}
                  </td>
                  <td className="p-4">
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/admin/products/${id}/prices/${price.id}/edit`}>
                          <Pencil className="h-4 w-4" />
                        </Link>
                      </Button>
                      <form
                        action={async () => {
                          "use server";
                          await deleteProductPrice(price.id, productId);
                        }}
                      >
                        <Button
                          variant="destructive"
                          size="sm"
                          type="submit"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </form>
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
