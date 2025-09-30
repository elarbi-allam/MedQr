"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ArrowRight, User, LogOut, ChevronDown, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useSidebar } from "@/components/ui/sidebar";
import {
  useCurrentUser,
  useLogout,
} from "@/features/profile/hooks/use-profile";

interface NavItem {
  href: string;
  label: string;
  variant?: "ghost" | "default";
}

interface AppNavbarProps {
  variant?: "auth" | "marketing" | "dashboard";
  navItems?: NavItem[];
  showAuthButtons?: boolean;
  showUserMenu?: boolean;
  className?: string;
}

function DashboardSidebarTrigger() {
  const { toggleSidebar } = useSidebar();

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleSidebar}
      className="lg:hidden p-2"
    >
      <Menu className="h-4 w-4" />
      <span className="sr-only">Toggle Sidebar</span>
    </Button>
  );
}

function UserMenu() {
  const router = useRouter();
  const { data: user, isLoading } = useCurrentUser();
  const logoutMutation = useLogout();

  const handleProfileClick = () => {
    router.push("/profile");
  };

  const handleLogout = async () => {
    try {
      await logoutMutation.mutateAsync();
      window.location.href = "/login";
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center gap-3 px-3 py-2">
        <div className="h-8 w-8 rounded-lg bg-muted animate-pulse" />
        <div className="hidden md:grid gap-1">
          <div className="h-4 w-24 bg-muted animate-pulse rounded" />
          <div className="h-3 w-32 bg-muted animate-pulse rounded" />
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex items-center gap-3 px-3 py-2 h-auto hover:bg-accent/10 transition-colors"
        >
          <Avatar className="h-8 w-8 rounded-lg">
            <AvatarImage
              src={`${process.env.NEXT_PUBLIC_API_URL}/${user.profile}`}
              alt={user.firstName + " " + user.lastName}
            />
            <AvatarFallback className="rounded-lg bg-gradient-to-br from-brand to-primary text-brand-foreground">
              {getInitials(`${user.firstName} ${user.lastName}`)}
            </AvatarFallback>
          </Avatar>
          <div className="hidden md:grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-semibold text-foreground">
              {user.firstName} {user.lastName}
            </span>
            <span className="truncate text-xs text-muted-foreground">
              {user.email}
            </span>
          </div>
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-64 rounded-lg glass border border-border/50"
        side="bottom"
        align="end"
        sideOffset={8}
      >
        <DropdownMenuLabel className="p-0 font-normal">
          <div className="flex items-center gap-3 px-3 py-3 text-left text-sm">
            <Avatar className="h-10 w-10 rounded-lg">
              <AvatarImage
                src={`${process.env.NEXT_PUBLIC_API_URL}/${user.profile}`}
                alt={user.firstName + " " + user.lastName}
              />
              <AvatarFallback className="rounded-lg bg-gradient-to-br from-brand to-primary text-brand-foreground">
                {getInitials(`${user.firstName} ${user.lastName}`)}
              </AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-semibold text-foreground">
                {user.firstName} {user.lastName}
              </span>
              <span className="truncate text-xs text-muted-foreground">
                {user.email}
              </span>
              {user.enterprise?.name && (
                <span className="truncate text-xs text-brand font-medium">
                  {user.enterprise.name}
                </span>
              )}
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="cursor-pointer"
          onClick={handleProfileClick}
        >
          <User className="mr-2 h-4 w-4" />
          Mon Profil
        </DropdownMenuItem>
        <DropdownMenuItem
          className="text-destructive cursor-pointer"
          onClick={handleLogout}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Se déconnecter
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function AppNavbar({
  variant = "auth",
  navItems = [],
  showAuthButtons = true,
  showUserMenu = false,
  className = "",
}: AppNavbarProps) {
  const pathname = usePathname();
  const isDashboard = variant === "dashboard";

  return (
    <div
      className={`${isDashboard ? "w-full" : "fixed top-4 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-7xl"} z-50 glass rounded-xl border border-border/50 ${className}`}
    >
      <div
        className={`${isDashboard ? "px-4 sm:px-6 lg:px-8" : "mx-auto px-4 sm:px-6 lg:px-8"}`}
      >
        <div className="flex flex-row-reverse justify-between items-center py-2">
          {/* User Menu for dashboard */}
          {showUserMenu && <UserMenu />}

          {/* Sidebar Trigger for Dashboard - seulement si on est dans le dashboard */}
          {isDashboard && (
            <div className="flex items-center gap-2 lg:hidden">
              <DashboardSidebarTrigger />
            </div>
          )}

          {/* Navigation Items */}
          {navItems.length > 0 && (
            <nav className="hidden md:flex items-center space-x-6">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`text-muted-foreground hover:text-foreground transition-colors duration-200 font-medium px-3 py-1.5 rounded-lg hover:bg-accent/10 ${
                    pathname === item.href ? "text-brand bg-brand/10" : ""
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          )}

          {/* auth Content */}
          {showAuthButtons && !showUserMenu && (
            <div className="flex items-center space-x-3">
              <Link href="/login">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-foreground hover:bg-accent/10 font-medium px-3 py-1.5 rounded-lg"
                >
                  Connexion
                </Button>
              </Link>
              <Link href="/register">
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
