"use server";

import { db } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { revalidateTag } from "next/cache";

export async function getSettings() {
  const settings = await db.setting.findMany({
    select: { keyName: true, value: true },
  });
  const settingsMap: Record<string, string> = {};
  
  settings.forEach((setting) => {
    settingsMap[setting.keyName] = setting.value;
  });

  return settingsMap;
}

export async function updateSettings(formData: FormData) {
  const entries = Array.from(formData.entries());
  
  try {
    // ✅ FIX N+1: Batch all upserts in a single transaction instead of individual queries
    const upsertOps = entries
      .filter(([key, value]) => typeof value === "string" && key.startsWith("setting_"))
      .map(([key, value]) => {
        const keyName = key.replace("setting_", "");
        return db.setting.upsert({
          where: { keyName },
          update: { value: value as string },
          create: { keyName, value: value as string },
        });
      });

    if (upsertOps.length > 0) {
      await db.$transaction(upsertOps);
    }
    
    revalidatePath("/admin/settings");
    revalidatePath("/"); // Revalidate home as settings might affect footer/header
    revalidateTag("settings"); // ✅ Invalidate the unstable_cache for settings
    
    return { success: true, message: "Settings updated successfully" };
  } catch (error) {
    console.error("Error updating settings:", error);
    return { success: false, message: "Failed to update settings" };
  }
}
