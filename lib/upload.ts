import { writeFile, mkdir, unlink } from "fs/promises";
import { existsSync } from "fs";
import path from "path";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_FILE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
const VALID_FOLDERS = ["services", "clients", "blog", "team", "profiles", "projects", "products"];

export async function uploadFile(
  file: File,
  folder: string = "services"
): Promise<string> {
  // Validate folder
  if (!VALID_FOLDERS.includes(folder)) {
    throw new Error(`Invalid upload folder: ${folder}`);
  }

  // Validate file size
  if (file.size > MAX_FILE_SIZE) {
    throw new Error(`File size too large. Max allowed is 10MB.`);
  }

  // Validate file type
  if (!ALLOWED_FILE_TYPES.includes(file.type)) {
    throw new Error(`Invalid file type. Only JPG, PNG, and WebP are allowed.`);
  }

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
    const relativePath = fileUrl.startsWith("/") ? fileUrl.slice(1) : fileUrl;
    const filepath = path.join(process.cwd(), "public", relativePath);
    const resolved = path.resolve(filepath);
    const publicDir = path.resolve(process.cwd(), "public");

    // Prevent path traversal
    if (!resolved.startsWith(publicDir)) {
      console.error("Path traversal attempt blocked:", fileUrl);
      return;
    }

    if (existsSync(resolved)) {
      await unlink(resolved);
    }
  } catch (error) {
    console.error("Delete file error:", error);
    // Don't throw error to prevent blocking main operation
  }
}
