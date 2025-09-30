"use client";

import { useState, useMemo, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileText, Upload, CheckCircle, XCircle, Clock, AlertTriangle, Download, Eye, Truck } from "lucide-react";
import { useMyTrucks } from "@/features/trucks/hooks/use-trucks";
import { useRequiredTruckDocumentTemplatesById } from "@/features/document-templates/hooks/use-document-template";
import { DocumentStatus } from "../../types/document.type";
import { useDownloadDocument, useViewDocument } from "../../hooks/use-document";
import UploadTruckDocumentDialog from "./upload-truck-document-dialog";
import { TruckDataType } from "@/features/trucks/types/truck.type";

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

export default function TruckDocuments() {
    const [selectedTruckId, setSelectedTruckId] = useState<string>("");
    const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
    const [selectedTemplate, setSelectedTemplate] = useState(null);

    const { data: trucksData, isLoading: isLoadingTrucks } = useMyTrucks({
        page: 1,
        take: 50, // Récupérer tous les camions pour la sélection
    });

    const { data: templatesData, isLoading: isLoadingTemplates } =
        useRequiredTruckDocumentTemplatesById(selectedTruckId);

    const { mutate: downloadDocument, isPending: isDownloading } = useDownloadDocument();
    const { mutate: viewDocument, isPending: isViewing } = useViewDocument();

    const trucks = useMemo(() => trucksData?.data ?? [], [trucksData?.data]);
    const templates = templatesData?.data || [];

    // Sélectionner automatiquement le premier camion s'il n'y en a qu'un
    useEffect(() => {
        if (trucks.length === 1 && !selectedTruckId) {
            setSelectedTruckId(trucks[0].id);
        }
    }, [trucks, selectedTruckId]);

    const selectedTruck = trucks.find((truck) => truck.id === selectedTruckId);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleUpload = (template: any) => {
        setSelectedTemplate({ ...template, truckId: selectedTruckId });
        setUploadDialogOpen(true);
    };

    const handleDownload = (documentId: string) => {
        downloadDocument(documentId);
    };

    const handleView = (documentId: string) => {
        viewDocument(documentId);
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const canUploadDocument = (template: any) => {
        if (!template.documents || template.documents.length === 0) {
            return true;
        }

        const latestDocument = template.documents[0];
        return latestDocument.status === DocumentStatus.REJECTED || latestDocument.status === DocumentStatus.EXPIRED;
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const getDocumentStatus = (template: any) => {
        if (!template.documents || template.documents.length === 0) {
            return null;
        }
        return template.documents[0];
    };

    if (isLoadingTrucks) {
        return (
            <div className="space-y-4">
                <div className="h-8 bg-muted rounded w-1/3 animate-pulse" />
                {[1, 2, 3].map((i) => (
                    <Card key={i} className="animate-pulse">
                        <CardHeader>
                            <div className="h-6 bg-muted rounded w-1/3" />
                        </CardHeader>
                        <CardContent>
                            <div className="h-4 bg-muted rounded w-2/3" />
                        </CardContent>
                    </Card>
                ))}
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-foreground">Documents des Camions</h1>
                <p className="text-muted-foreground">Gérez les documents requis pour vos camions</p>
            </div>

            {trucks.length === 0 ? (
                <div className="text-center py-12">
                    <Truck className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                    <h3 className="text-lg font-semibold mb-2">Aucun camion trouvé</h3>
                    <p className="text-muted-foreground">
                        Vous devez d&apos;abord ajouter des camions pour gérer leurs documents.
                    </p>
                </div>
            ) : (
                <>
                    {/* Sélecteur de camion */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Truck className="h-5 w-5" />
                                Sélectionner un camion
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Select value={selectedTruckId} onValueChange={setSelectedTruckId}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Choisissez un camion" />
                                </SelectTrigger>
                                <SelectContent>
                                    {trucks.map((truck: TruckDataType) => (
                                        <SelectItem key={truck.id} value={truck.id}>
                                            <div className="flex items-center gap-2">
                                                <span className="font-medium">{truck.registrationNumber}</span>
                                                <span className="text-muted-foreground">- {truck.truckType.name}</span>
                                            </div>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </CardContent>
                    </Card>

                    {/* Documents du camion sélectionné */}
                    {selectedTruckId && (
                        <>
                            {selectedTruck && (
                                <Card className="border-brand/20 bg-brand/5">
                                    <CardContent>
                                        <div className="flex items-center gap-3">
                                            <div className="flex items-center justify-center w-12 h-12 bg-brand/20 rounded-lg">
                                                <Truck className="h-6 w-6 text-brand" />
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-lg">
                                                    {selectedTruck.registrationNumber}
                                                </h3>
                                                <p className="text-muted-foreground">
                                                    {selectedTruck.truckType.name} - Poids max:{" "}
                                                    {selectedTruck.maxWeight}T
                                                </p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            )}

                            {isLoadingTemplates ? (
                                <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
                                    {[1, 2, 3].map((i) => (
                                        <Card key={i} className="animate-pulse">
                                            <CardHeader>
                                                <div className="h-6 bg-muted rounded w-2/3" />
                                                <div className="h-4 bg-muted rounded w-1/2" />
                                            </CardHeader>
                                            <CardContent>
                                                <div className="h-4 bg-muted rounded w-3/4" />
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            ) : (
                                <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
                                    {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                                    {templates.map((template: any) => {
                                        const document = getDocumentStatus(template);
                                        const canUpload = canUploadDocument(template);

                                        return (
                                            <Card key={template.id} className="relative overflow-hidden">
                                                <CardHeader className="pb-4">
                                                    <div className="flex items-start justify-between">
                                                        <div className="flex items-center gap-3">
                                                            <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-orange-100 to-orange-200 dark:from-orange-900 dark:to-orange-800 rounded-lg">
                                                                <FileText className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                                                            </div>
                                                            <div>
                                                                <CardTitle className="text-lg">
                                                                    {template.name}
                                                                </CardTitle>
                                                                <p className="text-sm text-muted-foreground">
                                                                    {template.description}
                                                                </p>
                                                            </div>
                                                        </div>
                                                        {document && getStatusBadge(document.status)}
                                                    </div>
                                                </CardHeader>

                                                <CardContent className="space-y-4">
                                                    {document ? (
                                                        <div className="space-y-3">
                                                            <div className="flex items-center justify-between text-sm">
                                                                <span className="text-muted-foreground">
                                                                    Nom du fichier:
                                                                </span>
                                                                <span
                                                                    className="font-medium truncate max-w-[200px]"
                                                                    title={document.docName}
                                                                >
                                                                    {document.docName}
                                                                </span>
                                                            </div>

                                                            <div className="flex items-center justify-between text-sm">
                                                                <span className="text-muted-foreground">
                                                                    Téléchargé le:
                                                                </span>
                                                                <span>
                                                                    {new Date(document.createdAt).toLocaleDateString(
                                                                        "fr-FR",
                                                                    )}
                                                                </span>
                                                            </div>

                                                            <Separator />

                                                            <div className="flex flex-wrap gap-2">
                                                                <Button
                                                                    variant="outline"
                                                                    size="sm"
                                                                    onClick={() => handleView(document.id)}
                                                                    disabled={isViewing}
                                                                    className="flex items-center gap-1"
                                                                >
                                                                    <Eye className="h-4 w-4" />
                                                                    Voir
                                                                </Button>

                                                                <Button
                                                                    variant="outline"
                                                                    size="sm"
                                                                    onClick={() => handleDownload(document.id)}
                                                                    disabled={isDownloading}
                                                                    className="flex items-center gap-1"
                                                                >
                                                                    <Download className="h-4 w-4" />
                                                                    Télécharger
                                                                </Button>

                                                                {canUpload && (
                                                                    <Button
                                                                        size="sm"
                                                                        onClick={() => handleUpload(template)}
                                                                        className="flex items-center gap-1"
                                                                    >
                                                                        <Upload className="h-4 w-4" />
                                                                        Remplacer
                                                                    </Button>
                                                                )}
                                                            </div>

                                                            {(document.status === DocumentStatus.REJECTED ||
                                                                document.status === DocumentStatus.EXPIRED) && (
                                                                <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-md">
                                                                    <p className="text-sm text-yellow-800 dark:text-yellow-200">
                                                                        {document.status === DocumentStatus.REJECTED
                                                                            ? "Ce document a été rejeté. Vous devez télécharger une nouvelle version."
                                                                            : "Ce document a expiré. Vous devez télécharger une nouvelle version."}
                                                                    </p>
                                                                </div>
                                                            )}
                                                        </div>
                                                    ) : (
                                                        <div className="text-center space-y-0.5">
                                                            <div className="text-muted-foreground">
                                                                <FileText className="h-12 w-12 mx-auto mb-1 opacity-50" />
                                                                <p>Aucun document téléchargé</p>
                                                            </div>
                                                            <Button
                                                                onClick={() => handleUpload(template)}
                                                                className="flex items-center gap-2"
                                                            >
                                                                <Upload className="h-4 w-4" />
                                                                Télécharger le document
                                                            </Button>
                                                        </div>
                                                    )}
                                                </CardContent>
                                            </Card>
                                        );
                                    })}
                                </div>
                            )}

                            {templates.length === 0 && !isLoadingTemplates && (
                                <div className="text-center py-12">
                                    <FileText className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                                    <h3 className="text-lg font-semibold mb-2">Aucun document requis</h3>
                                    <p className="text-muted-foreground">
                                        Il n&apos;y a actuellement aucun document requis pour ce camion.
                                    </p>
                                </div>
                            )}
                        </>
                    )}
                </>
            )}

            <UploadTruckDocumentDialog
                template={selectedTemplate}
                open={uploadDialogOpen}
                setOpen={setUploadDialogOpen}
            />
        </div>
    );
}
