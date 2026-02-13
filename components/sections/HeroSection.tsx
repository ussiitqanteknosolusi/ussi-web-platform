import { Button } from "@/components/ui/button";
import { ArrowRight, PlayCircle, ChevronDown } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { SiteSettings } from "@/lib/settings";

interface HeroSectionProps {
  settings: SiteSettings;
}

export default function HeroSection({ settings }: HeroSectionProps) {
  return (
    <section className="relative min-h-screen w-full flex items-center justify-center overflow-x-hidden bg-background pt-20 pb-16 lg:pt-32">
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        {/* Grid Pattern */}
        <div 
          className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"
        />
        
        {/* Gradient Orbs */}
        <div className="absolute inset-0 opacity-20">
          <div
            className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full blur-[100px]"
            style={{
              background:
                "linear-gradient(135deg, var(--accent) 0%, var(--primary) 100%)",
            }}
          />
          <div
            className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full blur-[120px]"
            style={{
              background:
                "linear-gradient(45deg, var(--secondary) 0%, var(--accent) 100%)",
            }}
          />
        </div>
      </div>

      <div className="container px-4 md:px-6 relative z-10 grid lg:grid-cols-2 gap-12 items-center">
        {/* Text Content */}
        <div
          className="max-w-3xl animate-in fade-in slide-in-from-bottom-6 duration-1000"
        >
          <div className="inline-flex items-center rounded-full border border-accent/20 bg-accent/5 px-3 py-1 text-sm font-medium text-accent mb-6 backdrop-blur-sm">
            <span className="flex h-2 w-2 rounded-full bg-accent mr-2 animate-pulse"></span>
            Mitra Teknologi Andalan 1.700+ Lembaga Keuangan
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground leading-[1.15] mb-6">
            Digitalisasi Ekosistem{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
              Keuangan Mikro
            </span>{" "}
            dengan Sistem Terintegrasi.
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl leading-relaxed">
            {settings.site_description}
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              size="lg"
              className="bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20 h-12 px-8 text-base transition-transform hover:scale-105"
              asChild
            >
              <Link href="#contact">
                Jadwalkan Demo <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-primary/20 hover:bg-primary/5 text-primary h-12 px-8 text-base transition-transform hover:scale-105"
              asChild
            >
              <Link href="#products">
                <PlayCircle className="ml-2 h-4 w-4" /> Lihat Produk
              </Link>
            </Button>
          </div>
        </div>

        {/* Visual Element (3D-like Dashboard Mockup) */}
        <div
          className="relative hidden lg:block keyframe-float animate-in fade-in slide-in-from-right-6 duration-1000 delay-200 fill-mode-both"
        >
          <div className="relative z-10 rounded-xl border border-border bg-background/50 backdrop-blur-xl shadow-2xl overflow-hidden transform rotate-y-12 hover:rotate-y-0 transition-transform duration-700 ease-in-out group">
             {/* Use documentation image as hero visual */}
             <div className="relative aspect-video w-full overflow-hidden">
                <div className="absolute inset-0 bg-primary/10 group-hover:bg-transparent transition-colors z-10" />
                <Image 
                  src="/images/documentations/ussi-bukber.jpg" 
                  alt="USSI Team Activity" 
                  width={800} 
                  height={600}
                  className="object-cover w-full h-full"
                  sizes="(max-width: 1024px) 0px, 50vw"
                  priority
                />
             </div>
             
             {/* Floating Badge */}
             <div className="absolute bottom-4 right-4 z-20 bg-background/90 backdrop-blur border border-border p-3 rounded-lg shadow-lg flex items-center gap-3">
                <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-xs font-semibold">Live System Monitoring</span>
             </div>
          </div>
          
          {/* Decorative Elements */}
          <div className="absolute -top-10 -right-10 w-24 h-24 bg-accent/20 rounded-full blur-2xl animate-pulse"></div>
          <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-primary/20 rounded-full blur-2xl animate-pulse delay-700"></div>
        </div>
      </div>

      {/* Scroll Down Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center animate-bounce duration-1000 text-muted-foreground/60">
        <span className="text-[10px] uppercase tracking-[0.2em] mb-2 font-medium">Scroll</span>
        <ChevronDown className="h-5 w-5" />
      </div>
    </section>
  );
}
