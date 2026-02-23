import { MapPin, Mail, Clock } from "lucide-react";
import { ContactForm } from "@/components/contact/ContactForm";
import { getSiteSettings } from "@/lib/settings";

export async function generateMetadata() {
  const settings = await getSiteSettings();
  return {
    title: `Hubungi Kami | ${settings.site_title}`,
    description: `Hubungi tim ${settings.site_title} untuk solusi teknologi perbankan dan digitalisasi lembaga keuangan.`,
  };
}

export default async function ContactPage() {
  const settings = await getSiteSettings();

  return (
    <div className="min-h-screen pt-24 pb-12">
      {/* Header Section */}
      <div className="bg-primary text-primary-foreground py-16 md:py-24 mb-12">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Hubungi Kami</h1>
          <p className="text-lg text-primary-foreground/80 max-w-2xl mx-auto">
            Tim kami siap membantu menjawab pertanyaan Anda seputar solusi teknologi perbankan dan digitalisasi lembaga keuangan.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
          
          {/* Left Column: Contact Form */}
          <div>
            <div className="bg-card border rounded-2xl p-8 shadow-sm">
              <h2 className="text-2xl font-bold mb-6">Kirim Pesan</h2>
              <ContactForm />
            </div>
          </div>

          {/* Right Column: Info & Map */}
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold mb-6">Kantor Pusat</h2>
              <div className="space-y-6 text-muted-foreground">
                <div className="flex gap-4 items-start">
                  <div className="h-10 w-10 shrink-0 bg-primary/10 text-primary rounded-lg flex items-center justify-center">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">Alamat</h3>
                    <p className="leading-relaxed whitespace-pre-line">
                      {settings.contact_address}
                    </p>
                    <a 
                      href="https://maps.app.goo.gl/zE1VdrqnDaJxaaiY8" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-primary text-sm font-medium hover:underline mt-2 inline-block"
                    >
                      Buka di Google Maps &rarr;
                    </a>
                  </div>
                </div>

                <div className="flex gap-4 items-start">
                  <div className="h-10 w-10 shrink-0 bg-primary/10 text-primary rounded-lg flex items-center justify-center">
                    <Clock className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">Jam Operasional</h3>
                    <p>Senin - Jumat: 08.00 - 17.00 WIB</p>
                    <p>Sabtu - Minggu: Libur</p>
                  </div>
                </div>

                <div className="flex gap-4 items-start">
                  <div className="h-10 w-10 shrink-0 bg-primary/10 text-primary rounded-lg flex items-center justify-center">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">Email & Telepon</h3>
                    <p>{settings.contact_email}</p>
                    <p>{settings.contact_phone}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Google Maps Embed */}
            <div className="rounded-2xl overflow-hidden border shadow-sm h-[300px] relative bg-muted">
              <iframe
                src="https://maps.google.com/maps?q=KSPPS+BMT+ITQAN+Bandung&t=&z=15&ie=UTF8&iwloc=&output=embed"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={true}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="absolute inset-0"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
