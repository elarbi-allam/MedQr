"use client";

import { useEffect } from "react";
import { useSidebar } from "@/components/ui/sidebar";

export function useSidebarState() {
  const { open } = useSidebar();

  useEffect(() => {
    const saveSidebarState = async () => {
      try {
        document.cookie = `sidebar_state=${open}; path=/; max-age=${60 * 60 * 24 * 365}`; // 1 an
      } catch (error) {
        console.error(
          "Erreur lors de la sauvegarde de l'état de la sidebar:",
          error
        );
      }
    };

    // Debounce pour éviter trop d'appels
    const timeoutId = setTimeout(saveSidebarState, 300);
    return () => clearTimeout(timeoutId);
  }, [open]);

  return { open };
}
