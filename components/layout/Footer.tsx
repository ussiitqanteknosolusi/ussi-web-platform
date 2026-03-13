import Link from "next/link";
import Image from "next/image";
import { Instagram, Youtube, Facebook } from "lucide-react";
import { getSiteSettings } from "@/lib/settings";

export async function Footer() {
  const settings = await getSiteSettings();

  return (
    <>
      <footer className="bg-[#0d2a1f] text-white">
        <div className="container mx-auto px-4 py-12">
          {/* Logo/Brand */}
          <div className="text-center mb-8">
            <Link href="/" className="inline-block">
              <Image
                src="/logo.png"
                alt={settings.site_title}
                width={120}
                height={40}
                className="mx-auto brightness-0 invert"
              />
            </Link>
          </div>

          {/* Social Media Icons */}
          <div className="flex justify-center gap-6 mb-8">
            {settings.social_instagram && (
              <a
                href={settings.social_instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-primary transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
            )}
            {settings.social_tiktok && (
              <a
                href={settings.social_tiktok}
                target="_blank"
                rel="noopener noreferrer"
                className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-primary transition-colors"
                aria-label="TikTok"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                </svg>
              </a>
            )}
            {settings.social_facebook && (
              <a
                href={settings.social_facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-primary transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
            )}
            {settings.social_youtube && (
              <a
                href={settings.social_youtube}
                target="_blank"
                rel="noopener noreferrer"
                className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-primary transition-colors"
                aria-label="YouTube"
              >
                <Youtube className="h-5 w-5" />
              </a>
            )}
          </div>

          {/* Copyright */}
          <div className="text-center text-sm text-white/60">
            <p>&copy; {new Date().getFullYear()} {settings.site_title}. All Rights Reserved.</p>
          </div>
        </div>
      </footer>

    </>
  );
}
