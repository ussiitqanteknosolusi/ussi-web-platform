import { db } from "@/lib/prisma";
import TrustSignals from "@/components/sections/TrustSignals";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";

const ITEMS_PER_PAGE = 20;

export const metadata = {
    title: "Klien Kami | USSI ITS",
    description: "Daftar lembaga keuangan yang telah mempercayakan solusi teknologi mereka kepada kami.",
};

export default async function ClientsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const resolvedSearchParams = await searchParams;
  const currentPage = Number(resolvedSearchParams.page) || 1;
  const skip = (currentPage - 1) * ITEMS_PER_PAGE;

  const [clients, totalClients] = await Promise.all([
    db.client.findMany({
      orderBy: { createdAt: "desc" }, // Or name: 'asc' if preferred, but usually latest first or alphabetical
      take: ITEMS_PER_PAGE,
      skip: skip,
    }),
    db.client.count(),
  ]);

  const totalPages = Math.ceil(totalClients / ITEMS_PER_PAGE);

  return (
    <div className="pt-24 pb-12">
      <div className="container px-4">
        {/* Header */}
        <div className="text-center mb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
             <h1 className="text-4xl font-bold mb-4">Klien Kami</h1>
             <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Lebih dari {totalClients > 1000 ? "1000" : totalClients} lembaga keuangan telah mempercayakan operasionalnya kepada kami.
             </p>
        </div>

        {/* Table Container */}
        <div className="max-w-4xl mx-auto bg-card rounded-xl border shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-6 duration-700">
           <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[80px] text-center">No</TableHead>
                    <TableHead>Nama Klien / Institusi</TableHead>
                    <TableHead>Industri</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {clients.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={3} className="text-center py-8 text-muted-foreground">
                            Belum ada data klien.
                        </TableCell>
                      </TableRow>
                  ) : (
                      clients.map((client, index) => (
                        <TableRow key={client.id} className="hover:bg-muted/50 transition-colors">
                          <TableCell className="font-medium text-center text-muted-foreground">
                            {skip + index + 1}
                          </TableCell>
                          <TableCell className="font-medium">{client.name}</TableCell>
                          <TableCell>
                             <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                                {client.industry}
                             </span>
                          </TableCell>
                        </TableRow>
                      ))
                  )}
                </TableBody>
              </Table>
           </div>
           
           {/* Pagination */}
           {totalPages > 1 && (
               <div className="flex items-center justify-between px-4 py-4 border-t bg-muted/20">
                 <div className="text-sm text-muted-foreground hidden sm:block">
                   Menampilkan {skip + 1} - {Math.min(skip + ITEMS_PER_PAGE, totalClients)} dari {totalClients} klien
                 </div>
                 <div className="flex gap-2 w-full sm:w-auto justify-between sm:justify-end">
                    <Button
                        variant="outline"
                        size="sm"
                        disabled={currentPage <= 1}
                        asChild
                    >
                        <Link href={`/clients?page=${currentPage - 1}`}>
                             <ChevronLeft className="h-4 w-4 mr-2" /> Sebelumnya
                        </Link>
                    </Button>
                    <span className="flex items-center text-sm font-medium sm:hidden">
                        Halaman {currentPage}
                    </span>
                    <Button
                        variant="outline"
                        size="sm"
                        disabled={currentPage >= totalPages}
                        asChild
                    >
                         <Link href={`/clients?page=${currentPage + 1}`}>
                             Selanjutnya <ChevronRight className="h-4 w-4 ml-2" />
                         </Link>
                    </Button>
                 </div>
               </div>
           )}
        </div>
      </div>
      
      {/* Trust Signals */}
      <div className="mt-20">
          <TrustSignals />
      </div>
    </div>
  );
}
