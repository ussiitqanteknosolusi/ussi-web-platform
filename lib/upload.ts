import { writeFile, mkdir } from "fs/promises";
import path from "path";

export async function uploadFile(
  file: File,
  folder: string = "services"
): Promise<string> {
  try {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create unique filename
    const timestamp = Date.now();
    const originalName = file.name.replace(/\s+/g, "-");
    const filename = `${timestamp}-${originalName}`;

    // Ensure upload directory exists
    const uploadDir = path.join(process.cwd(), "public", "uploads", folder);
    await mkdir(uploadDir, { recursive: true });

    // Write file
    const filepath = path.join(uploadDir, filename);
    await writeFile(filepath, buffer);

    // Return public URL
    return `/uploads/${folder}/${filename}`;
  } catch (error) {
    console.error("Upload error:", error);
    throw new Error("Failed to upload file");
  }
}

export async function deleteFile(fileUrl: string): Promise<void> {
  try {
    // Extract filename from URL (remove leading slash)
    const relativePath = fileUrl.startsWith("/") ? fileUrl.slice(1) : fileUrl;
    const filepath = path.join(process.cwd(), "public", relativePath);
    
    // Check if file exists before deleting
    const fs = require("fs");
    if (fs.existsSync(filepath)) {
      await import("fs/promises").then(fsPromise => fsPromise.unlink(filepath));
    }
  } catch (error) {
    console.error("Delete file error:", error);
    // Don't throw error to prevent blocking main operation
  }
}
