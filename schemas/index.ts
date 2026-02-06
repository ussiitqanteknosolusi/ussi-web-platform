import * as z from "zod";

export const LoginSchema = z.object({
  email: z.string().email({
    message: "Email diperlukan",
  }),
  password: z.string().min(1, {
    message: "Password diperlukan",
  }),
});

export const InquirySchema = z.object({
  name: z.string().min(3, {
    message: "Nama minimal 3 karakter",
  }),
  email: z.string().email({
    message: "Email tidak valid",
  }),
  phone: z.string().min(10, {
    message: "Nomor telepon minimal 10 digit",
  }),
  company: z.optional(z.string()),
  message: z.string().min(10, {
    message: "Pesan minimal 10 karakter",
  }),
});

export const ProjectSchema = z.object({
  title: z.string().min(3, { message: "Judul minimal 3 karakter" }),
  slug: z.string().min(3, { message: "Slug minimal 3 karakter" }).optional(), // Optional on create, can be generated
  clientId: z.string().optional(), // Using string for form value, will parse to Int in action
  serviceId: z.string().optional(),
  description: z.string().min(10, { message: "Deskripsi minimal 10 karakter" }),
  projectDate: z.string().optional(), // Date string from input
  status: z.enum(["Ongoing", "Completed"]).default("Completed"),
  thumbnailUrl: z.string().optional(),
});

export const ServiceSchema = z.object({
  title: z.string().min(3, { message: "Judul service minimal 3 karakter" }),
  slug: z.string().min(3, { message: "Slug minimal 3 karakter" }).optional(),
  description: z.string().optional(),
  metaDescription: z.string().max(160, { message: "Meta description maksimal 160 karakter" }).optional(),
  heroImage: z.string().optional(),
  isActive: z.boolean().default(true),
});

export const ProductSchema = z.object({
  name: z.string().min(3, { message: "Nama produk minimal 3 karakter" }),
  slug: z.string().min(3, { message: "Slug minimal 3 karakter" }).optional(),
  serviceId: z.number({ required_error: "Service harus dipilih" }),
  description: z.string().optional(),
  features: z.array(z.string()).optional(),
  isActive: z.boolean().default(true),
});

export const PostSchema = z.object({
  title: z.string().min(3, { message: "Judul minimal 3 karakter" }),
  slug: z.string().optional(),
  content: z.string().min(10, { message: "Konten minimal 10 karakter" }),
  excerpt: z.string().optional(),
  metaDescription: z.string().max(160).optional(),
  coverImage: z.string().optional(),
  categoryId: z.string().optional(), // Will parse to Int in action
  status: z.enum(["draft", "published"]).default("draft"),
});

