import QueryProvider from "@/components/providers/QueryProvider";
import { auth, signOut } from "@/auth";
import { redirect } from "next/navigation";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session) {
    redirect("/auth/login");
  }

  const handleSignOut = async () => {
    "use server";
    await signOut({ redirectTo: "/" });
  };

  return (
    <QueryProvider>
      <div className="min-h-screen flex bg-muted/20">
        <AdminSidebar 
          userName={session.user?.name || "Admin"} 
          userRole={session.user?.role}
          onSignOut={handleSignOut}
        />

        {/* Main Content */}
        <main className="flex-1 p-4 md:p-8 overflow-y-auto pt-20 md:pt-8">
          {children}
        </main>
      </div>
    </QueryProvider>
  );
}
