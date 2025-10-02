"use client"

import type { ReactNode } from "react"
import { Sidebar } from "@/components/sidebar"

interface DashboardLayoutProps {
  children: ReactNode
  userType: "patient" | "provider" | "facility"
}

export function DashboardLayout({ children, userType }: DashboardLayoutProps) {
  return (
    <div className="flex min-h-screen bg-gradient-to-br from-background via-muted/10 to-background">
      <Sidebar userType={userType} />
      <main className="flex-1 ml-64 transition-all duration-300">{children}</main>
    </div>
  )
}
