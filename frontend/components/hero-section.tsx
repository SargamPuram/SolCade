"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Sparkles } from "lucide-react"

export default function HeroSection() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  return (
    <section className="relative py-20 overflow-hidden rounded-3xl mb-12">
      {/* Animated particle background */}
      <div className="absolute inset-0 bg-black/40 z-0">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-900/20 via-green-900/20 to-pink-900/20" />
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-gradient-to-r from-cyan-500 to-green-500 opacity-20 blur-xl"
            style={{
              width: Math.random() * 300 + 50,
              height: Math.random() * 300 + 50,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              transform: `translate(-50%, -50%) translate(${(mousePosition.x - window.innerWidth / 2) / 20}px, ${(mousePosition.y - window.innerHeight / 2) / 20}px)`,
              transition: "transform 0.2s ease-out",
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 text-center max-w-4xl mx-auto px-4">
        <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-green-400 to-pink-400">
          Your Gateway to the Solana Metaverse
        </h1>
        <p className="text-xl md:text-2xl mb-10 text-gray-300">
          Aggregate all your favorite games, wallets, and tools in one vibrant dashboard.
        </p>
        <Button className="text-lg px-8 py-6 h-auto rounded-full bg-green-500 hover:bg-green-400 shadow-[0_0_15px_rgba(0,255,136,0.5)] hover:shadow-[0_0_25px_rgba(0,255,136,0.7)] transition-all duration-300 border-0">
          <Sparkles className="mr-2 h-5 w-5" />
          Connect Wallet
        </Button>
      </div>
    </section>
  )
}
