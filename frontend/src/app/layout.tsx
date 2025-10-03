import type React from "react";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ReactQueryProvider from "@/lib/providers/react-query-provider";
import { Toaster } from "@/components/ui/sonner";
import { Navbar } from "@/components/ui/navbar";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "MedQR - Secure Medical Record Management",
    description: "Next-generation healthcare platform for secure medical record management with QR code access control",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="fr" className={`${geistSans.variable} ${geistMono.variable}`} suppressHydrationWarning>
            <body className="font-sans antialiased min-h-screen w-full bg-background text-foreground">
                {/* ENVELOPPEMENT DANS LE PROVIDER POUR CORRIGER L'ERREUR `No QueryClient set` */}
                <ReactQueryProvider>
                    {/* Wrapper pour le contenu principal */}
                    <div className="flex flex-col min-h-screen">
                        <Navbar />

                        {/* children: Le contenu de la page */}
                        <main className="flex-1">{children}</main>
                    </div>

                    {/* Ajout du Toaster pour les notifications (comme dans l'exemple Transmarket) */}
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
                </ReactQueryProvider>
            </body>
        </html>
    );
}
