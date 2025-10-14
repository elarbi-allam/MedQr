"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Activity } from "lucide-react";

interface AuthNavbarProps {
    className?: string;
}

export default function AuthNavbar({ className }: AuthNavbarProps) {
    return (
        <nav className={cn("fixed top-2 left-0 right-0 z-50 px-6", className)}>
            <div className="container mx-auto max-w-7xl">
                <div className="glass-effect border border-border/50 rounded-2xl px-6 py-3 shadow-lg">
                    <div className="flex items-center justify-between">
                        {/* Logo */}
                        <Link href="/" className="flex items-center gap-2 group">
                            <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center group-hover:scale-105 transition-transform">
                                <Activity className="w-5 h-5 text-primary-foreground" />
                            </div>
                            <span className="text-xl font-bold">MedQR</span>
                        </Link>

                        {/* Right Actions */}
                        <div className="flex items-center gap-3">
                            
                            {/* Separator */}
                            <div className="h-6 w-px bg-border/50" />
                            
                            <Link href="/login">
                                <Button variant="ghost" size="sm" className="h-9 hidden sm:inline-flex">
                                    Connexion
                                </Button>
                            </Link>
                            <Link href="/register">
                                <Button
                                    size="sm"
                                    className="h-10 px-6 rounded-full bg-foreground text-background hover:bg-foreground/90"
                                >
                                    S&apos;inscrire
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
}