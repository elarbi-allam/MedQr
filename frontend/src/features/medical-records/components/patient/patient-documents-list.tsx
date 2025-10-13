// frontend/src/features/medical-records/components/patient/patient-documents-list.tsx
"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Upload, Eye, Download, Activity, FileImage, FileClock, Pill, ChevronLeft, ChevronRight } from "lucide-react";
import {
    usePatientDocuments,
    useViewPatientDocument,
    useDownloadPatientDocument,
} from "../../hooks/use-patient-records";
import { DocumentType, DocumentSource, DocumentDataType } from "../../types/medical-record.types";
import UploadDocumentDialog from "./upload-document-dialog";
import DocumentDetailsDialog from "./document-details-dialog";
import { Skeleton } from "@/components/ui/skeleton";

const getDocumentIcon = (type: DocumentType) => {
    switch (type) {
        case DocumentType.ANALYSIS:
            return <Activity className="h-5 w-5" />;
        case DocumentType.SCAN:
            return <FileImage className="h-5 w-5" />;
        case DocumentType.PRESCRIPTION:
            return <Pill className="h-5 w-5" />;
        case DocumentType.REPORT:
            return <FileClock className="h-5 w-5" />;
        default:
            return <FileText className="h-5 w-5" />;
    }
};

const getSourceBadge = (source: DocumentSource) => {
    switch (source) {
        case DocumentSource.PATIENT:
            return <Badge className="backdrop-blur-md bg-emerald-500/20 text-emerald-800 dark:bg-emerald-300/20 dark:text-emerald-200 border border-emerald-400/30">Patient</Badge>;
        case DocumentSource.PROVIDER:
            return <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">Médecin</Badge>;
        case DocumentSource.FACILITY:
            return (
                <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                    Établissement
                </Badge>
            );
    }
};

export default function PatientDocumentsList() {
    const [uploadOpen, setUploadOpen] = useState(false);
    const [detailsOpen, setDetailsOpen] = useState(false);
    const [selectedDoc, setSelectedDoc] = useState<DocumentDataType | null>(null);
    const [page, setPage] = useState(0);
    const pageSize = 5;

    const { data: documentsData, isLoading } = usePatientDocuments(undefined, page, pageSize);
    const { mutate: viewDocument, isPending: isViewing } = useViewPatientDocument();
    const { mutate: downloadDocument, isPending: isDownloading } = useDownloadPatientDocument();

    const documents = documentsData?.data?.content || [];
    const totalPages = documentsData?.data?.totalPages || 0;
    const totalElements = documentsData?.data?.totalElements || 0;
    const isFirstPage = documentsData?.data?.first ?? true;
    const isLastPage = documentsData?.data?.last ?? true;

    const handleViewDocument = (documentId: string) => {
        console.log("Viewing document:", documentId);
        viewDocument(documentId);
    };

    const handleDownloadDocument = (documentId: string) => {
        console.log("Downloading document:", documentId);
        downloadDocument(documentId);
    };

    const handleShowDetails = (doc: DocumentDataType) => {
        setSelectedDoc(doc);
        setDetailsOpen(true);
    };

    const handlePreviousPage = () => {
        if (page > 0) {
            setPage(page - 1);
        }
    };

    const handleNextPage = () => {
        if (page < totalPages - 1) {
            setPage(page + 1);
        }
    };

    if (isLoading) {
        return (
            <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                    <Card key={i}>
                        <CardHeader>
                            <Skeleton className="h-6 w-1/3" />
                        </CardHeader>
                        <CardContent>
                            <Skeleton className="h-4 w-2/3" />
                        </CardContent>
                    </Card>
                ))}
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold">Mes Documents</h2>
                    <p className="text-muted-foreground">
                        Gérez vos documents médicaux ({totalElements} document{totalElements > 1 ? "s" : ""})
                    </p>
                </div>
                <Button onClick={() => setUploadOpen(true)} className="gap-2">
                    <Upload className="h-4 w-4" />
                    Ajouter un document
                </Button>
            </div>

            {documents.length === 0 ? (
                <Card>
                    <CardContent className="flex flex-col items-center justify-center py-12">
                        <FileText className="h-16 w-16 text-muted-foreground mb-4" />
                        <p className="text-lg font-medium mb-2">Aucun document</p>
                        <p className="text-muted-foreground mb-4">Commencez par ajouter votre premier document</p>
                        <Button onClick={() => setUploadOpen(true)} className="gap-2">
                            <Upload className="h-4 w-4" />
                            Ajouter un document
                        </Button>
                    </CardContent>
                </Card>
            ) : (
                <>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {documents.map((doc: DocumentDataType) => (
                            <Card key={doc.documentId} className="hover:shadow-lg transition-shadow">
                                <CardHeader className="pb-3">
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-primary/10 rounded-lg">{getDocumentIcon(doc.type)}</div>
                                            <div className="flex-1">
                                                <CardTitle className="text-base line-clamp-1">{doc.title}</CardTitle>
                                                <p className="text-xs text-muted-foreground mt-1">
                                                    {new Date(doc.uploadDate).toLocaleDateString("fr-FR")}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-muted-foreground">Source:</span>
                                        {getSourceBadge(doc.source)}
                                    </div>
                                    <div className="flex gap-3">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="flex-1 gap-1"
                                            onClick={() => handleViewDocument(doc.documentId)}
                                            disabled={isViewing}
                                        >
                                            <Eye className="h-3 w-3" />
                                            Voir
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="flex-1 gap-1"
                                            onClick={() => handleDownloadDocument(doc.documentId)}
                                            disabled={isDownloading}
                                        >
                                            <Download className="h-3 w-3" />
                                            Télécharger
                                        </Button>
                                        {doc.type === DocumentType.PRESCRIPTION && (
                                            <Button
                                                variant="primary"
                                                size="sm"
                                                className="flex-1 gap-1"
                                                onClick={() => handleShowDetails(doc)}
                                            >
                                                Détails
                                            </Button>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    {totalPages > 1 && (
                        <div className="flex items-center justify-between">
                            <p className="text-sm text-muted-foreground">
                                Page {page + 1} sur {totalPages}
                            </p>
                            <div className="flex gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={handlePreviousPage}
                                    disabled={isFirstPage}
                                    className="gap-1"
                                >
                                    <ChevronLeft className="h-4 w-4" />
                                    Précédent
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={handleNextPage}
                                    disabled={isLastPage}
                                    className="gap-1"
                                >
                                    Suivant
                                    <ChevronRight className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    )}
                </>
            )}

            <UploadDocumentDialog open={uploadOpen} setOpen={setUploadOpen} />
            <DocumentDetailsDialog document={selectedDoc} open={detailsOpen} setOpen={setDetailsOpen} />
        </div>
    );
}