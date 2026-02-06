import HeroSection from "@/components/sections/HeroSection";
import BentoGrid from "@/components/sections/BentoGrid";
import TrustSignals from "@/components/sections/TrustSignals";
import WhyChooseUs from "@/components/sections/WhyChooseUs";
import FAQ from "@/components/sections/FAQ";
import LeadForm from "@/components/sections/LeadForm";
import { getSiteSettings } from "@/lib/settings";

export default async function Home() {
  const settings = await getSiteSettings();

  return (
    <main className="flex min-h-screen flex-col items-center justify-between w-full max-w-full overflow-x-hidden">
      <HeroSection settings={settings} />
      <BentoGrid />
      <TrustSignals />
      <WhyChooseUs />
      <FAQ />
      <LeadForm />
    </main>
  );
}
