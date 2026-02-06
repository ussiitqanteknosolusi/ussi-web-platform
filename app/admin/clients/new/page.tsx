import ClientForm from "@/components/admin/ClientForm";

export default function NewClientPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Tambah Klien Baru</h1>
        <p className="text-muted-foreground">
          Tambahkan partner atau klien baru ke dalam daftar.
        </p>
      </div>

      <ClientForm />
    </div>
  );
}
