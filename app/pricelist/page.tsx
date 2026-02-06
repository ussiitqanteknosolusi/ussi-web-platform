import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

export default function PricelistPage() {
  return (
    <div className="container py-24">
      <h1 className="text-4xl font-bold mb-6 text-center">Pricelist & Paket</h1>
      <p className="text-lg text-muted-foreground text-center max-w-2xl mx-auto mb-16">
        Pilih solusi yang paling sesuai dengan skala bisnis Anda.
      </p>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Basic Plan */}
        <div className="border border-border rounded-xl p-8 bg-card shadow-sm hover:shadow-md transition-shadow">
           <h3 className="text-xl font-bold mb-2">Basic</h3>
           <div className="text-3xl font-bold mb-4">Rp 5Jt<span className="text-sm font-normal text-muted-foreground">/bulan</span></div>
           <p className="text-muted-foreground mb-6">Untuk BPR/LKM rintisan.</p>
           <ul className="space-y-3 mb-8">
             <li className="flex items-center gap-2"><Check className="h-4 w-4 text-green-500"/> Core Banking System</li>
             <li className="flex items-center gap-2"><Check className="h-4 w-4 text-green-500"/> Pelaporan OJK Standar</li>
             <li className="flex items-center gap-2"><Check className="h-4 w-4 text-green-500"/> Support Email</li>
           </ul>
           <Button className="w-full">Pilih Basic</Button>
        </div>
        
        {/* Pro Plan */}
        <div className="border border-primary rounded-xl p-8 bg-card shadow-xl relative scale-105">
           <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full">POPULAR</div>
           <h3 className="text-xl font-bold mb-2">Professional</h3>
           <div className="text-3xl font-bold mb-4">Rp 10Jt<span className="text-sm font-normal text-muted-foreground">/bulan</span></div>
           <p className="text-muted-foreground mb-6">Fitur lengkap untuk pertumbuhan.</p>
           <ul className="space-y-3 mb-8">
             <li className="flex items-center gap-2"><Check className="h-4 w-4 text-green-500"/> Semua fitur Basic</li>
             <li className="flex items-center gap-2"><Check className="h-4 w-4 text-green-500"/> IBS Mobile (White Label)</li>
             <li className="flex items-center gap-2"><Check className="h-4 w-4 text-green-500"/> Support 24/7 Prioritas</li>
             <li className="flex items-center gap-2"><Check className="h-4 w-4 text-green-500"/> WA Masking 1000/bln</li>
           </ul>
           <Button className="w-full" variant="default">Pilih Professional</Button>
        </div>

        {/* Enterprise Plan */}
        <div className="border border-border rounded-xl p-8 bg-card shadow-sm hover:shadow-md transition-shadow">
           <h3 className="text-xl font-bold mb-2">Enterprise</h3>
           <div className="text-3xl font-bold mb-4">Custom</div>
           <p className="text-muted-foreground mb-6">Solusi spesifik kebutuhan Anda.</p>
           <ul className="space-y-3 mb-8">
             <li className="flex items-center gap-2"><Check className="h-4 w-4 text-green-500"/> Custom Development</li>
             <li className="flex items-center gap-2"><Check className="h-4 w-4 text-green-500"/> Dedicated Server</li>
             <li className="flex items-center gap-2"><Check className="h-4 w-4 text-green-500"/> On-site Training</li>
           </ul>
           <Button className="w-full" variant="outline">Hubungi Sales</Button>
        </div>
      </div>
    </div>
  );
}
