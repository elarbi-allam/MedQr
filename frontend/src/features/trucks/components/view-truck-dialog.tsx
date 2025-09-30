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
import { TruckDataType } from '../types/truck.type';
import { Truck, Calendar, Weight, Hash, Building2 } from 'lucide-react';

interface ViewTruckDialogProps {
    open: boolean;
    setOpen: (open: boolean) => void;
    truck: TruckDataType;
}

export default function ViewTruckDialog({
    open,
    setOpen,
    truck,
}: ViewTruckDialogProps) {
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto p-0">
                <DialogHeader className="p-4 bg-muted border-b">
                    <div className="flex items-center gap-3">
                        <Avatar className="h-12 w-12">
                            <AvatarImage
                                src={truck.truckType.icon}
                                alt={truck.truckType.name}
                            />
                            <AvatarFallback className="bg-gradient-to-br from-brand to-primary text-brand-foreground">
                                <Truck className="h-6 w-6" />
                            </AvatarFallback>
                        </Avatar>
                        <div>
                            <DialogTitle className="text-xl flex items-center gap-2">
                                <Hash className="h-5 w-5" />
                                {truck.registrationNumber}
                            </DialogTitle>
                            <DialogDescription>
                                Détails complets du camion
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                <div className="space-y-4 p-4">
                    <Card className="glass">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <Truck className="h-5 w-5" />
                                Informations du camion
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <span className="font-medium">
                                        Immatriculation:
                                    </span>
                                    <p className="text-muted-foreground font-mono">
                                        {truck.registrationNumber}
                                    </p>
                                </div>
                                <div>
                                    <span className="font-medium">
                                        Poids maximum:
                                    </span>
                                    <div className="mt-1">
                                        <Badge
                                            variant="outline"
                                            className="flex items-center gap-1 w-fit"
                                        >
                                            <Weight className="h-3 w-3" />
                                            {truck.maxWeight} T
                                        </Badge>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <span className="font-medium">
                                    Type de camion:
                                </span>
                                <div className="mt-1 flex items-center gap-2">
                                    <span className="text-2xl">
                                        {truck.truckType.icon}
                                    </span>
                                    <div>
                                        <p className="font-medium">
                                            {truck.truckType.name}
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                            {truck.truckType.description}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {truck.enterprise && (
                        <Card className="glass">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-lg">
                                    <Building2 className="h-5 w-5" />
                                    Entreprise propriétaire
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div>
                                    <span className="font-medium">
                                        Nom de l&apos;entreprise:
                                    </span>
                                    <p className="text-muted-foreground">
                                        {truck.enterprise.name}
                                    </p>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <span className="font-medium">
                                            ICE:
                                        </span>
                                        <p className="text-muted-foreground font-mono text-sm">
                                            {truck.enterprise.ice}
                                        </p>
                                    </div>
                                    <div>
                                        <span className="font-medium">RC:</span>
                                        <p className="text-muted-foreground font-mono text-sm">
                                            {truck.enterprise.rc}
                                        </p>
                                    </div>
                                </div>
                                <div>
                                    <span className="font-medium">
                                        Description:
                                    </span>
                                    <p className="text-muted-foreground">
                                        {truck.enterprise.description}
                                    </p>
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
                                <span>
                                    {new Date(
                                        truck.createdAt
                                    ).toLocaleDateString('fr-FR', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit',
                                    })}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="font-medium">
                                    Dernière modification:
                                </span>
                                <span>
                                    {new Date(
                                        truck.updatedAt
                                    ).toLocaleDateString('fr-FR', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit',
                                    })}
                                </span>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </DialogContent>
        </Dialog>
    );
}
