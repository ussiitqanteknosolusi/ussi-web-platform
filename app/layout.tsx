import type { Metadata } from "next";
import "./globals.css";

import { getSiteSettings } from "@/lib/settings";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  
  return {
    title: settings.site_title,
    description: settings.site_description,
    icons: {
      icon: "/favicon.ico",
    },
    openGraph: {
      title: settings.site_title,
      description: settings.site_description,
      type: "website",
      siteName: settings.site_title,
    }
  };
}

// ✅ PERFORMANCE: viewport is static, export separately to avoid dynamic rendering
export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

import { Navbar } from "@/components/layout/Navbar";
import { FooterWrapper } from "@/components/layout/FooterWrapper";
import { Footer } from "@/components/layout/Footer";
import { auth } from "@/auth";
import { Toaster } from "@/components/ui/sonner";
import { Suspense } from "react";

import NextTopLoader from "nextjs-toploader";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  return (
    <html lang="id" className="max-w-full w-full overflow-x-hidden">
      <body
        className={`font-sans antialiased overflow-x-hidden w-full max-w-full`}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "USSI ITS",
              url: process.env.NEXT_PUBLIC_APP_URL || "https://ussiits.com",
              logo: `${process.env.NEXT_PUBLIC_APP_URL || "https://ussiits.com"}/logo.png`,
              contactPoint: {
                "@type": "ContactPoint",
                telephone: "+62 877 8712 5466",
                contactType: "customer service",
                areaServed: "ID",
                availableLanguage: "Indonesian"
              },
              sameAs: [
                "https://www.instagram.com/ussiits/",
                "https://www.facebook.com/USSIITS",
                "https://www.youtube.com/channel/UCHEWHOhcd18-Vn9bkqvUIfA",
                "https://www.tiktok.com/@itqantechnosolution"
              ]
            })
          }}
        />
        <NextTopLoader 
          color="#DC143C"
          initialPosition={0.08}
          crawlSpeed={200}
          height={3}
          crawl={true}
          showSpinner={true}
          easing="ease"
          speed={200}
          shadow="0 0 10px #DC143C,0 0 5px #DC143C"
        />
        <Navbar user={session?.user} />
        <Suspense>
          {children}
        </Suspense>
        <FooterWrapper>
          <Footer />
        </FooterWrapper>
        <Toaster />
      </body>
    </html>
  );
}
