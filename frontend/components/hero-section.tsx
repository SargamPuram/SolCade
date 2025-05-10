"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import { Gradient } from "@/components/ui/gradient";
export default function HeroSection() {
  const [key, setKey] = useState(0);
  const [isMounted, setIsMounted] = useState(false);

  // Set mounted state on client side
  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined" || !isMounted) return;
    const canvas = document.getElementById("gradient-canvas");
    if (canvas) {
      // Set CSS variables
      canvas.style.setProperty("--gradient-color-1", "#043D5D");
      canvas.style.setProperty("--gradient-color-2", "#032E46");
      canvas.style.setProperty("--gradient-color-3", "#6cb79b");
      canvas.style.setProperty("--gradient-color-4", "#0F595E");

      const gradient = new Gradient();
      gradient.initGradient("#gradient-canvas");

      return () => {
        // Remove the canvas element
        canvas.remove();
      };
    }
  }, [isMounted]);

  return (
    <section className="relative w-full h-[80vh] overflow-hidden rounded-3xl flex justify-center items-center">
      {/* Animated particle background */}
      <canvas
        className="absolute inset-0 bg-black/40 z-0 pointer-events-none w-full h-full rounded-3xl"
        key={key}
        id="gradient-canvas"
        data-transition-in
      >
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-900/20 via-green-900/20 to-pink-900/20" />
      </canvas>
      {/* Content */}
      <div className="relative z-10 text-center max-w-4xl mx-auto px-4">
        <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-green-400 ">
          Your Gateway to the Solana Gaming
        </h1>
        <p className="text-xl md:text-2xl mb-10 text-gray-300">
          Aggregate all your favorite games, wallets, and tools in one vibrant
          dashboard.
        </p>
        <Button className="text-lg px-8 py-6 h-auto rounded-full bg-green-500 hover:bg-green-400 shadow-[0_0_15px_rgba(0,255,136,0.5)] hover:shadow-[0_0_25px_rgba(0,255,136,0.7)] transition-all duration-300 border-0">
          <Sparkles className="mr-2 h-5 w-5" />
          Connect Wallet
        </Button>
      </div>
    </section>
  );
}
