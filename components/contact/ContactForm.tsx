"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { InquirySchema } from "@/schemas";
import { submitInquiry } from "@/actions/submit-inquiry";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Loader2 } from "lucide-react";

export function ContactForm() {
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof InquirySchema>>({
    resolver: zodResolver(InquirySchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      company: "",
      message: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof InquirySchema>) => {
    setError(null);
    try {
      const result = await submitInquiry(values);
      if (result.error) setError(result.error);
      else {
        setSuccess(true);
        form.reset();
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    } catch {
      setError("Terjadi kesalahan, silakan coba lagi.");
    }
  };

  if (success) {
    return (
      <div className="text-center py-12 space-y-4 animate-in fade-in zoom-in-95 bg-green-50/50 rounded-xl border border-green-100 dark:bg-green-900/20 dark:border-green-900">
        <div className="h-16 w-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
        </div>
        <h3 className="text-2xl font-bold text-green-800 dark:text-green-300">Pesan Terkirim!</h3>
        <p className="text-muted-foreground max-w-xs mx-auto">
          Terima kasih telah menghubungi kami. Tim support akan segera merespons inquiry Anda.
        </p>
        <Button onClick={() => setSuccess(false)} variant="outline" className="mt-4">
          Kirim Pesan Lain
        </Button>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nama Lengkap</FormLabel>
              <FormControl>
                <Input placeholder="Nama Anda" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email Kantor</FormLabel>
                <FormControl>
                  <Input placeholder="email@perusahaan.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>No. WhatsApp</FormLabel>
                <FormControl>
                  <Input placeholder="0812..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="company"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Institusi / Perusahaan</FormLabel>
              <FormControl>
                <Input placeholder="Nama Instansi" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Pesan / Kebutuhan</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Ceritakan kebutuhan sistem Anda..." 
                  className="min-h-[120px]"
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {error && (
          <div className="p-3 rounded-md bg-destructive/10 text-destructive text-sm font-medium">
            {error}
          </div>
        )}

        <Button type="submit" className="w-full h-12 text-lg font-semibold" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Mengirim...
            </>
          ) : (
            "Kirim Pesan"
          )}
        </Button>
      </form>
    </Form>
  );
}
