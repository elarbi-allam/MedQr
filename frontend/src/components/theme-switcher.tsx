"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function ThemeSwitcher() {
    const [mounted, setMounted] = useState(false);
    const { theme, setTheme } = useTheme();

    // Avoid hydration mismatch
    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
        <Button
            variant="ghost"
            className="relative size-10 justify-center gap-2 transition-all rounded-lg duration-300 hover:bg-brand/10 hover:text-brand"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        >
            <Moon
                className={cn(
                    "size-full rotate-0 scale-100 transition-all dark:rotate-90 dark:scale-0",
                    theme === "dark" || theme === "system" ? "hidden" : "block"
                )}
            />
            <Sun
                className={cn(
                    "size-full rotate-90 scale-0 transition-all dark:-rotate-0 dark:scale-100",
                    theme === "light" ? "hidden" : "block"
                )}
            />
        </Button>
    );
}
