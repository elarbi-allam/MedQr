"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Truck, Files, Building2, Home, ChevronLeft, ChevronRight, Users, Globe, Package } from "lucide-react";

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
} from "@/components/ui/sidebar";

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useCurrentUser } from "@/features/profile/hooks/use-profile";
import { useSidebarState } from "@/hooks/use-sidebar-state";
import { UserRole } from "@/lib/types/user.type";

export function getDashboardUrlByRole(role: UserRole | undefined): string {
    switch (role) {
        case UserRole.ADMIN:
            return "/admin";
        case UserRole.ENTERPRISE_USER:
            return "/enterprise-user";
        case UserRole.USER:
            return "/user";
        default:
            return "/";
    }
}

const getRoleSpecificItems = (enterpriseType?: string) => {
    return {
        [UserRole.ADMIN]: [
            {
                title: "Gestion Utilisateurs",
                icon: Users,
                items: [
                    { title: "Tous les Utilisateurs", url: "/admin/users" },
                    { title: "Entreprises", url: "/admin/enterprises" },
                    { title: "Vérifications", url: "/admin/verifications" },
                ],
            },
            {
                title: "Gestion des camions",
                icon: Truck,
                items: [
                    { title: "Types de camions", url: "/admin/truck-types" },
                    { title: "Camions", url: "/admin/trucks" },
                ],
            },
            {
                title: "Gestion Géographique",
                icon: Globe,
                items: [
                    { title: "Pays", url: "/admin/countries" },
                    { title: "Villes", url: "/admin/cities" },
                ],
            },
            {
                title: "Documents",
                icon: Files,
                items: [
                    { title: "Documents", url: "/admin/documents" },
                    {
                        title: "Modèles de documents",
                        url: "/admin/document-templates",
                    },
                ],
            },
            {
                title: "shipment-offers",
                icon: Package,
                url: "/admin/shipment-offers",
            },
        ],
        [UserRole.ENTERPRISE_USER]: [
            {
                title: "Mon entreprise",
                url: "/enterprise-user/my-enterprise",
                icon: Building2,
            },
            {
                title: "Mes documents",
                url: "/enterprise-user/documents",
                icon: Files,
            },
            ...(enterpriseType === "CARRIER"
                ? [
                      {
                          title: "Gestion des Véhicules",
                          icon: Truck,
                          url: "/enterprise-user/trucks",
                      },
                      {
                          title: "Documents des Véhicules",
                          icon: Files,
                          url: "/enterprise-user/truck-documents",
                      },
                  ]
                : []),
            ...(enterpriseType === "SHIPPER"
                ? [
                      {
                          title: "shipment-offers",
                          icon: Package,
                          url: "/shipment-offers",
                      },
                  ]
                : []),
        ],
        [UserRole.USER]: [],
    };
};

function SidebarToggleButton() {
    const { open, toggleSidebar } = useSidebar();

    return (
        <Button
            variant="ghost"
            size="sm"
            onClick={toggleSidebar}
            className="absolute -right-3 top-6 z-20 h-6 w-6 rounded-full border bg-background shadow-md hover:bg-accent hover:text-accent-foreground"
        >
            {open ? <ChevronLeft className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
            <span className="sr-only">{open ? "Fermer la sidebar" : "Ouvrir la sidebar"}</span>
        </Button>
    );
}

function UserWelcome() {
    const { data: user, isLoading } = useCurrentUser();

    if (isLoading) {
        return (
            <div className="px-4 py-3 text-center animate-pulse group-data-[collapsible=icon]:px-2">
                <div className="h-4 bg-muted rounded mb-2 group-data-[collapsible=icon]:w-8 group-data-[collapsible=icon]:h-8 group-data-[collapsible=icon]:rounded-full group-data-[collapsible=icon]:mx-auto group-data-[collapsible=icon]:mb-0" />
                <div className="h-3 bg-muted rounded w-2/3 mx-auto group-data-[collapsible=icon]:hidden" />
            </div>
        );
    }

    if (!user) return null;

    const getInitials = (firstName?: string, lastName?: string) => {
        if (!firstName) return "U";
        const initials = firstName.charAt(0) + (lastName ? lastName.charAt(0) : "");
        return initials.toUpperCase();
    };

    return (
        <div className="px-4 py-3 text-center border-b border-border/50 group-data-[collapsible=icon]:px-2 group-data-[collapsible=icon]:border-b-0">
            <div className="space-y-2">
                {/* Version complète quand la sidebar est ouverte */}
                <div className="text-sm font-medium bg-gradient-to-r from-brand to-primary bg-clip-text text-transparent group-data-[collapsible=icon]:hidden">
                    Bienvenue, {user.firstName}
                </div>

                {/* Version initiales quand la sidebar est fermée */}
                <div className="hidden group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:items-center group-data-[collapsible=icon]:justify-center">
                    <div className="w-8 h-8 bg-gradient-to-br from-brand to-primary rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg">
                        {getInitials(user.firstName, user.lastName)}
                    </div>
                </div>
            </div>
        </div>
    );
}

// Composant pour un élément de navigation
interface NavItemProps {
    item: {
        title: string;
        url?: string;
        icon: React.ComponentType<{ className?: string }>;
        badge?: string;
        items?: readonly { readonly title: string; readonly url: string }[];
    };
    isActive: boolean;
    pathname: string;
}
interface AppSidebarProps {
    showLogo?: boolean;
}

function NavItem({ item, isActive, pathname }: NavItemProps) {
    // Si l'item a des sous-items
    if (item.items) {
        const isSubItemActive = item.items.some((subItem) => pathname === subItem.url);

        return (
            <SidebarMenuItem className="group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:w-full">
                <Collapsible className="group/collapsible group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:justify-center">
                    <CollapsibleTrigger asChild>
                        <SidebarMenuButton
                            tooltip={item.title}
                            isActive={isSubItemActive}
                            className="group relative w-full flex items-center justify-start group-data-[collapsible=icon]:w-auto group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0"
                        >
                            <div className="flex items-center gap-3 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:gap-0 relative">
                                <item.icon className="h-5 w-5 shrink-0" />
                                <span className="group-data-[collapsible=icon]:hidden text-sm">{item.title}</span>
                            </div>
                            <ChevronRight className="ml-auto h-4 w-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90 group-data-[collapsible=icon]:hidden" />
                        </SidebarMenuButton>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                        <SidebarMenuSub>
                            {item.items.map((subItem) => (
                                <SidebarMenuSubItem key={subItem.title}>
                                    <SidebarMenuSubButton asChild isActive={pathname === subItem.url}>
                                        <Link href={subItem.url}>
                                            <span>{subItem.title}</span>
                                        </Link>
                                    </SidebarMenuSubButton>
                                </SidebarMenuSubItem>
                            ))}
                        </SidebarMenuSub>
                    </CollapsibleContent>
                </Collapsible>
            </SidebarMenuItem>
        );
    }

    // Si l'item n'a pas de sous-items (comportement normal)
    return (
        <SidebarMenuItem className="group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:w-full">
            <SidebarMenuButton
                tooltip={item.title}
                asChild
                isActive={isActive}
                className="group relative w-full flex items-center justify-start group-data-[collapsible=icon]:w-auto group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0"
            >
                <Link
                    href={item.url!}
                    className="flex items-center justify-between w-full group-data-[collapsible=icon]:w-auto group-data-[collapsible=icon]:justify-center"
                >
                    <div className="flex items-center gap-3 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:gap-0 relative">
                        <item.icon className="h-4 w-4 shrink-0" />
                        <span className="group-data-[collapsible=icon]:hidden text-sm">{item.title}</span>
                        {item.badge && (
                            <Badge
                                variant="secondary"
                                className="ml-auto h-5 w-5 flex items-center justify-center p-0 text-xs shrink-0
                  group-data-[collapsible=icon]:absolute group-data-[collapsible=icon]:-top-2 group-data-[collapsible=icon]:-right-2 
                  group-data-[collapsible=icon]:h-4 group-data-[collapsible=icon]:w-4 group-data-[collapsible=icon]:bg-red-500 
                  group-data-[collapsible=icon]:text-white group-data-[collapsible=icon]:border-2 group-data-[collapsible=icon]:border-background group-data-[collapsible=icon]:text-[10px] group-data-[collapsible=icon]:z-10"
                            >
                                <span>{item.badge}</span>
                            </Badge>
                        )}
                    </div>
                </Link>
            </SidebarMenuButton>
        </SidebarMenuItem>
    );
}

export function AppSidebar({ showLogo = true }: AppSidebarProps) {
    const pathname = usePathname();

    useSidebarState();

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { data: user, isLoading } = useCurrentUser();
    const dashboardUrl = getDashboardUrlByRole(user?.role);
    const roleSpecificItems = getRoleSpecificItems(user?.enterprise?.enterpriseType);
    const roleItems = (user?.role && roleSpecificItems[user?.role]) || [];

    const mainNavItems: Array<{
        title: string;
        url?: string;
        icon: React.ComponentType<{ className?: string }>;
        badge?: string;
        items?: Array<{ title: string; url: string }>;
    }> = [
        {
            title: "Tableau de Bord",
            url: dashboardUrl,
            icon: Home,
        },
        ...roleItems,
    ];

    return (
        <div className="relative">
            <Sidebar
                className="border-r border-border/50 bg-card/50 backdrop-blur-sm h-screen flex flex-col"
                collapsible="icon"
            >
                {/* Toggle Button */}
                <SidebarToggleButton />

                {/* Header avec logo */}
                <SidebarHeader className="flex-shrink-0">
                    <SidebarMenu>
                        {showLogo && (
                            <SidebarMenuItem>
                                {/* Logo */}
                                <div className="px-4 py-3 text-center border-b border-border/50 group-data-[collapsible=icon]:px-2 group-data-[collapsible=icon]:border-b-0">
                                    <div className="space-y-2">
                                        {/* Version complète quand la sidebar est ouverte */}
                                        <div className="text-sm font-medium bg-gradient-to-r from-brand to-primary bg-clip-text text-transparent group-data-[collapsible=icon]:hidden flex justify-center w-full">
                                            <Link
                                                href={dashboardUrl}
                                                className="flex items-center justify-center space-x-3 group w-full"
                                            >
                                                <div className="flex flex-col">
                                                    <span className="text-2xl font-bold bg-gradient-to-r from-brand to-primary bg-clip-text text-transparent group-hover:from-primary group-hover:to-brand transition-all duration-300">
                                                        Transmarket
                                                    </span>
                                                    <span className="text-xs text-muted-foreground -mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                                        Transport Intelligent
                                                    </span>
                                                </div>
                                            </Link>
                                        </div>

                                        {/* Version initiales quand la sidebar est fermée */}
                                        <div className="hidden group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:items-center group-data-[collapsible=icon]:justify-center">
                                            <Link
                                                href={dashboardUrl}
                                                className="w-9 h-9 bg-gradient-to-br from-brand to-primary rounded-xl flex items-center justify-center"
                                            >
                                                <Truck className="h-6 w-6 text-brand-foreground" />
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </SidebarMenuItem>
                        )}

                        <SidebarMenuItem>
                            <UserWelcome />
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarHeader>

                {/* Contenu principal */}
                <SidebarContent className="flex flex-col flex-1">
                    {/* Navigation principale */}
                    <SidebarGroup className="py-4">
                        <SidebarGroupLabel className="px-4 group-data-[collapsible=icon]:px-2 group-data-[collapsible=icon]:text-center">
                            <span className="group-data-[collapsible=icon]:hidden">Navigation</span>
                            <span className="hidden group-data-[collapsible=icon]:block text-xs">•</span>
                        </SidebarGroupLabel>
                        <SidebarGroupContent className="group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:flex-col group-data-[collapsible=icon]:items-center">
                            <SidebarMenu className="space-y-3 group-data-[collapsible=icon]:space-y-4 group-data-[collapsible=icon]:w-full">
                                {mainNavItems.map((item) => (
                                    <NavItem
                                        key={item.url || item.title}
                                        item={item}
                                        isActive={item.url ? pathname === item.url : false}
                                        pathname={pathname}
                                    />
                                ))}
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>
                </SidebarContent>

                {/* Footer */}
                <SidebarFooter className="flex-shrink-0 border-t border-border/50">
                    <div className="px-4 py-2 text-xs text-muted-foreground text-center group-data-[collapsible=icon]:px-2">
                        <span className="group-data-[collapsible=icon]:hidden">© 2025 Transmarket</span>
                        <span className="hidden group-data-[collapsible=icon]:block text-xs">©</span>
                    </div>
                </SidebarFooter>
            </Sidebar>
        </div>
    );
}
