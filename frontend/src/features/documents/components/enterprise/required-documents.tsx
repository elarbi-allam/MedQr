"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { FileText, Upload, CheckCircle, XCircle, Clock, AlertTriangle, Download, Eye } from "lucide-react";
import { useRequiredDocumentTemplates } from "@/features/document-templates/hooks/use-document-template";
import { DocumentStatus } from "../../types/document.type";
import { useDownloadDocument, useViewDocument } from "../../hooks/use-document";
import UploadDocumentDialog from "./upload-document-dialog";
import { useQueryClient } from "@tanstack/react-query";

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

export default function RequiredDocuments() {
    const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
    const [selectedTemplate, setSelectedTemplate] = useState(null);
    const queryClient = useQueryClient();

    const { data: templatesData, isLoading, refetch } = useRequiredDocumentTemplates();

    const { mutate: downloadDocument, isPending: isDownloading } = useDownloadDocument();
    const { mutate: viewDocument, isPending: isViewing } = useViewDocument();

    const templates = templatesData?.data || [];

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleUpload = (template: any) => {
        setSelectedTemplate(template);
        setUploadDialogOpen(true);
    };

    const handleUploadSuccess = () => {
        // Invalider les données de vérification pour mettre à jour le bouton soumettre
        queryClient.invalidateQueries({
            queryKey: ["verification-status"],
        });
        // Actualiser la liste des documents
        refetch();
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
            return true; // Aucun document, peut uploader
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

    if (isLoading) {
        return (
            <div className="space-y-4">
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
                <h1 className="text-3xl font-bold text-foreground">Mes Documents Requis</h1>
                <p className="text-muted-foreground">Gérez vos documents requis pour votre entreprise</p>
            </div>

            <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
                {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                {templates.map((template: any) => {
                    const document = getDocumentStatus(template);
                    const canUpload = canUploadDocument(template);

                    return (
                        <Card key={template.id} className="relative overflow-hidden py-4">
                            <CardHeader className="pb-4">
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-brand/20 to-primary/20 rounded-lg">
                                            <FileText className="h-6 w-6 text-brand" />
                                        </div>
                                        <div>
                                            <CardTitle className="text-lg">{template.name}</CardTitle>
                                            <p className="text-sm text-muted-foreground">{template.description}</p>
                                        </div>
                                    </div>
                                    {document && getStatusBadge(document.status)}
                                </div>
                            </CardHeader>

                            <CardContent className="space-y-4">
                                {document ? (
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-muted-foreground">Nom du fichier:</span>
                                            <span
                                                className="font-medium truncate max-w-[340px]"
                                                title={document.docName}
                                            >
                                                {document.docName}
                                            </span>
                                        </div>

                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-muted-foreground">Téléchargé le:</span>
                                            <span>{new Date(document.createdAt).toLocaleDateString("fr-FR")}</span>
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
                                    <div className="text-center space-y-2">
                                        <div className="text-muted-foreground">
                                            <FileText className="h-12 w-12 mx-auto mb-2 opacity-50" />
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

            {templates.length === 0 && (
                <div className="text-center py-12">
                    <FileText className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                    <h3 className="text-lg font-semibold mb-2">Aucun document requis</h3>
                    <p className="text-muted-foreground">
                        Il n&apos;y a actuellement aucun document requis pour votre entreprise.
                    </p>
                </div>
            )}

            <UploadDocumentDialog
                template={selectedTemplate}
                open={uploadDialogOpen}
                setOpen={setUploadDialogOpen}
                onSuccess={handleUploadSuccess}
            />
        </div>
    );
}
