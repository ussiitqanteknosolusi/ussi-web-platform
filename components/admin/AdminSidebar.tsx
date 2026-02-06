"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  LayoutDashboard,
  MessageSquare,
  Settings,
  LogOut,
  FileText,
  Briefcase,
  Layers,
  Users,
  UserCog,
  Menu,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface AdminSidebarProps {
  userName: string;
  userRole?: string;
  onSignOut: () => void;
}

const navItems = [
  { href: "/admin", icon: LayoutDashboard, label: "Dashboard", exact: true },
  { href: "/admin/inquiries", icon: MessageSquare, label: "Inquiries" },
  { href: "/admin/projects", icon: Briefcase, label: "Projects" },
  { href: "/admin/services", icon: Layers, label: "Services" },
  { href: "/admin/products", icon: Layers, label: "Products" },
  { href: "/admin/clients", icon: Users, label: "Klien" },
  { href: "/admin/users", icon: UserCog, label: "Manajemen User", superadminOnly: true },
  { href: "/admin/blog", icon: FileText, label: "Blog & Artikel" },
  { href: "/admin/settings", icon: Settings, label: "Settings" },
];

export function AdminSidebar({ userName, userRole, onSignOut }: AdminSidebarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (href: string, exact?: boolean) => {
    if (exact) {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  const NavContent = () => (
    <>
      <div className="p-6 border-b border-primary-foreground/10">
        <h1 className="text-xl font-bold tracking-tight">USSI ITS Admin</h1>
        <p className="text-xs text-primary-foreground/70 mt-1">
          Welcome, {userName}
        </p>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => {
          if (item.superadminOnly && userRole !== "SUPERADMIN") {
            return null;
          }
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setIsOpen(false)}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-md transition-colors",
                isActive(item.href, item.exact)
                  ? "bg-white/20 text-white font-semibold"
                  : "hover:bg-white/10"
              )}
            >
              <Icon size={20} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-primary-foreground/10">
        <form action={onSignOut}>
          <Button
            variant="ghost"
            className="w-full justify-start text-primary-foreground hover:text-white hover:bg-white/10"
          >
            <LogOut size={20} className="mr-2" />
            Sign Out
          </Button>
        </form>
      </div>
    </>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="w-64 bg-primary text-primary-foreground hidden md:flex flex-col">
        <NavContent />
      </aside>

      {/* Mobile Header & Sheet */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-primary text-primary-foreground p-4 flex items-center justify-between shadow-lg">
        <h1 className="text-lg font-bold">USSI ITS Admin</h1>
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="text-primary-foreground hover:bg-white/10">
              <Menu size={24} />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0 bg-primary text-primary-foreground border-none">
            <SheetHeader className="sr-only">
              <SheetTitle>Menu Navigasi</SheetTitle>
            </SheetHeader>
            <NavContent />
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}
