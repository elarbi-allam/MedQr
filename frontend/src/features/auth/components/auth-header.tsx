"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface AuthNavbarProps {
    className?: string;
}

export default function AuthNavbar({ className }: AuthNavbarProps) {
    return (
        <nav
            className={cn(
                "flex items-center justify-between px-6 h-16 bg-background/80 backdrop-blur-sm border-b border-border/50",
                className,
            )}
        >
            {/* Logo et nom de l'application */}
            <Link href="/" className="flex items-center gap-3 group">
                <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                    <span className="text-lg font-bold text-primary">M</span>
                </div>
                <div className="flex flex-col">
                    <span className="text-lg font-bold text-foreground">MediCare</span>
                    <span className="text-xs text-muted-foreground">Santé & Bien-être</span>
                </div>
            </Link>

            {/* Boutons d'authentification */}
            <div className="flex items-center gap-3">
                <Link href="/login">
                    <Button
                        variant="ghost"
                        size="sm"
                        className="h-9 px-4 rounded-full hover:bg-muted/50 transition-colors"
                    >
                        Connexion
                    </Button>
                </Link>
                <Link href="/register">
                    <Button
                        size="sm"
                        className="h-9 px-4 rounded-full bg-primary hover:bg-primary/90 transition-colors"
                    >
                        S&apos;inscrire
                    </Button>
                </Link>
            </div>
        </nav>
    );
}