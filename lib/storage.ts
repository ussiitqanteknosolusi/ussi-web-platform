import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { v4 as uuidv4 } from "uuid";

/**
 * Saves a file to the specified folder within public/uploads.
 * @param file The file object (from FormData)
 * @param folder The target folder name (e.g., "projects", "clients")
 * @returns The public URL path to the saved file
 */
export async function saveFile(file: File, folder: string): Promise<string> {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  // Validate directory relative to public
  const validFolders = ['services', 'clients', 'blog', 'team', 'profiles', 'projects'];
  if (!validFolders.includes(folder)) {
      throw new Error(`Invalid upload folder: ${folder}`);
  }

  // Define upload directory
  const uploadDir = join(process.cwd(), "public/uploads", folder);
  
  // Ensure directory exists
  await mkdir(uploadDir, { recursive: true });

  // Generate unique filename
  // Fallback if file.name is missing or extension parsing fails
  const originalName = file.name || "unknown.jpg";
  const extension = originalName.split('.').pop() || "jpg";
  const filename = `${uuidv4()}.${extension}`;
  
  const filepath = join(uploadDir, filename);

  // Write file to disk
  await writeFile(filepath, buffer);

  // Return public path
  return `/uploads/${folder}/${filename}`;
}
