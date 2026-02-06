"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { updateUser } from "@/actions/users";
import { Loader2, ArrowLeft, Eye, EyeOff } from "lucide-react";

interface Client {
  id: number;
  name: string;
}

interface User {
  id: number;
  name: string;
  email: string;
  role: string | any;
  clientId: number | null;
}

interface UserEditFormProps {
  user: User;
  clients: Client[];
}

const ROLES = [
  { value: "EDITOR", label: "Editor", description: "Dapat mengelola konten" },
  { value: "SALES", label: "Sales", description: "Dapat melihat inquiries" },
  { value: "CLIENT_ADMIN", label: "Client Admin", description: "Admin untuk klien tertentu" },
  { value: "CLIENT_USER", label: "Client User", description: "User dari klien" },
  { value: "SUPERADMIN", label: "Super Admin", description: "Akses penuh ke semua fitur" },
];

export function UserEditForm({ user, clients }: UserEditFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState<string>(user.role);
  const [selectedClient, setSelectedClient] = useState<string>(
    user.clientId ? user.clientId.toString() : ""
  );

  const handleSubmit = async (formData: FormData) => {
    startTransition(async () => {
      const result = await updateUser(user.id, formData);
      
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success("User berhasil diupdate!");
        router.push("/admin/users");
        router.refresh();
      }
    });
  };

  const needsClient = selectedRole === "CLIENT_ADMIN" || selectedRole === "CLIENT_USER";

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <CardTitle>Edit User: {user.name}</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <form action={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Nama Lengkap</Label>
            <Input
              id="name"
              name="name"
              defaultValue={user.name}
              placeholder="Masukkan nama lengkap"
              required
              disabled={isPending}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              defaultValue={user.email}
              placeholder="email@example.com"
              required
              disabled={isPending}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password (Opsional)</Label>
            <div className="relative">
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Isi hanya jika ingin mengganti password"
                disabled={isPending}
                className="pr-10"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <Eye className="h-4 w-4 text-muted-foreground" />
                )}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">Minimal 6 karakter jika diisi.</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="role">Role</Label>
            <Select 
              name="role" 
              required 
              disabled={isPending}
              value={selectedRole}
              onValueChange={setSelectedRole}
            >
              <SelectTrigger>
                <SelectValue placeholder="Pilih role" />
              </SelectTrigger>
              <SelectContent>
                {ROLES.map((role) => (
                  <SelectItem key={role.value} value={role.value}>
                    <div className="flex flex-col">
                      <span>{role.label}</span>
                      <span className="text-xs text-muted-foreground">{role.description}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {needsClient && (
            <div className="space-y-2">
              <Label htmlFor="clientId">Klien</Label>
              <Select 
                name="clientId" 
                required={needsClient}
                disabled={isPending}
                value={selectedClient}
                onValueChange={setSelectedClient}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih klien" />
                </SelectTrigger>
                <SelectContent>
                  {clients.map((client) => (
                    <SelectItem key={client.id} value={client.id.toString()}>
                      {client.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              disabled={isPending}
            >
              Batal
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Simpan Perubahan
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
