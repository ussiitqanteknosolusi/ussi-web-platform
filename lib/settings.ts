import { db } from "@/lib/prisma";
import { unstable_cache } from "next/cache";

// Default values - used when settings are not in database or empty
export const siteDefaults = {
  // General
  site_title: "USSI ITS",
  site_description: "Solusi Core Microbanking (IBS) andal untuk BPR, Koperasi, dan Lembaga Keuangan Mikro di seluruh Indonesia.",
  footer_text: "PT USSI ItQan Tekno Solusi",
  
  // Contact
  contact_email: "ussi.itqanteknosolusi@gmail.com",
  contact_phone: "+62 877 8712 5466",
  contact_address: "Jl. Pasirlayung Barat No.119, Padasuka, Kec. Cimenyan, Kabupaten Bandung, Jawa Barat 40911",
  whatsapp_number: "6287787125466",
  whatsapp_url: "https://wa.me/6287787125466?text=Halo%20USSI%20ITS%2C%20saya%20ingin%20bertanya",
  
  // Social Media
  social_instagram: "https://www.instagram.com/ussiits/",
  social_facebook: "https://www.facebook.com/USSIITS",
  social_youtube: "https://www.youtube.com/channel/UCHEWHOhcd18-Vn9bkqvUIfA",
  social_tiktok: "https://www.tiktok.com/@itqantechnosolution",
  social_linkedin: "",
  social_twitter: "",
};

export type SiteSettings = typeof siteDefaults;

// Fetch settings from database
async function fetchSettingsFromDB(): Promise<Record<string, string>> {
  try {
    const settings = await db.setting.findMany({
      select: { keyName: true, value: true },
    });
    const settingsMap: Record<string, string> = {};
    settings.forEach((s) => {
      settingsMap[s.keyName] = s.value;
    });
    return settingsMap;
  } catch (error) {
    console.error("Error fetching settings:", error);
    return {};
  }
}

// ✅ PERFORMANCE: Cache for 5 minutes (300s) instead of 60s
// This means only ~288 DB queries/day instead of ~1440
export const getSettingsFromDB = unstable_cache(
  fetchSettingsFromDB,
  ["site-settings"],
  { revalidate: 300, tags: ["settings"] }
);

// Get a single setting value with fallback to default
export function getSettingValue(
  settings: Record<string, string>,
  key: keyof SiteSettings
): string {
  const value = settings[key]?.trim();
  return value || siteDefaults[key];
}

// Get all settings merged with defaults
export async function getSiteSettings(): Promise<SiteSettings> {
  const dbSettings = await getSettingsFromDB();
  
  const merged: SiteSettings = { ...siteDefaults };
  
  for (const key of Object.keys(siteDefaults) as (keyof SiteSettings)[]) {
    const dbValue = dbSettings[key]?.trim();
    if (dbValue) {
      merged[key] = dbValue;
    }
  }
  
  return merged;
}

// Helper to generate WhatsApp URL with custom message
export function getWhatsAppUrl(settings: SiteSettings, message?: string): string {
  const number = settings.whatsapp_number || siteDefaults.whatsapp_number;
  const defaultMessage = "Halo USSI ITS, saya ingin bertanya";
  const text = encodeURIComponent(message || defaultMessage);
  return `https://wa.me/${number}?text=${text}`;
}
