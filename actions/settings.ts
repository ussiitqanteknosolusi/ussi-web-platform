"use server";

import { db } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getSettings() {
  const settings = await db.setting.findMany();
  const settingsMap: Record<string, string> = {};
  
  settings.forEach((setting) => {
    settingsMap[setting.keyName] = setting.value;
  });

  return settingsMap;
}

export async function updateSettings(formData: FormData) {
  const entries = Array.from(formData.entries());
  
  try {
    // Process each form entry
    for (const [key, value] of entries) {
      if (typeof value === "string" && key.startsWith("setting_")) {
        // Extract real key name (remove 'setting_' prefix)
        const keyName = key.replace("setting_", "");
        
        await db.setting.upsert({
            where: { keyName },
            update: { value },
            create: { keyName, value }
        });
      }
    }
    
    revalidatePath("/admin/settings");
    revalidatePath("/"); // Revalidate home as settings might affect footer/header
    
    return { success: true, message: "Settings updated successfully" };
  } catch (error) {
    console.error("Error updating settings:", error);
    return { success: false, message: "Failed to update settings" };
  }
}
