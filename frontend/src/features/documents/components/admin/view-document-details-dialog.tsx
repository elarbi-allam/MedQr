"use client";

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DocumentDataType, DocumentStatus } from "../../types/document.type";
import {
    FileText,
    Building2,
    Truck,
    Calendar,
    CheckCircle,
    XCircle,
    Clock,
    AlertTriangle,
    Tag,
    User,
} from "lucide-react";

interface ViewDocumentDetailsDialogProps {
    open: boolean;
    setOpen: (open: boolean) => void;
    document: DocumentDataType;
}

const getStatusBadge = (status: DocumentStatus) => {
    switch (status) {
        case DocumentStatus.PENDING:
            return (
                <Badge
                    variant="secondary"
                    className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300 flex items-center gap-1"
                >
                    <Clock className="h-3 w-3" />
                    EN ATTENTE
                </Badge>
            );
        case DocumentStatus.ACCEPTED:
            return (
                <Badge
                    variant="default"
                    className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 flex items-center gap-1"
                >
                    <CheckCircle className="h-3 w-3" />
                    ACCEPTÉ
                </Badge>
            );
        case DocumentStatus.REJECTED:
            return (
                <Badge
                    variant="destructive"
                    className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300 flex items-center gap-1"
                >
                    <XCircle className="h-3 w-3" />
                    REJETÉ
                </Badge>
            );
        case DocumentStatus.EXPIRED:
            return (
                <Badge
                    variant="outline"
                    className="bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300 flex items-center gap-1 border-gray-300"
                >
                    <AlertTriangle className="h-3 w-3" />
                    EXPIRÉ
                </Badge>
            );
        default:
            return <Badge variant="secondary">INCONNU</Badge>;
    }
};

const getAppliesToBadge = (appliesTo: string) => {
    switch (appliesTo) {
        case "ENTERPRISE":
            return (
                <Badge
                    variant="secondary"
                    className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 flex items-center gap-1"
                >
                    <Building2 className="h-3 w-3" />
                    ENTREPRISE
                </Badge>
            );
        case "TRUCK":
            return (
                <Badge
                    variant="secondary"
                    className="bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300 flex items-center gap-1"
                >
                    <Truck className="h-3 w-3" />
                    CAMION
                </Badge>
            );
        default:
            return <Badge variant="secondary">INCONNU</Badge>;
    }
};

export default function ViewDocumentDetailsDialog({ open, setOpen, document }: ViewDocumentDetailsDialogProps) {
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto p-0">
                <DialogHeader className="p-4 bg-muted border-b">
                    <DialogTitle>Détails du document</DialogTitle>
                    <DialogDescription>Informations complètes sur le document sélectionné.</DialogDescription>
                </DialogHeader>

                <div className="space-y-4 p-4">
                    <Card className="glass">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <FileText className="h-5 w-5" />
                                Informations du document
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="flex justify-between items-start">
                                <span className="font-medium">Nom du fichier:</span>
                                <span className="text-right max-w-[300px] break-words">
                                    {document.docName || "Nom non défini"}
                                </span>
                            </div>

                            <div className="flex justify-between items-center">
                                <span className="font-medium">Type MIME:</span>
                                <code className="px-2 py-1 bg-muted rounded text-sm">
                                    {document.mimeType || "Non spécifié"}
                                </code>
                            </div>

                            <div className="flex justify-between items-center">
                                <span className="font-medium">Statut:</span>
                                {getStatusBadge(document.status)}
                            </div>

                            {document.expireAt && (
                                <div className="flex justify-between items-center">
                                    <span className="font-medium">Date d&apos;expiration:</span>
                                    <span>{new Date(document.expireAt).toLocaleDateString("fr-FR")}</span>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Section Modèle de document - avec vérifications */}
                    {document.documentTemplate ? (
                        <Card className="glass">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-lg">
                                    <Tag className="h-5 w-5" />
                                    Modèle de document
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="flex justify-between items-center">
                                    <span className="font-medium">Nom:</span>
                                    <span>{document.documentTemplate.name || "Nom non défini"}</span>
                                </div>

                                <div className="flex justify-between items-center">
                                    <span className="font-medium">Nom du champ:</span>
                                    <code className="px-2 py-1 bg-muted rounded text-sm">
                                        {document.documentTemplate.fieldname || "Non spécifié"}
                                    </code>
                                </div>

                                <div className="flex justify-between items-start">
                                    <span className="font-medium">Description:</span>
                                    <span className="text-right max-w-[300px]">
                                        {document.documentTemplate.description || "Aucune description"}
                                    </span>
                                </div>

                                <div className="flex justify-between items-center">
                                    <span className="font-medium">S&apos;applique à:</span>
                                    {getAppliesToBadge(document.documentTemplate.appliesTo || "UNKNOWN")}
                                </div>
                            </CardContent>
                        </Card>
                    ) : (
                        <Card className="glass">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-lg">
                                    <Tag className="h-5 w-5" />
                                    Modèle de document
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <span className="text-muted-foreground">Aucun modèle de document associé</span>
                            </CardContent>
                        </Card>
                    )}

                    {/* Section Entreprise - avec vérifications */}
                    {document.enterprise ? (
                        <Card className="glass">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-lg">
                                    <User className="h-5 w-5" />
                                    Entreprise propriétaire
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="flex justify-between">
                                    <span className="font-medium">Nom:</span>
                                    <span>{document.enterprise.name || "Nom non défini"}</span>
                                </div>

                                <div className="flex justify-between">
                                    <span className="font-medium">Type:</span>
                                    <Badge
                                        variant={
                                            document.enterprise.enterpriseType === "CARRIER" ? "default" : "secondary"
                                        }
                                    >
                                        {document.enterprise.enterpriseType === "CARRIER"
                                            ? "TRANSPORTEUR"
                                            : "EXPÉDITEUR"}
                                    </Badge>
                                </div>

                                <div className="flex justify-between">
                                    <span className="font-medium">ICE:</span>
                                    <span>{document.enterprise.ice || "Non spécifié"}</span>
                                </div>

                                <div className="flex justify-between">
                                    <span className="font-medium">RC:</span>
                                    <span>{document.enterprise.rc || "Non spécifié"}</span>
                                </div>
                            </CardContent>
                        </Card>
                    ) : (
                        <Card className="glass">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-lg">
                                    <User className="h-5 w-5" />
                                    Entreprise propriétaire
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <span className="text-muted-foreground">Aucune entreprise associée</span>
                            </CardContent>
                        </Card>
                    )}

                    {/* Section Camion - déjà bien protégée */}
                    {document.truck && (
                        <Card className="glass">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-lg">
                                    <Truck className="h-5 w-5" />
                                    Camion associé
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="flex justify-between">
                                    <span className="font-medium">Numéro d&apos;immatriculation:</span>
                                    <span>{document.truck.registrationNumber || "Non spécifié"}</span>
                                </div>

                                <div className="flex justify-between">
                                    <span className="font-medium">Type de camion:</span>
                                    <span>{document.truck.truckType?.name || "Type non défini"}</span>
                                </div>

                                <div className="flex justify-between">
                                    <span className="font-medium">Poids maximum:</span>
                                    <span>{document.truck.maxWeight || "Non spécifié"} tonnes</span>
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
                                    {document.createdAt
                                        ? new Date(document.createdAt).toLocaleDateString("fr-FR", {
                                              year: "numeric",
                                              month: "long",
                                              day: "numeric",
                                              hour: "2-digit",
                                              minute: "2-digit",
                                          })
                                        : "Date non définie"}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="font-medium">Dernière modification:</span>
                                <span>
                                    {document.updatedAt
                                        ? new Date(document.updatedAt).toLocaleDateString("fr-FR", {
                                              year: "numeric",
                                              month: "long",
                                              day: "numeric",
                                              hour: "2-digit",
                                              minute: "2-digit",
                                          })
                                        : "Date non définie"}
                                </span>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </DialogContent>
        </Dialog>
    );
}
