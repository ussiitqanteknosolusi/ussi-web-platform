import { db } from "@/lib/prisma";
import Image from "next/image";
import { unstable_cache } from "next/cache";

// ✅ PERFORMANCE: Cache client logos for 1 hour via ISR
export const revalidate = 3600; 

const stats = [
  { label: "BPR", value: "297+" },
  { label: "BPRS", value: "14+" },
  { label: "LPD", value: "519+" },
  { label: "KOPERASI", value: "900+" },
  { label: "Total", value: "1.730+" },
];

// ✅ PERFORMANCE: Cache client query separately so it's shared across pages
const getCachedClients = unstable_cache(
  async () => {
    return db.client.findMany({
      where: { logoUrl: { not: null } },
      orderBy: { isFeatured: "desc" },
      select: { name: true, logoUrl: true },
    });
  },
  ["trust-signal-clients"],
  { revalidate: 3600, tags: ["clients"] }
);

export default async function TrustSignals() {
  const clients = await getCachedClients();

  // If few clients, duplicate them to make marquee smooth
  const displayClients = clients.length > 0 
    ? [...clients, ...clients, ...clients, ...clients] 
    : [];

  return (
    <section className="py-20 bg-background overflow-hidden border-y">
      <div className="container px-4 md:px-6">
        {/* Stats Grid */}
        <div className="space-y-4 sm:space-y-0 sm:grid sm:grid-cols-2 lg:grid-cols-5 sm:gap-4 md:gap-6 mb-16 max-w-6xl mx-auto">
          {stats.map((stat) => (
            <div 
              key={stat.label} 
              className="flex flex-col items-center justify-center p-6 bg-[#bc1e22] rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 max-w-sm mx-auto sm:max-w-none w-full"
            >
              <div className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white mb-2 text-center">
                {stat.value}
              </div>
              <div className="text-xs md:text-sm text-white/80 font-medium text-center uppercase tracking-wider">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Client Marquee */}
        {clients.length > 0 && (
          <div className="relative max-w-full">
            <div className="text-center mb-8 text-muted-foreground uppercase tracking-widest text-xs md:text-sm font-semibold">
              Dipercaya oleh Institusi Keuangan Terkemuka
            </div>
            
            <div className="flex overflow-hidden mask-gradient-x relative w-full max-w-full group">
                <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
                <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />
                
              <div
                className="flex gap-12 md:gap-20 items-center whitespace-nowrap py-4 animate-marquee group-hover:pause"
                style={{ minWidth: '100%' }}
              >
                {displayClients.map((client, i) => (
                  <div
                    key={`${client.name}-${i}`}
                    className="relative h-14 w-28 md:h-20 md:w-40 flex-shrink-0 grayscale hover:grayscale-0 transition-all duration-300 opacity-60 hover:opacity-100"
                  >
                    {client.logoUrl && (
                        <Image 
                          src={client.logoUrl} 
                          alt={client.name} 
                          fill 
                          className="object-contain"
                          sizes="(max-width: 768px) 112px, 160px"
                          loading="lazy"
                        />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
