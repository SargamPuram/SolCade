import type React from "react";
import "@/app/globals.css";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { SolanaProvider } from "@/contexts/SolanaProvider";
import Header from "@/components/Header";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Arcade On Solana",
  description: "Your Gateway to the Solana Gaming",
  icons: {
    icon: "/5817797.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} antialiased max-w-screen  `}>
        <SolanaProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem={false}
          >
            <Header />

            {children}
            <Toaster />
          </ThemeProvider>
        </SolanaProvider>
      </body>
    </html>
  );
}
