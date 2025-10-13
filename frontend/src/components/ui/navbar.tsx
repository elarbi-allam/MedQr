"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Activity } from "lucide-react";

export function Navbar() {
    const pathname = usePathname();

    const isHome = pathname === "/";

    if (!isHome) {
        return null;
    }

    return (
        <nav className="fixed top-2 left-0 right-0 z-50 px-6">
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

                        {/* Center Navigation */}
                        <div className="hidden md:flex items-center gap-1">
                            <Link href="/">
                                <Button variant="ghost" size="sm" className="h-9">
                                    Home
                                </Button>
                            </Link>
                            <Link href="/#features">
                                <Button variant="ghost" size="sm" className="h-9">
                                    Features
                                </Button>
                            </Link>
                            <Link href="/#about">
                                <Button variant="ghost" size="sm" className="h-9">
                                    About
                                </Button>
                            </Link>
                        </div>

                        {/* Right Actions */}
                        <div className="flex items-center gap-3">
                            <Link href="/login">
                                <Button variant="ghost" size="sm" className="h-9 hidden sm:inline-flex">
                                    Sign In
                                </Button>
                            </Link>
                            <Link href="/register">
                                <Button
                                    size="sm"
                                    className="h-10 px-6 rounded-full bg-foreground text-background hover:bg-foreground/90"
                                >
                                    Get Started
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
}
