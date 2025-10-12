"use client";

import { Bell, LogOut, User, Mail, Phone, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useLogout } from "@/features/profile/hooks/use-profile";

// Types
enum UserType {
    PATIENT = "PATIENT",
    PROVIDER = "PROVIDER",
    FACILITY = "FACILITY",
}

interface User {
    userId: string;
    email: string;
    userType: UserType;
    firstName?: string;
    lastName?: string;
    specialty?: string;
    facilityName?: string;
    phone?: string;
    address?: string;
}

interface Notification {
    id: string;
    title: string;
    message: string;
    time: string;
    type: "info" | "success" | "warning";
}

interface AppNavbarProps {
    className?: string;
}

export function AppNavbar({ className }: AppNavbarProps) {
    const logoutMutation = useLogout();

    const handleLogout = async () => {
        try {
            await logoutMutation.mutateAsync();
            window.location.href = "/login";
        } catch (error) {
            console.error("Erreur lors de la déconnexion:", error);
        }
    };
    // const { data: user } = useCurrentUser();
    // const { data: notifications } = useNotifications();

    // TODO: Remplacer par votre hook réel quand le backend sera prêt
    const user: User = {
        userId: "123",
        email: "sarah.johnson@email.com",
        userType: UserType.PATIENT,
        firstName: "Sarah",
        lastName: "Johnson",
        phone: "+212 6 12 34 56 78",
        address: "Casablanca, Morocco",
    };

    const notifications: Notification[] = [
        {
            id: "1",
            title: "Nouveau résultat d'analyse",
            message: "Vos résultats de sang sont disponibles",
            time: "Il y a 2 heures",
            type: "info",
        },
        {
            id: "2",
            title: "Ordonnance validée",
            message: "Dr. Martin a validé votre ordonnance",
            time: "Hier à 15:30",
            type: "success",
        },
        {
            id: "3",
            title: "Rappel vaccin",
            message: "Votre rappel est prévu dans 2 jours",
            time: "Il y a 3 jours",
            type: "warning",
        },
    ];

    const notificationCount = notifications.length;

    const getInitials = (firstName?: string, lastName?: string) => {
        if (!firstName) return "U";
        const initials = firstName.charAt(0) + (lastName ? lastName.charAt(0) : "");
        return initials.toUpperCase();
    };

    const getUserLabel = () => {
        if (user.userType === UserType.PATIENT) {
            return `${user.firstName} ${user.lastName}`;
        } else if (user.userType === UserType.PROVIDER) {
            return `Dr. ${user.lastName}`;
        } else {
            return user.facilityName || "Établissement";
        }
    };

    const getUserRole = () => {
        switch (user.userType) {
            case UserType.PATIENT:
                return "Patient";
            case UserType.PROVIDER:
                return user.specialty || "Médecin";
            case UserType.FACILITY:
                return "Établissement";
            default:
                return "Utilisateur";
        }
    };

    const getNotificationColor = (type: Notification["type"]) => {
        switch (type) {
            case "info":
                return "bg-blue-500";
            case "success":
                return "bg-green-500";
            case "warning":
                return "bg-orange-500";
            default:
                return "bg-gray-500";
        }
    };

    return (
        <nav
            className={cn(
                "flex items-center justify-end gap-2 px-4 h-14 bg-background/80 backdrop-blur-sm border-b border-border/50 shrink-0",
                className,
            )}
        >
            {/* Notifications Dropdown */}
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="relative h-9 w-9 rounded-full hover:bg-muted/50 transition-colors"
                    >
                        <Bell className="h-4 w-4" />
                        {notificationCount > 0 && (
                            <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground animate-pulse">
                                {notificationCount > 9 ? "9+" : notificationCount}
                            </span>
                        )}
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-80 p-0">
                    <DropdownMenuLabel className="flex items-center justify-between px-4 py-3 border-b">
                        <span className="font-semibold">Notifications</span>
                        <Badge variant="secondary" className="ml-2 h-5">
                            {notificationCount}
                        </Badge>
                    </DropdownMenuLabel>

                    <div className="max-h-[400px] overflow-y-auto">
                        {notifications.map((notification) => (
                            <DropdownMenuItem
                                key={notification.id}
                                className="flex flex-col items-start gap-1.5 py-3 px-4 cursor-pointer hover:bg-muted/50 transition-colors"
                            >
                                <div className="flex items-center gap-2 w-full">
                                    <div
                                        className={cn("h-2 w-2 rounded-full", getNotificationColor(notification.type))}
                                    />
                                    <span className="text-sm font-medium">{notification.title}</span>
                                </div>
                                <span className="text-xs text-muted-foreground pl-4">{notification.message}</span>
                                <span className="text-xs text-muted-foreground/70 pl-4">{notification.time}</span>
                            </DropdownMenuItem>
                        ))}
                    </div>

                    <DropdownMenuSeparator className="my-0" />
                    <DropdownMenuItem className="justify-center py-2 text-xs text-primary font-medium cursor-pointer hover:bg-muted/50">
                        Voir toutes les notifications
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            {/* Logout Button */}

            <Button
                variant="ghost"
                size="sm"
                className="h-9 w-9 rounded-full hover:bg-destructive/10 text-destructive transition-colors"
                title="Déconnexion"
                onClick={handleLogout}
            >
                <LogOut className="h-4 w-4" />
            </Button>

            {/* Separator */}
            <div className="h-6 w-px bg-border/50 mx-1" />

            {/* Profile with HoverCard */}
            <HoverCard openDelay={200} closeDelay={100}>
                <HoverCardTrigger asChild>
                    <Button
                        variant="ghost"
                        className="h-9 px-2 rounded-full hover:bg-muted/50 flex items-center gap-2 transition-colors"
                    >
                        <Avatar className="h-7 w-7 ring-2 ring-primary/10">
                            <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                                {getInitials(user.firstName, user.lastName)}
                            </AvatarFallback>
                        </Avatar>
                        <span className="text-sm font-medium hidden sm:inline-block">{user.firstName}</span>
                    </Button>
                </HoverCardTrigger>
                <HoverCardContent
                    align="end"
                    className="w-80 p-0 bg-card/95 backdrop-blur-sm border-border/50 shadow-lg"
                >
                    <div className="flex flex-col">
                        {/* Header */}
                        <div className="flex items-start gap-3 p-4 bg-muted/30">
                            <Avatar className="h-14 w-14 ring-2 ring-primary/20">
                                <AvatarFallback className="bg-primary/10 text-primary text-lg font-bold">
                                    {getInitials(user.firstName, user.lastName)}
                                </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 space-y-1">
                                <h4 className="text-base font-semibold leading-tight">{getUserLabel()}</h4>
                                <Badge variant="secondary" className="text-xs h-5">
                                    {getUserRole()}
                                </Badge>
                            </div>
                        </div>

                        {/* Contact Info */}
                        <div className="space-y-2.5 p-4 border-t border-border/50">
                            <div className="flex items-center gap-2.5 text-sm group">
                                <Mail className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                                <span className="text-muted-foreground truncate text-xs">{user.email}</span>
                            </div>
                            {user.phone && (
                                <div className="flex items-center gap-2.5 text-sm group">
                                    <Phone className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                                    <span className="text-muted-foreground text-xs">{user.phone}</span>
                                </div>
                            )}
                            {user.address && (
                                <div className="flex items-center gap-2.5 text-sm group">
                                    <MapPin className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                                    <span className="text-muted-foreground text-xs">{user.address}</span>
                                </div>
                            )}
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2 p-4 bg-muted/20 border-t border-border/50">
                            <Link href="/profile" className="flex-1">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="w-full h-8 text-xs rounded-full hover:bg-primary/10 hover:text-primary hover:border-primary/20 transition-colors"
                                >
                                    <User className="h-3 w-3 mr-1.5" />
                                    Mon Profil
                                </Button>
                            </Link>
                            <Button
                                variant="outline"
                                size="sm"
                                className="flex-1 h-8 text-xs rounded-full text-destructive hover:bg-destructive/10 hover:text-destructive border-destructive/20 hover:border-destructive/50 transition-colors"
                                onClick={handleLogout}
                            >
                                <LogOut className="h-3 w-3 mr-1.5" />
                                Déconnexion
                            </Button>
                        </div>
                    </div>
                </HoverCardContent>
            </HoverCard>
        </nav>
    );
}
