import { auth } from "@/auth";
import { db } from "@/lib/prisma";
import { redirect, notFound } from "next/navigation";
import { UserEditForm } from "@/components/admin/UserEditForm";

interface EditUserPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditUserPage({ params }: EditUserPageProps) {
  const session = await auth();

  if (session?.user?.role !== "SUPERADMIN") {
    redirect("/admin");
  }

  const { id } = await params;
  const userId = parseInt(id);

  if (isNaN(userId)) {
    notFound();
  }

  const [user, clients] = await Promise.all([
    db.user.findUnique({
      where: { id: userId },
    }),
    db.client.findMany({
      orderBy: { name: "asc" },
      select: { id: true, name: true },
    }),
  ]);

  if (!user) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Edit User</h1>
      </div>
      <UserEditForm user={user} clients={clients} />
    </div>
  );
}
