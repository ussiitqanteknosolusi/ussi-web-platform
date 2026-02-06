"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  const marqueeText = "PAGE NOT FOUND — ERROR 404 — ";
  
  return (
    <div className="relative min-h-screen bg-white text-neutral-950 flex flex-col items-center justify-center overflow-hidden font-sans selection:bg-neutral-950 selection:text-white pt-28">
      
      {/* Background Marquee */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-full opacity-5 pointer-events-none select-none overflow-hidden">
        <div className="flex whitespace-nowrap animate-marquee">
          {Array(8).fill(marqueeText).map((text, i) => (
            <span key={i} className="text-[20vw] font-black leading-none px-4 text-neutral-200">
              {text}
            </span>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4 flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <h1 className="text-[8rem] md:text-[12rem] font-black leading-none tracking-tighter text-neutral-950">
            404
          </h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="space-y-8"
        >
          <h2 className="text-2xl md:text-4xl font-light tracking-wide uppercase">
            Halaman Tidak Ditemukan
          </h2>
          <p className="max-w-md mx-auto text-neutral-600 text-lg">
            Maaf, halaman yang Anda cari tidak ada atau telah dipindahkan.
          </p>
          
          <div className="flex justify-center gap-4 pt-4">
             <Button 
                asChild 
                size="lg" 
                className="rounded-full bg-neutral-950 text-white hover:bg-neutral-800 px-8 h-12 text-base font-semibold transition-transform hover:scale-105"
             >
                <Link href="/">
                    Kembali ke Beranda
                </Link>
             </Button>
             
             <Button 
                asChild 
                variant="outline"
                size="lg" 
                className="rounded-full border-neutral-300 text-neutral-600 hover:bg-neutral-100 px-8 h-12 text-base transition-transform hover:scale-105"
             >
                <Link href="/contact">
                    Hubungi Kami
                </Link>
             </Button>
          </div>
        </motion.div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute bottom-12 left-12 hidden md:block">
        <p className="text-neutral-400 font-mono text-sm">
           © {new Date().getFullYear()} USSI ITS
        </p>
      </div>
      
      <div className="absolute top-32 right-12 hidden md:block">
         <p className="text-neutral-400 font-mono text-sm">
            ERROR_CODE: 404_NOT_FOUND
         </p>
      </div>

    </div>
  );
}
