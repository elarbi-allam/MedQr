'use client';

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { TruckTypeDataType, TruckTypeStatus } from '../types/truck-type.type';
import { Truck, Calendar, CheckCircle, XCircle, Archive } from 'lucide-react';

interface ViewAdminTruckTypeDialogProps {
    open: boolean;
    setOpen: (open: boolean) => void;
    truckType: TruckTypeDataType;
}

const getStatusBadge = (status: TruckTypeStatus) => {
    switch (status) {
        case TruckTypeStatus.ACTIVE:
            return (
                <Badge
                    variant="default"
                    className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 flex items-center gap-1"
                >
                    <CheckCircle className="h-3 w-3" />
                    ACTIF
                </Badge>
            );
        case TruckTypeStatus.INACTIVE:
            return (
                <Badge
                    variant="destructive"
                    className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300 flex items-center gap-1"
                >
                    <XCircle className="h-3 w-3" />
                    INACTIF
                </Badge>
            );
        case TruckTypeStatus.ARCHIVE:
            return (
                <Badge
                    variant="outline"
                    className="bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300 flex items-center gap-1"
                >
                    <Archive className="h-3 w-3" />
                    ARCHIVÉ
                </Badge>
            );
        default:
            return <Badge variant="secondary">INCONNU</Badge>;
    }
};

export default function ViewAdminTruckTypeDialog({
    open,
    setOpen,
    truckType,
}: ViewAdminTruckTypeDialogProps) {
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto p-0">
                <DialogHeader className="p-4 bg-muted border-b">
                    <div className="flex items-center gap-3">
                        <Avatar className="h-12 w-12">
                            <AvatarImage
                                src={truckType.icon}
                                alt={truckType.name}
                            />
                            <AvatarFallback className="bg-gradient-to-br from-brand to-primary text-brand-foreground">
                                <Truck className="h-6 w-6" />
                            </AvatarFallback>
                        </Avatar>
                        <div>
                            <DialogTitle className="text-xl">
                                {truckType.name}
                            </DialogTitle>
                            <DialogDescription>
                                Détails complets du type de camion
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                <div className="space-y-4 p-4">
                    <Card className="glass">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <Truck className="h-5 w-5" />
                                Informations générales
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <span className="font-medium">Nom:</span>
                                    <p className="text-muted-foreground">
                                        {truckType.name}
                                    </p>
                                </div>
                                <div>
                                    <span className="font-medium">Slug:</span>
                                    <p className="text-muted-foreground font-mono text-sm">
                                        {truckType.slug}
                                    </p>
                                </div>
                            </div>

                            <div>
                                <span className="font-medium">
                                    Description:
                                </span>
                                <p className="text-muted-foreground mt-1">
                                    {truckType.description}
                                </p>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <span className="font-medium">Statut:</span>
                                    <div className="mt-1">
                                        {truckType.status
                                            ? getStatusBadge(truckType.status)
                                            : 'no status found'}
                                    </div>
                                </div>
                                <div>
                                    <span className="font-medium">Icône:</span>
                                    <p className="text-muted-foreground text-xs">
                                        {truckType.icon || 'Aucune icône'}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

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
                                <span>
                                    {truckType.createdAt
                                        ? new Date(
                                              truckType.createdAt
                                          ).toLocaleDateString('fr-FR', {
                                              year: 'numeric',
                                              month: 'long',
                                              day: 'numeric',
                                              hour: '2-digit',
                                              minute: '2-digit',
                                          })
                                        : 'no created date found'}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="font-medium">
                                    Dernière modification:
                                </span>
                                <span>
                                    {truckType.updatedAt
                                        ? new Date(
                                              truckType.updatedAt
                                          ).toLocaleDateString('fr-FR', {
                                              year: 'numeric',
                                              month: 'long',
                                              day: 'numeric',
                                              hour: '2-digit',
                                              minute: '2-digit',
                                          })
                                        : 'no updated date found'}
                                </span>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </DialogContent>
        </Dialog>
    );
}
