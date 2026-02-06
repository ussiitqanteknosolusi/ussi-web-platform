export const PricelistSchema = z.object({
  tier: z.enum(["Basic", "Professional", "Custom"], { required_error: "Tier harus dipilih" }),
  title: z.string().min(3, { message: "Judul minimal 3 karakter" }),
  price: z.number().optional(),
  features: z.array(z.string()).optional(),
  whatsappUrl: z.string().url({ message: "WhatsApp URL harus valid" }).optional().or(z.literal("")),
});
