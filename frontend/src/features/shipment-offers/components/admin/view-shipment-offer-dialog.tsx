"use client";

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShipmentOfferDataType, ShipmentOfferStatus } from "../../types/shipment-offer.type";
import {
    Package,
    Truck,
    Calendar,
    Weight,
    DollarSign,
    Clock,
    Hash,
    FileText,
    CheckCircle,
    XCircle,
    AlertTriangle,
    Ban,
} from "lucide-react";

interface ViewShipmentOfferDialogProps {
    open: boolean;
    setOpen: (open: boolean) => void;
    offer: ShipmentOfferDataType;
}

const getStatusBadge = (status: ShipmentOfferStatus) => {
    switch (status) {
        case ShipmentOfferStatus.PENDING:
            return (
                <Badge
                    variant="secondary"
                    className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300 flex items-center gap-1"
                >
                    <Clock className="h-3 w-3" />
                    EN ATTENTE
                </Badge>
            );
        case ShipmentOfferStatus.ACCEPTED:
            return (
                <Badge
                    variant="default"
                    className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 flex items-center gap-1"
                >
                    <CheckCircle className="h-3 w-3" />
                    ACCEPTÉ
                </Badge>
            );
        case ShipmentOfferStatus.REJECTED:
            return (
                <Badge
                    variant="destructive"
                    className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300 flex items-center gap-1"
                >
                    <XCircle className="h-3 w-3" />
                    REJETÉ
                </Badge>
            );
        case ShipmentOfferStatus.EXPIRED:
            return (
                <Badge
                    variant="secondary"
                    className="bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300 flex items-center gap-1"
                >
                    <AlertTriangle className="h-3 w-3" />
                    EXPIRÉ
                </Badge>
            );
        case ShipmentOfferStatus.CANCELLED:
            return (
                <Badge
                    variant="outline"
                    className="bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300 flex items-center gap-1"
                >
                    <Ban className="h-3 w-3" />
                    ANNULÉ
                </Badge>
            );
        default:
            return <Badge variant="secondary">INCONNU</Badge>;
    }
};

export default function ViewShipmentOfferDialog({ open, setOpen, offer }: ViewShipmentOfferDialogProps) {
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto p-0">
                <DialogHeader className="p-4 bg-muted border-b">
                    <DialogTitle>Détails de l&apos;offre d&apos;expédition</DialogTitle>
                    <DialogDescription>Informations complètes sur l&apos;offre d&apos;expédition sélectionnée.</DialogDescription>
                </DialogHeader>

                <div className="space-y-4 p-4">
                    <Card className="glass">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <Package className="h-5 w-5" />
                                Informations générales
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="flex justify-between">
                                <span className="font-medium flex items-center gap-2">
                                    <Hash className="h-4 w-4" />
                                    ID:
                                </span>
                                <code className="px-2 py-1 bg-muted rounded text-sm">{offer.id}</code>
                            </div>

                            <div className="flex justify-between items-start">
                                <span className="font-medium">Marchandise:</span>
                                <span className="text-right max-w-[300px]">{offer.commodity}</span>
                            </div>

                            <div className="flex justify-between items-center">
                                <span className="font-medium flex items-center gap-2">
                                    <Weight className="h-4 w-4" />
                                    Poids:
                                </span>
                                <span>{parseFloat(offer.weight).toLocaleString("fr-FR")} kg</span>
                            </div>

                            <div className="flex justify-between items-center">
                                <span className="font-medium">Nombre de colis:</span>
                                <span>{offer.numberOfParcels}</span>
                            </div>

                            <div className="flex justify-between items-center">
                                <span className="font-medium">Nombre de camions:</span>
                                <span>{offer.nbrTrucks}</span>
                            </div>

                            <div className="flex justify-between items-center">
                                <span className="font-medium">Statut:</span>
                                {getStatusBadge(offer.status)}
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="glass">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <Truck className="h-5 w-5" />
                                Type de camion
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="flex justify-between">
                                <span className="font-medium">Nom:</span>
                                <span>{offer.truckType?.name}</span>
                            </div>
                            <div className="flex justify-between items-start">
                                <span className="font-medium">Description:</span>
                                <span className="text-right max-w-[300px]">{offer.truckType?.description}</span>
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
                                <span className="font-medium">Heure de chargement:</span>
                                <span>
                                    {new Date(offer.loadingTime).toLocaleDateString("fr-FR", {
                                        year: "numeric",
                                        month: "long",
                                        day: "numeric",
                                        hour: "2-digit",
                                        minute: "2-digit",
                                    })}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="font-medium">Date de déchargement:</span>
                                <span>
                                    {new Date(offer.unloadDate).toLocaleDateString("fr-FR", {
                                        year: "numeric",
                                        month: "long",
                                        day: "numeric",
                                        hour: "2-digit",
                                        minute: "2-digit",
                                    })}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="font-medium">Disponible jusqu&apos;au:</span>
                                <span>
                                    {new Date(offer.availableTo).toLocaleDateString("fr-FR", {
                                        year: "numeric",
                                        month: "long",
                                        day: "numeric",
                                        hour: "2-digit",
                                        minute: "2-digit",
                                    })}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="font-medium">Créé le:</span>
                                <span>
                                    {new Date(offer.createdAt).toLocaleDateString("fr-FR", {
                                        year: "numeric",
                                        month: "long",
                                        day: "numeric",
                                        hour: "2-digit",
                                        minute: "2-digit",
                                    })}
                                </span>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="glass">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <DollarSign className="h-5 w-5" />
                                Informations financières
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="flex justify-between items-center">
                                <span className="font-medium">Prix de réserve:</span>
                                <span className="font-semibold text-green-700">
                                    {parseFloat(offer.reservePrice).toLocaleString("fr-FR", {
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2,
                                    })}{" "}
                                    DH
                                </span>
                            </div>
                            {offer.winningBidId && (
                                <div className="flex justify-between">
                                    <span className="font-medium">Enchère gagnante:</span>
                                    <code className="px-2 py-1 bg-muted rounded text-sm">{offer.winningBidId}</code>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {offer.specialRequirements && (
                        <Card className="glass">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-lg">
                                    <FileText className="h-5 w-5" />
                                    Exigences spéciales
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm">{offer.specialRequirements}</p>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
