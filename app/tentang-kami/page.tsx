import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, Users, Zap, Shield, Target, History } from "lucide-react";
import Link from "next/link";

// ✅ PERFORMANCE: Removed "use client" — this page is 100% static content,
// no interactivity needed. Now renders as a Server Component (zero JS sent to client).
// ✅ ISR: Revalidate every 24 hours (content almost never changes)
export const revalidate = 86400;

export const metadata = {
  title: "Tentang Perusahaan | USSI ITS",
  description: "Jembatan Teknologi Keuangan Mikro Indonesia. Sejak 2004, kami mendedikasikan diri untuk memajukan BPR, Koperasi, dan LKM.",
};

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="pt-32 pb-16 md:pt-48 md:pb-32 bg-gradient-to-b from-muted/50 to-background">
        <div className="container px-4 md:px-6 text-center">
          <div className="max-w-3xl mx-auto space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <h1 className="text-4xl font-bold tracking-tight sm:text-6xl text-foreground">
              Jembatan Teknologi Keuangan Mikro Indonesia
            </h1>
            <p className="text-xl text-muted-foreground mt-6">
              Sejak 2004, kami mendedikasikan diri untuk memajukan BPR, Koperasi, dan LKM melalui solusi bank digital yang handal dan terintegrasi.
            </p>
          </div>
        </div>
      </section>

      {/* The Story */}
      <section className="py-20">
        <div className="container px-4 md:px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
             <div className="relative h-[400px] rounded-2xl overflow-hidden shadow-2xl animate-in fade-in slide-in-from-left-6 duration-700">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 z-0" />
                <Image 
                  src="/images/documentations/ussi-bukber.jpg" 
                  alt="USSI Team"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
             </div>
             <div className="space-y-6 animate-in fade-in slide-in-from-right-6 duration-700">
                <div className="inline-block rounded-lg bg-primary/10 px-3 py-1 text-sm text-primary font-medium">
                  Cerita Kami
                </div>
                <h2 className="text-3xl font-bold tracking-tight">
                  Mengerti Tantangan, Menghadirkan Solusi.
                </h2>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Perjalanan kami dimulai dengan satu misi sederhana: menyederhanakan kompleksitas operasional perbankan mikro. Kami memahami bahwa BPR dan LKM menghadapi tantangan regulasi yang ketat dan kebutuhan digitalisasi yang mendesak.
                </p>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  USSI ITS hadir bukan hanya sebagai vendor software, tapi sebagai mitra strategis. Sistem IBS (Integrated Banking System) kami lahir dari pengalaman lapangan puluhan tahun, dirancang untuk kepatuhan (compliance) penuh terhadap OJK dan kemudahan penggunaan.
                </p>
             </div>
          </div>
        </div>
      </section>

      {/* Vision & Mission Cards */}
      <section className="py-20 bg-muted/30">
        <div className="container px-4 md:px-6">
           <div className="grid md:grid-cols-2 gap-8">
              <Card className="bg-background border-none shadow-lg">
                <CardContent className="p-10 space-y-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary mb-2">
                    <Target className="h-6 w-6" />
                  </div>
                  <h3 className="text-2xl font-bold">Visi Kami</h3>
                  <p className="text-muted-foreground text-lg">
                    Menjadi penggerak utama digitalisasi ekonomi mikro Indonesia yang unggul dalam teknologi dan dominan dalam penciptaan nilai bisnis yang berkelanjutan.
                  </p>
                </CardContent>
              </Card>
              <Card className="bg-background border-none shadow-lg">
                <CardContent className="p-10 space-y-4">
                  <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center text-accent mb-2">
                    <Zap className="h-6 w-6" />
                  </div>
                  <h3 className="text-2xl font-bold">Misi Kami</h3>
                  <ul className="space-y-4 text-muted-foreground text-base">
                    <li className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-500 shrink-0 mt-1" />
                      <span>
                        <strong className="text-foreground">Akselerasi Digitalisasi Klien:</strong> Mempercepat adopsi Core Banking dan layanan digital pada ekosistem koperasi dan pesantren untuk meningkatkan daya saing mereka sekaligus memperluas market share perusahaan.
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-500 shrink-0 mt-1" />
                      <span>
                        <strong className="text-foreground">Ekspansi Layanan Strategis:</strong> Mengoptimalkan penetrasi produk high-margin seperti Digital Marketing dan SMS/WA Masking sebagai mesin pertumbuhan pendapatan perusahaan.
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-500 shrink-0 mt-1" />
                      <span>
                        <strong className="text-foreground">Efisiensi dan Produktivitas Operasional:</strong> Menjalankan manajemen proyek yang efektif dan sistematis guna memastikan setiap inisiatif bisnis memberikan kontribusi maksimal terhadap profitabilitas.
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-500 shrink-0 mt-1" />
                      <span>
                        <strong className="text-foreground">Kemitraan Bernilai Tinggi:</strong> Membangun ekosistem kemitraan yang luas untuk menciptakan peluang pendapatan baru (new revenue streams) melalui inovasi produk.
                      </span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
           </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-24">
        <div className="container px-4 md:px-6 text-center">
           <h2 className="text-3xl font-bold mb-16">Nilai Inti USSI</h2>
           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="flex flex-col items-center space-y-4">
                 <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center text-blue-600 mb-2">
                    <Shield className="h-8 w-8" />
                 </div>
                 <h3 className="text-xl font-bold">Trusted & Secure</h3>
                 <p className="text-muted-foreground">
                   Data nasabah adalah aset paling berharga. Sistem kami dibangun dengan standar keamanan industri perbankan.
                 </p>
              </div>
              <div className="flex flex-col items-center space-y-4">
                 <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center text-green-600 mb-2">
                    <Users className="h-8 w-8" />
                 </div>
                 <h3 className="text-xl font-bold">Client-Centric</h3>
                 <p className="text-muted-foreground">
                   Kesuksesan Anda adalah kesuksesan kami. Tim support kami siap membantu setiap kendala teknis Anda.
                 </p>
              </div>
              <div className="flex flex-col items-center space-y-4">
                 <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900/20 rounded-full flex items-center justify-center text-orange-600 mb-2">
                    <Zap className="h-8 w-8" />
                 </div>
                 <h3 className="text-xl font-bold">Continuous Innovation</h3>
                 <p className="text-muted-foreground">
                   Teknologi tidak pernah berhenti berkembang, begitu juga kami. Update fitur berkala adalah standar kami.
                 </p>
              </div>
           </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-primary/5 border-t">
        <div className="container text-center px-4 md:px-6">
           <h2 className="text-3xl font-bold mb-6">Siap Bertransformasi Bersama Kami?</h2>
           <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
             Bergabunglah dengan ribuan LKM yang telah memodernisasi layanan mereka dengan USSI ITS.
           </p>
           <div className="flex justify-center gap-4">
             <Button size="lg" asChild>
               <Link href="/layanan">Lihat Produk</Link>
             </Button>
             <Button size="lg" variant="outline" asChild>
               <Link href="/hubungi-kami">Hubungi Tim Sales</Link>
             </Button>
           </div>
        </div>
      </section>
    </div>
  );
}
