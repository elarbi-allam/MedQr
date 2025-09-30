"use client";

import { useEffect, useState } from "react";

interface BackgroundEffectsProps {
  className?: string;
  intensity?: "low" | "medium" | "high";
}

export function BackgroundEffects({
  className = "",
  intensity = "medium",
}: BackgroundEffectsProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const intensityClasses = {
    low: "opacity-30",
    medium: "opacity-50",
    high: "opacity-70",
  };

  return (
    <div
      className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}
    >
      {/* Gradient de base */}
      <div
        className={`absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,theme(colors.brand/0.15),transparent_70%)] ${intensityClasses[intensity]}`}
      ></div>

      {/* Formes flottantes animées */}
      <div
        className={`absolute top-1/4 left-1/4 w-72 h-72 bg-brand/10 rounded-full blur-3xl animate-pulse ${intensityClasses[intensity]}`}
      ></div>
      <div
        className={`absolute bottom-1/4 right-1/4 w-80 h-80 bg-primary/10 rounded-full blur-3xl animate-pulse ${intensityClasses[intensity]}`}
        style={{ animationDelay: "2s" }}
      ></div>
      <div
        className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-accent/8 rounded-full blur-3xl animate-pulse ${intensityClasses[intensity]}`}
        style={{ animationDelay: "4s" }}
      ></div>

      {/* Particules flottantes */}
      <div
        className={`absolute top-1/3 left-1/3 w-2 h-2 bg-brand/30 rounded-full animate-float ${intensityClasses[intensity]}`}
      ></div>
      <div
        className={`absolute top-2/3 right-1/3 w-1 h-1 bg-primary/40 rounded-full animate-float ${intensityClasses[intensity]}`}
        style={{ animationDelay: "1s" }}
      ></div>
      <div
        className={`absolute bottom-1/3 left-2/3 w-1.5 h-1.5 bg-accent/35 rounded-full animate-float ${intensityClasses[intensity]}`}
        style={{ animationDelay: "2s" }}
      ></div>
    </div>
  );
}
