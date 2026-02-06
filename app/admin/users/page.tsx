import { auth } from "@/auth";
import { db } from "@/lib/prisma";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { redirect } from "next/navigation";
import { Shield, Pencil } from "lucide-react";
import { UserForm } from "@/components/admin/UserForm";
import DeleteButton from "@/components/admin/DeleteButton";
import { deleteUser } from "@/actions/users";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function AdminUsersPage() {
  const session = await auth();

  if (session?.user?.role !== "SUPERADMIN") {
      redirect("/admin");
  }

  const [users, clients] = await Promise.all([
    db.user.findMany({
      orderBy: { createdAt: "desc" },
      include: { client: true },
    }),
    db.client.findMany({
      orderBy: { name: "asc" },
      select: { id: true, name: true },
    }),
  ]);

  const currentUserEmail = session.user?.email;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Manajemen User</h1>
        <UserForm clients={clients} />
      </div>

      <div className="border rounded-lg shadow-sm bg-white overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">No</TableHead>
              <TableHead>Nama</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Klien</TableHead>
              <TableHead>Tanggal Daftar</TableHead>
              <TableHead className="w-[80px]">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center h-32 text-muted-foreground">
                  Belum ada data user.
                </TableCell>
              </TableRow>
            ) : (
              users.map((user, index) => (
                <TableRow key={user.id}>
                  <TableCell className="text-muted-foreground">{index + 1}</TableCell>
                  <TableCell className="font-medium">
                      <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
                              {user.name.substring(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <div>{user.name}</div>
                            {user.email === currentUserEmail && (
                              <span className="text-xs text-muted-foreground">(Anda)</span>
                            )}
                          </div>
                      </div>
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                        {user.role === "SUPERADMIN" && <Shield className="h-3 w-3 text-destructive" />}
                        <Badge variant={user.role === "SUPERADMIN" ? "destructive" : "secondary"}>
                            {user.role}
                        </Badge>
                    </div>
                  </TableCell>
                  <TableCell>
                      {user.client ? (
                          <span className="font-medium">{user.client.name}</span>
                      ) : (
                          <span className="text-muted-foreground text-sm">-</span>
                      )}
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                      {new Date(user.createdAt).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "short",
                          year: "numeric"
                      })}
                  </TableCell>
                  <TableCell>
                    {user.email !== currentUserEmail && (
                      <div className="flex gap-2">
                        <Button asChild variant="outline" size="icon" className="h-8 w-8">
                          <Link href={`/admin/users/${user.id}/edit`}>
                             <Pencil className="h-4 w-4" />
                          </Link>
                        </Button>
                        <DeleteButton
                          onDelete={async () => {
                            "use server";
                            const result = await deleteUser(user.id);
                            if (result.success) {
                              return { success: `User "${user.name}" berhasil dihapus` };
                            }
                            return { error: result.error || "Gagal menghapus user" };
                          }}
                          title={`Hapus ${user.name}?`}
                          description="Aksi ini tidak dapat dibatalkan. User akan dihapus secara permanen."
                        />
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
