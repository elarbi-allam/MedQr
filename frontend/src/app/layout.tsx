import type React from "react";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ReactQueryProvider from "@/lib/providers/react-query-provider";
import { Toaster } from "@/components/ui/sonner";
import { NuqsAdapter } from "nuqs/adapters/next/app";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Transmarket - Plateforme de Transport Intelligente",
  description:
    "La première bourse de fret intelligente du Maroc. Connectez expéditeurs et transporteurs avec notre système de bidding réversible unique.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased font-sans min-h-screen w-full bg-background text-foreground`}
      >
        {/* Background effects subtils améliorés */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,theme(colors.brand/0.08),transparent_70%)]"></div>
          <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(45deg,transparent_30%,theme(colors.brand/0.02)_50%,transparent_70%)]"></div>
        </div>

        {/* Content wrapper - prend tout l'espace disponible */}
        <div className="relative z-10 min-h-screen w-full flex flex-col">
          <ReactQueryProvider>
            <NuqsAdapter>
              <div className="flex-1 w-full min-h-full">{children}</div>
              <Toaster
                richColors
                position="top-center"
                closeButton
                toastOptions={{
                  style: {
                    background: "hsl(var(--background) / 0.9)",
                    backdropFilter: "blur(10px)",
                    border: "1px solid hsl(var(--border) / 0.1)",
                    color: "hsl(var(--foreground))",
                  },
                }}
              />
            </NuqsAdapter>
          </ReactQueryProvider>
        </div>
      </body>
    </html>
  );
}
