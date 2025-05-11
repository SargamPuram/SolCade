"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Menu,
  X,
  ChevronDown,
  Wallet,
  LogOut,
  Settings,
  User,
} from "lucide-react";
// @ts-ignore
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
// @ts-ignore
import { useWallet } from "@solana/wallet-adapter-react";

const navigationItems = [
  { name: "Dashboard", href: "#", active: true },
  { name: "Games", href: "/games", active: false },
  { name: "Marketplace", href: "#", active: false },
  { name: "Leaderboard", href: "#", active: false },
  { name: "Rewards", href: "#", active: false },
];

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { connected, publicKey, disconnect } = useWallet();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-[90vw] mx-auto mt-2">
      {/* Glassmorphism background */}
      <div className="absolute inset-0 bg-gray-950/60 backdrop-blur-md border border-gray-800 rounded-2xl"></div>

      <div className="container mx-auto px-4">
        <div className="relative flex h-16 items-center justify-between">
          {/* Logo area */}
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <div className="h-10 w-10 rounded-md bg-gradient-to-r from-cyan-500 to-green-500 flex items-center justify-center text-white font-bold text-xl">
                S
              </div>
              <span className="ml-2 text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-green-400">
                SolCade
              </span>
            </div>
          </div>

          {/* Navigation tabs - desktop */}
          <nav className="hidden md:flex space-x-1">
            {navigationItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  item.active
                    ? "bg-gray-800 text-white"
                    : "text-gray-300 hover:bg-gray-800/50 hover:text-white"
                }`}
              >
                {item.name}
              </a>
            ))}
          </nav>

          {/* Right side - Connect wallet / Account */}
          <div className="flex items-center">
            {connected ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="flex items-center gap-2 text-sm"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src="/placeholder.svg?height=32&width=32"
                        alt="User"
                      />
                      <AvatarFallback className="bg-gray-800 text-cyan-400">
                        {publicKey?.toString().slice(0, 2).toUpperCase() ||
                          "SU"}
                      </AvatarFallback>
                    </Avatar>
                    <span className="hidden sm:inline-block font-mono">
                      {publicKey?.toString().slice(0, 4)}...
                      {publicKey?.toString().slice(-4)}
                    </span>
                    <ChevronDown className="h-4 w-4 text-gray-400" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-56 bg-gray-900 border-gray-800"
                >
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-gray-800" />
                  <DropdownMenuItem className="flex items-center gap-2 cursor-pointer">
                    <User className="h-4 w-4" /> Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem className="flex items-center gap-2 cursor-pointer">
                    <Wallet className="h-4 w-4" /> Wallet
                  </DropdownMenuItem>
                  <DropdownMenuItem className="flex items-center gap-2 cursor-pointer">
                    <Settings className="h-4 w-4" /> Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-gray-800" />
                  <DropdownMenuItem
                    onClick={async () => {
                      try {
                        await disconnect();
                      } catch (error) {
                        console.error("Failed to disconnect wallet:", error);
                      }
                    }}
                    className="flex items-center gap-2 text-red-400 cursor-pointer"
                  >
                    <LogOut className="h-4 w-4" /> Disconnect
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <WalletMultiButton className="!bg-gray-800 hover:!bg-gray-700" />
            )}

            {/* Mobile menu button */}
            <div className="flex md:hidden ml-4">
              <button
                type="button"
                className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-800 hover:text-white focus:outline-none"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                <span className="sr-only">Open main menu</span>
                {mobileMenuOpen ? (
                  <X className="block h-6 w-6" aria-hidden="true" />
                ) : (
                  <Menu className="block h-6 w-6" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden relative">
          <div className="absolute inset-0 bg-gray-950/90 backdrop-blur-md"></div>
          <div className="relative space-y-1 px-4 pb-3 pt-2">
            {navigationItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className={`block rounded-md px-3 py-2 text-base font-medium ${
                  item.active
                    ? "bg-gray-800 text-white"
                    : "text-gray-300 hover:bg-gray-800 hover:text-white"
                }`}
              >
                {item.name}
              </a>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
