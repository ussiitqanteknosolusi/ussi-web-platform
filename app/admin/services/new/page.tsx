import ServiceForm from "@/components/admin/ServiceForm";

export default function NewServicePage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Tambah Service Baru</h1>
        <p className="text-muted-foreground">Buat layanan baru untuk ditampilkan di website</p>
      </div>

      <ServiceForm />
    </div>
  );
}
