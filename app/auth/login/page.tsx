"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import Link from "next/link";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Card } from "@/components/ui/card";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { login } from "@/actions/login";

import { LoginSchema } from "@/schemas";

export default function LoginPage() {
  const [error, setError] = useState<string | undefined>("");
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    mode: "onSubmit",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmitWrapper = (e: React.FormEvent) => {
    e.preventDefault();
    form.handleSubmit(onSubmit)(e);
  };

  async function onSubmit(values: z.infer<typeof LoginSchema>) {
    setError("");
    
    setIsLoading(true);
    
    try {
        const data = await login(values);
        if (data?.error) {
            form.reset();
            setError(data.error);
        }
    } catch {
        setError("Something went wrong!");
    } finally {
        setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#f7fafc] px-4">
      
      <div className="w-full max-w-[440px] space-y-8">
        {/* Logo Section */}
        <div className="flex justify-center">
            <Link href="/">
             <Image 
                src="/logo.png" 
                alt="USSI Logo" 
                width={150} 
                height={50} 
                className="h-10 w-auto object-contain"
                priority
             />
            </Link>
        </div>

        <Card className="border-0 shadow-xl ring-1 ring-black/5 overflow-hidden rounded-xl">
            <div className="p-8 pb-4">
                <h2 className="text-2xl font-bold tracking-tight text-slate-900 mb-1">
                    Masuk ke akun Anda
                </h2>
                <p className="text-sm text-muted-foreground mb-8">
                    Kelola layanan perbankan Anda di satu tempat.
                </p>

                <Form {...form}>
                    <form onSubmit={onSubmitWrapper} className="space-y-5">
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-slate-700 font-medium">Email</FormLabel>
                            <FormControl>
                            <Input 
                                placeholder="nama@perusahaan.com" 
                                {...field} 
                                className="border-slate-300 focus-visible:ring-indigo-500 focus-visible:border-indigo-500 h-10 bg-white"
                            />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                        <FormItem>
                            <div className="flex items-center justify-between">
                                <FormLabel className="text-slate-700 font-medium">Password</FormLabel>
                                <Button variant="link" size="sm" className="px-0 font-normal h-auto text-indigo-600 hover:text-indigo-500" asChild>
                                    <Link href="/auth/forgot-password">Lupa password?</Link>
                                </Button>
                            </div>
                            <FormControl>
                            <Input 
                                type="password" 
                                placeholder="••••••••" 
                                {...field} 
                                className="border-slate-300 focus-visible:ring-indigo-500 focus-visible:border-indigo-500 h-10 bg-white"
                            />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                    <div className="space-y-4">
                        {error && (
                            <div className="bg-destructive/15 p-3 rounded-md flex items-center gap-x-2 text-sm text-destructive">
                                <p>{error}</p>
                            </div>
                        )}
                        <Button 
                            type="submit" 
                            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold h-10 shadow-sm" 
                            disabled={isLoading}
                        >
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {isLoading ? "Memproses..." : "Masuk"}
                        </Button>
                    </div>
                    </form>
                </Form>
            </div>
        </Card>
      </div>
    </div>
  );
}
