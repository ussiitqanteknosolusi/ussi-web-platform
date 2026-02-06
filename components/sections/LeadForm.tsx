"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { InquirySchema } from "@/schemas";
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
import { useState } from "react";
import { submitInquiry } from "@/actions/submit-inquiry";
import { Loader2 } from "lucide-react";

export default function LeadForm() {
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
      }
    } catch (err) {
      setError("Terjadi kesalahan, silakan coba lagi.");
    }
  };

  return (
    <section id="contact" className="py-24 bg-primary text-primary-foreground relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 p-12 opacity-10">
         <svg width="400" height="400" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            <path fill="#FFFFFF" d="M44.7,-76.4C58.9,-69.2,71.8,-59.1,81.6,-46.6C91.4,-34.1,98.1,-19.2,95.8,-4.9C93.5,9.4,82.2,23.1,70.8,34.5C59.4,45.9,47.9,55,35.6,61.7C23.3,68.4,10.2,72.7,-3.5,78.7C-17.2,84.7,-31.5,92.4,-43.3,87.6C-55.1,82.8,-64.4,65.5,-71.8,49.8C-79.2,34.1,-84.7,20,-84.9,5.7C-85.1,-8.6,-80,-23.1,-70.8,-35.1C-61.6,-47.1,-48.3,-56.6,-35.2,-64.3C-22.1,-72,-9.2,-78,3.9,-84.7C17,-91.5,41,-99,44.7,-76.4Z" transform="translate(100 100)" />
        </svg>
      </div>

      <div className="container px-4 md:px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-6">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Siap Mentransformasi Institusi Keuangan Anda?
            </h2>
            <p className="text-primary-foreground/80 text-lg max-w-lg">
              Diskusikan kebutuhan teknologi perbankan Anda dengan tim ahli kami.
              Kami siap membantu BPR dan LKM Anda tumbuh lebih cepat.
            </p>
            <div className="space-y-4 pt-4">
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-full bg-accent/20 flex items-center justify-center text-accent font-bold">1</div>
                <div>Konsultasi Kebutuhan Teknis</div>
              </div>
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-full bg-accent/20 flex items-center justify-center text-accent font-bold">2</div>
                <div>Demo Produk Core Banking (IBS)</div>
              </div>
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-full bg-accent/20 flex items-center justify-center text-accent font-bold">3</div>
                <div>Penawaran & Implementasi</div>
              </div>
            </div>
          </div>

          <div className="bg-background text-foreground rounded-2xl p-8 shadow-2xl">
            {success ? (
              <div 
                className="text-center py-12 space-y-4 animate-in fade-in zoom-in-95"
              >
                <div className="h-16 w-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-check"><path d="M20 6 9 17l-5-5"/></svg>
                </div>
                <h3 className="text-2xl font-bold">Pesan Terkirim!</h3>
                <p className="text-muted-foreground">Tim kami akan segera menghubungi Anda melalui email atau telepon.</p>
                <Button onClick={() => setSuccess(false)} variant="outline">Kirim Pesan Lain</Button>
              </div>
            ) : (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nama Lengkap</FormLabel>
                        <FormControl>
                          <Input placeholder="Budi Santoso" {...field} />
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
                            <Input placeholder="budi@bpr-sejahtera.co.id" {...field} />
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
                        <FormLabel>Nama Institusi / Perusahaan</FormLabel>
                        <FormControl>
                          <Input placeholder="PT BPR Sejahtera Abadi" {...field} />
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
                            placeholder="Saya ingin demo IBS Core System..." 
                            className="min-h-[100px]"
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

                  <Button type="submit" className="w-full bg-accent hover:bg-accent/90 text-white font-bold h-12" disabled={form.formState.isSubmitting}>
                    {form.formState.isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Mengirim...
                        </>
                    ) : (
                        "Jadwalkan Demo Gratis"
                    )}
                  </Button>
                </form>
              </Form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
