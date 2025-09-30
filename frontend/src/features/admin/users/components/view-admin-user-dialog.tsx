"use client";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AdminUserDataType } from "../types/admin-user.type";
import { UserRole } from "@/lib/types/user.type";
import { UserStatus } from "@/lib/enums/user-status";
import {
    User,
    Mail,
    Phone,
    Calendar,
    Building,
    Shield,
    CheckCircle,
    XCircle,
    Clock,
    UserX
} from "lucide-react";

interface ViewAdminUserDialogProps {
    open: boolean;
    setOpen: (open: boolean) => void;
    user: AdminUserDataType;
}

const roleLabels = {
    [UserRole.ADMIN]: "Administrateur",
    [UserRole.ENTERPRISE_USER]: "Utilisateur Entreprise",
    [UserRole.USER]: "Utilisateur",
};

const roleColors = {
    [UserRole.ADMIN]: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
    [UserRole.ENTERPRISE_USER]: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
    [UserRole.USER]: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
};

const getStatusBadge = (status: UserStatus) => {
    switch (status) {
        case UserStatus.ACTIVE:
            return (
                <Badge variant="default" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 flex items-center gap-1">
                    <CheckCircle className="h-3 w-3" />
                    ACTIF
                </Badge>
            );
        case UserStatus.INACTIVE:
            return (
                <Badge variant="destructive" className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300 flex items-center gap-1">
                    <XCircle className="h-3 w-3" />
                    INACTIF
                </Badge>
            );
        case UserStatus.PENDING:
            return (
                <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300 flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    EN ATTENTE
                </Badge>
            );
        case UserStatus.ARCHIVE:
            return (
                <Badge variant="outline" className="bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300 flex items-center gap-1">
                    <UserX className="h-3 w-3" />
                    ARCHIVÉ
                </Badge>
            );
        default:
            return <Badge variant="secondary">INCONNU</Badge>;
    }
};

export default function ViewAdminUserDialog({ 
    open, 
    setOpen, 
    user 
}: ViewAdminUserDialogProps) {
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="sm:max-w-[500px] max-h-[80vh] overflow-y-auto p-0">
                <DialogHeader className="p-4 bg-muted border-b">
                    <DialogTitle>Détails de l&apos;utilisateur</DialogTitle>
                    <DialogDescription>
                        Informations complètes sur l&apos;utilisateur sélectionné.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 p-4">
                    <Card className="glass">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <User className="h-5 w-5" />
                                Informations personnelles
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="flex justify-between">
                                <span className="font-medium">Nom complet:</span>
                                <span>{user.firstName} {user.lastName}</span>
                            </div>

                            <div className="flex justify-between items-center">
                                <span className="font-medium flex items-center gap-2">
                                    <Mail className="h-4 w-4" />
                                    Email:
                                </span>
                                <span>{user.email}</span>
                            </div>

                            <div className="flex justify-between items-center">
                                <span className="font-medium flex items-center gap-2">
                                    <Phone className="h-4 w-4" />
                                    Téléphone:
                                </span>
                                <span>{user.phoneNumber || "Non renseigné"}</span>
                            </div>

                            <div className="flex justify-between items-center">
                                <span className="font-medium flex items-center gap-2">
                                    <Shield className="h-4 w-4" />
                                    Rôle:
                                </span>
                                <Badge className={roleColors[user.role]}>
                                    {roleLabels[user.role]}
                                </Badge>
                            </div>

                            <div className="flex justify-between items-center">
                                <span className="font-medium">Statut:</span>
                                {getStatusBadge(user.status)}
                            </div>
                        </CardContent>
                    </Card>

                    {user.enterprise && (
                        <Card className="glass">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-lg">
                                    <Building className="h-5 w-5" />
                                    Entreprise
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="flex justify-between">
                                    <span className="font-medium">Nom:</span>
                                    <span>{user.enterprise.name}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="font-medium">ICE:</span>
                                    <span>{user.enterprise.ice}</span>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    <Card className="glass">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <Calendar className="h-5 w-5" />
                                Dates importantes
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="flex justify-between">
                                <span className="font-medium">Créé le:</span>
                                <span>{new Date(user.createdAt).toLocaleDateString("fr-FR", {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                })}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="font-medium">Dernière modification:</span>
                                <span>{new Date(user.updatedAt).toLocaleDateString("fr-FR", {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                })}</span>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </DialogContent>
        </Dialog>
    );
}