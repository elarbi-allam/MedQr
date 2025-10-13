"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    Activity,
    LayoutDashboard,
    FileText,
    Pill,
    QrCode,
    Building2,
    Users,
    ChevronLeft,
    ChevronRight,
    Syringe,
} from "lucide-react";

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from "@/components/ui/sidebar";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useCurrentUser } from "@/features/profile/hooks/use-profile";
import { PatientProfile, ProviderProfile, FacilityProfile, UserType } from "@/lib/types/profile.type";

// URLs selon le type d'utilisateur
export function getDashboardUrlByUserType(userType: UserType | undefined): string {
    switch (userType) {
        case UserType.PATIENT:
            return "/patient";
        case UserType.PROVIDER:
            return "/provider/dashboard";
        case UserType.FACILITY:
            return "/facility/dashboard";
        default:
            return "/";
    }
}

// Navigation selon le type d'utilisateur
const getUserSpecificItems = () => {
    return {
        [UserType.PATIENT]: [
            {
                title: "Tableau de Bord",
                url: "/patient",
                icon: LayoutDashboard,
            },
            {
                title: "Mes Documents",
                url: "/patient/medical-record",
                icon: FileText,
            },
            {
                title: "Ordonnances",
                url: "/patient/prescriptions",
                icon: Pill,
            },
            {
                title: "Contrôle d'Accès",
                url: "/patient/access",
                icon: QrCode,
            },
            {
                title: "Demandes établissements",
                url: "/patient/facility-requests",
                icon: Building2,
            },
            {
                title: "Vaccinations",
                url: "/patient/vaccinations",
                icon: Syringe,
            },
        ],
        [UserType.PROVIDER]: [
            {
                title: "Tableau de Bord",
                url: "/provider",
                icon: LayoutDashboard,
            },
            {
                title: "Mes Patients",
                url: "/provider/patients",
                icon: Users,
            },
            {
                title: "Ordonnances",
                url: "/provider/prescriptions",
                icon: Pill,
            },
        ],
        [UserType.FACILITY]: [
            {
                title: "Tableau de Bord",
                url: "/facility",
                icon: LayoutDashboard,
            },
            {
                title: "Ordonnances",
                url: "/facility/prescriptions",
                icon: Pill,
            },
        ],
    };
};

// Composant pour afficher les informations utilisateur
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
// Type guards pour déterminer le type d'utilisateur
const isPatient = (user: PatientProfile | ProviderProfile | FacilityProfile): user is PatientProfile =>
    user.userType === UserType.PATIENT;

const isProvider = (user: PatientProfile | ProviderProfile | FacilityProfile): user is ProviderProfile =>
    user.userType === UserType.PROVIDER;

const isFacility = (user: PatientProfile | ProviderProfile | FacilityProfile): user is FacilityProfile =>
    user.userType === UserType.FACILITY;
function UserWelcome() {
    const { data: user, isLoading, error } = useCurrentUser();

    if (error) {
        return (
            <div className="px-4 py-3 border-b border-border/50 text-center text-sm text-red-500">
                Erreur de chargement
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="px-4 py-3 border-b border-border/50 animate-pulse group-data-[collapsible=icon]:px-2">
                <div className="h-10 bg-muted/50 rounded-full group-data-[collapsible=icon]:w-10 group-data-[collapsible=icon]:mx-auto" />
            </div>
        );
    }

    if (!user) return null;

    const getInitials = () => {
        if (isFacility(user) && user.name) {
            return user.name.charAt(0).toUpperCase();
        }
        if ((isPatient(user) || isProvider(user)) && user.firstName) {
            const initials = user.firstName.charAt(0) + (user.lastName ? user.lastName.charAt(0) : "");
            return initials.toUpperCase();
        }
        return "U";
    };

    const getUserLabel = () => {
        if (isFacility(user)) {
            return user.name || "Établissement";
        }
        if (isProvider(user)) {
            return `Dr. ${user.lastName}`;
        }
        if (isPatient(user)) {
            return `${user.firstName} ${user.lastName}`;
        }
        return "Utilisateur";
    };

    const getUserRole = () => {
        switch (user.userType) {
            case UserType.PATIENT:
                return "Patient";
            case UserType.PROVIDER:
                return (user as ProviderProfile).specialty || "Médecin";
            case UserType.FACILITY:
                return (user as FacilityProfile).type || "Établissement";
            default:
                return "Utilisateur";
        }
    };

    return (
        <div className="px-4 py-3 border-b border-border/50 group-data-[collapsible=icon]:px-2">
            <div className="flex items-center gap-3 group-data-[collapsible=icon]:justify-center">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-semibold text-primary">{getInitials()}</span>
                </div>
                <div className="flex-1 min-w-0 group-data-[collapsible=icon]:hidden">
                    <p className="text-sm font-medium truncate">{getUserLabel()}</p>
                    <p className="text-xs text-muted-foreground">{getUserRole()}</p>
                </div>
            </div>
        </div>
    );
}

// Composant pour un élément de navigation
interface NavItemProps {
    item: {
        title: string;
        url: string;
        icon: React.ComponentType<{ className?: string }>;
    };
    isActive: boolean;
}

function NavItem({ item, isActive }: NavItemProps) {
    return (
        <SidebarMenuItem className="group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:justify-center">
            <SidebarMenuButton
                tooltip={item.title}
                asChild
                isActive={isActive}
                className={cn(
                    "h-11 rounded-full transition-all duration-200 group-data-[collapsible=icon]:w-11 group-data-[collapsible=icon]:px-0",
                    isActive
                        ? "bg-primary text-primary-foreground shadow-sm hover:bg-primary/90"
                        : "hover:bg-muted/50 text-muted-foreground hover:text-foreground",
                )}
            >
                <Link href={item.url} className="flex items-center gap-3 group-data-[collapsible=icon]:justify-center">
                    <item.icon className="w-5 h-5 flex-shrink-0" />
                    <span className="text-sm font-medium group-data-[collapsible=icon]:hidden">{item.title}</span>
                </Link>
            </SidebarMenuButton>
        </SidebarMenuItem>
    );
}

interface AppSidebarProps {
    showLogo?: boolean;
}

export function AppSidebar({ showLogo = true }: AppSidebarProps) {
    const pathname = usePathname();
    const { data: user, isLoading } = useCurrentUser();

    if (isLoading) {
        return (
            <div className="relative">
                <Sidebar>
                    <SidebarHeader>
                        {/* Squelette pour le header */}
                        <div className="p-4 border-b border-border/50">
                            <div className="h-10 bg-muted/50 rounded-xl animate-pulse"></div>
                        </div>
                    </SidebarHeader>
                    <SidebarContent>
                        {/* Squelettes pour les items de navigation */}
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className="p-3">
                                <div className="h-11 bg-muted/50 rounded-full animate-pulse"></div>
                            </div>
                        ))}
                    </SidebarContent>
                </Sidebar>
            </div>
        );
    }

    const dashboardUrl = getDashboardUrlByUserType(user?.userType);
    const userSpecificItems = getUserSpecificItems();
    const navigationItems = (user?.userType && userSpecificItems[user?.userType]) || [];

    return (
        <div className="relative">
            <Sidebar
                className="border-r border-border/50 backdrop-blur-sm bg-card/50 h-screen flex flex-col"
                collapsible="icon"
            >
                <SidebarToggleButton />
                {/* Header avec logo */}
                <SidebarHeader className="flex-shrink-0">
                    <SidebarMenu>
                        {showLogo && (
                            <SidebarMenuItem>
                                <div className="p-4 border-b border-border/50 flex items-center justify-between group-data-[collapsible=icon]:justify-center">
                                    <Link
                                        href={dashboardUrl}
                                        className="flex items-center gap-3 group group-data-[collapsible=icon]:gap-0"
                                    >
                                        <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center group-hover:scale-105 transition-transform">
                                            <Activity className="w-5 h-5 text-primary-foreground" />
                                        </div>
                                        <span className="text-xl font-bold group-data-[collapsible=icon]:hidden">
                                            MedQR
                                        </span>
                                    </Link>
                                </div>
                            </SidebarMenuItem>
                        )}
                    </SidebarMenu>

                    {/* User Info */}
                    <UserWelcome />
                </SidebarHeader>

                {/* Contenu principal - Navigation */}
                <SidebarContent className="flex-1 overflow-y-auto">
                    <SidebarGroup className="p-3">
                        <SidebarGroupContent>
                            <SidebarMenu className="space-y-1">
                                {navigationItems.map((item) => (
                                    <NavItem key={item.url} item={item} isActive={pathname === item.url} />
                                ))}
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>
                </SidebarContent>

                {/* Footer */}
                <SidebarFooter className="flex-shrink-0 border-t border-border/50">
                    <div className="px-4 py-2 text-xs text-muted-foreground text-center group-data-[collapsible=icon]:px-2">
                        <span className="group-data-[collapsible=icon]:hidden">© 2025 MedQR</span>
                        <span className="hidden group-data-[collapsible=icon]:block text-xs">©</span>
                    </div>
                </SidebarFooter>
            </Sidebar>
        </div>
    );
}
