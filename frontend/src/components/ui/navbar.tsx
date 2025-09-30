"use client";

import Link from "next/link";
import { Truck, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface NavItem {
  href: string;
  label: string;
  variant?: "ghost" | "default";
}

interface NavbarProps {
  variant?: "auth" | "marketing";
  navItems?: NavItem[];
  showLogo?: boolean;
  showAuthButtons?: boolean;
  className?: string;
}

export function Navbar({
  variant = "auth",
  navItems = [],
  showLogo = true,
  showAuthButtons = true,
  className = "",
}: NavbarProps) {
  const isMarketing = variant === "marketing";

  return (
    <div
      className={`fixed top-4 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-7xl z-50 glass rounded-xl shadow-lg ${className}`}
    >
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-2">
          {/* Logo */}
          {showLogo && (
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="w-10 h-10 bg-gradient-to-br from-brand to-primary rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105 group-hover:rotate-3">
                <Truck className="h-6 w-6 text-brand-foreground" />
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-bold bg-gradient-to-r from-brand to-primary bg-clip-text text-transparent group-hover:from-primary group-hover:to-brand transition-all duration-300">
                  Transmarket
                </span>
                <span className="text-xs text-muted-foreground -mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  Transport Intelligent
                </span>
              </div>
            </Link>
          )}

          {/* Navigation Items */}
          {isMarketing && navItems.length > 0 && (
            <nav className="hidden md:flex items-center space-x-6">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-muted-foreground hover:text-foreground transition-colors duration-200 font-medium px-3 py-1.5 rounded-lg hover:bg-accent/10"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          )}

          {/* Auth Buttons */}
          {showAuthButtons && (
            <div className="flex items-center space-x-3">
              <Link href="/login" passHref>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-foreground hover:bg-accent/10 font-medium px-3 py-1.5 rounded-lg"
                >
                  Connexion
                </Button>
              </Link>
              <Link href="/register" passHref>
                <Button
                  size="sm"
                  className="bg-gradient-to-r from-brand to-primary hover:shadow-lg hover:scale-105 transition-all duration-200 text-brand-foreground font-medium px-4 py-1.5 rounded-lg flex items-center gap-2"
                >
                  S&apos;inscrire
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
