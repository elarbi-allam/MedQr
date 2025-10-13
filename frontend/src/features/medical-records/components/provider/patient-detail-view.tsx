// frontend/src/features/medical-records/components/provider/patient-detail-view.tsx
"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
    FileText,
    Eye,
    Download,
    Plus,
    Activity,
    FileImage,
    FileClock,
    Pill,
    Calendar,
    User,
    Stethoscope,
    ChevronLeft,
    ChevronRight,
    Filter,
} from "lucide-react";
import {
    usePatientDocumentsAsProvider,
    usePatientPrescriptions,
    useViewProviderPatientDocument,
    useDownloadProviderPatientDocument,
} from "../../hooks/use-provider-records";
import { DocumentDataType, DocumentType, PatientType, PrescriptionType } from "../../types/medical-record.types";
import { Skeleton } from "@/components/ui/skeleton";
import CreatePrescriptionDialog from "./create-prescription-dialog";

type PatientDetailViewProps = {
    patient: PatientType;
};

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

export default function PatientDetailView({ patient }: PatientDetailViewProps) {
    const [prescriptionDialogOpen, setPrescriptionDialogOpen] = useState(false);
    const [documentsPage, setDocumentsPage] = useState(0);
    const [prescriptionsPage, setPrescriptionsPage] = useState(0);
    const [prescriptionFilter, setPrescriptionFilter] = useState<string>("all");
    const documentsPageSize = 5;
    const prescriptionsPageSize = 5;

    const getFilterValue = (): boolean | null | undefined => {
        if (prescriptionFilter === "completed") return true;
        if (prescriptionFilter === "pending") return false;
        return undefined;
    };

    const { data: documentsData, isLoading: loadingDocuments } = usePatientDocumentsAsProvider(
        patient.patientId,
        documentsPage,
        documentsPageSize
    );
    const { data: prescriptionsData, isLoading: loadingPrescriptions } = usePatientPrescriptions(
        patient.patientId,
        getFilterValue(),
        prescriptionsPage,
        prescriptionsPageSize
    );
    const { mutate: viewDocument, isPending: isViewing } = useViewProviderPatientDocument();
    const { mutate: downloadDocument, isPending: isDownloading } = useDownloadProviderPatientDocument();

    const documents = documentsData?.data?.content || [];
    const documentsTotalPages = documentsData?.data?.totalPages || 0;
    const documentsIsFirstPage = documentsData?.data?.first ?? true;
    const documentsIsLastPage = documentsData?.data?.last ?? true;

    const prescriptions = prescriptionsData?.data?.content || [];
    const prescriptionsTotalPages = prescriptionsData?.data?.totalPages || 0;
    const prescriptionsIsFirstPage = prescriptionsData?.data?.first ?? true;
    const prescriptionsIsLastPage = prescriptionsData?.data?.last ?? true;
    const prescriptionsTotalElements = prescriptionsData?.data?.totalElements || 0;

    const handleViewDocument = (documentId: string) => {
        console.log("Viewing document:", { patientId: patient.patientId, documentId });
        viewDocument({ patientId: patient.patientId, documentId });
    };

    const handleDownloadDocument = (documentId: string) => {
        console.log("Downloading document:", { patientId: patient.patientId, documentId });
        downloadDocument({ patientId: patient.patientId, documentId });
    };

    const handleFilterChange = (value: string) => {
        setPrescriptionFilter(value);
        setPrescriptionsPage(0);
    };

    return (
        <div className="space-y-6">
            <Card className="border-2 border-primary/20">
                <CardHeader>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full">
                            <User className="h-8 w-8 text-blue-600" />
                        </div>
                        <div className="flex-1">
                            <CardTitle className="text-2xl">
                                {patient.firstName} {patient.lastName}
                            </CardTitle>
                            <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                                <div className="flex items-center gap-1">
                                    <Calendar className="h-4 w-4" />
                                    <span>Né(e) le {new Date(patient.dateOfBirth).toLocaleDateString("fr-FR")}</span>
                                </div>
                                {patient.phoneNumber && (
                                    <div className="flex items-center gap-1">
                                        <span>📞 {patient.phoneNumber}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                        <Button onClick={() => setPrescriptionDialogOpen(true)} className="gap-2">
                            <Plus className="h-4 w-4" />
                            Créer une ordonnance
                        </Button>
                    </div>
                </CardHeader>
            </Card>

            <Tabs defaultValue="documents" className="space-y-4">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="documents" className="gap-2">
                        <FileText className="h-4 w-4" />
                        Documents ({documentsData?.data?.totalElements || 0})
                    </TabsTrigger>
                    <TabsTrigger value="prescriptions" className="gap-2">
                        <Pill className="h-4 w-4" />
                        Ordonnances ({prescriptionsTotalElements})
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="documents" className="space-y-4">
                    {loadingDocuments ? (
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
                    ) : documents.length === 0 ? (
                        <Card>
                            <CardContent className="flex flex-col items-center justify-center py-12">
                                <FileText className="h-16 w-16 text-muted-foreground mb-4 opacity-50" />
                                <p className="text-lg font-medium mb-2">Aucun document</p>
                                <p className="text-muted-foreground">Ce patient n&apos;a pas encore de documents</p>
                            </CardContent>
                        </Card>
                    ) : (
                        <>
                            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                {documents.map((doc: DocumentDataType) => (
                                    <Card key={doc.documentId} className="hover:shadow-lg transition-shadow">
                                        <CardHeader className="pb-3">
                                            <div className="flex items-start gap-3">
                                                <div className="p-2 bg-primary/10 rounded-lg">
                                                    {getDocumentIcon(doc.type)}
                                                </div>
                                                <div className="flex-1">
                                                    <CardTitle className="text-base line-clamp-2">{doc.title}</CardTitle>
                                                    <p className="text-xs text-muted-foreground mt-1">
                                                        {new Date(doc.uploadDate).toLocaleDateString("fr-FR")}
                                                    </p>
                                                </div>
                                            </div>
                                        </CardHeader>
                                        <CardContent className="space-y-2">
                                            <div className="flex items-center justify-between text-sm">
                                                <span className="text-muted-foreground">Type:</span>
                                                <Badge variant="secondary">{doc.type}</Badge>
                                            </div>
                                            <div className="flex gap-2">
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
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>

                            {documentsTotalPages > 1 && (
                                <div className="flex items-center justify-between">
                                    <p className="text-sm text-muted-foreground">
                                        Page {documentsPage + 1} sur {documentsTotalPages}
                                    </p>
                                    <div className="flex gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setDocumentsPage(documentsPage - 1)}
                                            disabled={documentsIsFirstPage}
                                            className="gap-1"
                                        >
                                            <ChevronLeft className="h-4 w-4" />
                                            Précédent
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setDocumentsPage(documentsPage + 1)}
                                            disabled={documentsIsLastPage}
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
                </TabsContent>

                <TabsContent value="prescriptions" className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Filter className="h-4 w-4 text-muted-foreground" />
                            <Select value={prescriptionFilter} onValueChange={handleFilterChange}>
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Toutes</SelectItem>
                                    <SelectItem value="pending">En cours</SelectItem>
                                    <SelectItem value="completed">Complétées</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {loadingPrescriptions ? (
                        <div className="space-y-4">
                            {[1, 2].map((i) => (
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
                    ) : prescriptions.length === 0 ? (
                        <Card>
                            <CardContent className="flex flex-col items-center justify-center py-12">
                                <Pill className="h-16 w-16 text-muted-foreground mb-4 opacity-50" />
                                <p className="text-lg font-medium mb-2">Aucune ordonnance</p>
                                <p className="text-muted-foreground mb-4">
                                    {prescriptionFilter === "all" 
                                        ? "Créez la première ordonnance pour ce patient" 
                                        : `Aucune ordonnance ${prescriptionFilter === "completed" ? "complétée" : "en cours"}`}
                                </p>
                                {prescriptionFilter === "all" && (
                                    <Button onClick={() => setPrescriptionDialogOpen(true)} className="gap-2">
                                        <Plus className="h-4 w-4" />
                                        Créer une ordonnance
                                    </Button>
                                )}
                            </CardContent>
                        </Card>
                    ) : (
                        <>
                            <div className="space-y-4">
                                {prescriptions.map((prescription: PrescriptionType) => (
                                    <Card key={prescription.prescriptionId}>
                                        <CardHeader>
                                            <div className="flex items-start justify-between">
                                                <div className="flex items-center gap-3">
                                                    <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                                                        <Stethoscope className="h-5 w-5 text-green-600 dark:text-green-400" />
                                                    </div>
                                                    <div>
                                                        <CardTitle className="text-base">
                                                            Ordonnance du{" "}
                                                            {new Date(prescription.prescriptionDate).toLocaleDateString(
                                                                "fr-FR",
                                                            )}
                                                        </CardTitle>
                                                        <p className="text-sm text-muted-foreground mt-1">
                                                            {prescription.isCompleted === true 
                                                                ? "Complétée" 
                                                                : prescription.isCompleted === false 
                                                                ? "En cours" 
                                                                : "Statut inconnu"}
                                                        </p>
                                                    </div>
                                                </div>
                                                {prescription.isCompleted === true ? (
                                                    <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                                                        Complétée
                                                    </Badge>
                                                ) : prescription.isCompleted === false ? (
                                                    <Badge variant="secondary">En cours</Badge>
                                                ) : (
                                                    <Badge variant="outline">Statut inconnu</Badge>
                                                )}
                                            </div>
                                        </CardHeader>
                                        <CardContent className="space-y-3">
                                            <Separator />
                                            <div>
                                                <p className="text-sm font-medium mb-2">Détails:</p>
                                                <div className="bg-muted p-3 rounded-md">
                                                    <p className="text-sm whitespace-pre-wrap">{prescription.details}</p>
                                                </div>
                                            </div>
                                            {prescription.completedAt && (
                                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                    <Calendar className="h-4 w-4" />
                                                    <span>
                                                        Complétée le{" "}
                                                        {new Date(prescription.completedAt).toLocaleDateString("fr-FR")}
                                                    </span>
                                                </div>
                                            )}
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>

                            {prescriptionsTotalPages > 1 && (
                                <div className="flex items-center justify-between">
                                    <p className="text-sm text-muted-foreground">
                                        Page {prescriptionsPage + 1} sur {prescriptionsTotalPages}
                                    </p>
                                    <div className="flex gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setPrescriptionsPage(prescriptionsPage - 1)}
                                            disabled={prescriptionsIsFirstPage}
                                            className="gap-1"
                                        >
                                            <ChevronLeft className="h-4 w-4" />
                                            Précédent
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setPrescriptionsPage(prescriptionsPage + 1)}
                                            disabled={prescriptionsIsLastPage}
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
                </TabsContent>
            </Tabs>

            <CreatePrescriptionDialog
                patient={patient}
                open={prescriptionDialogOpen}
                setOpen={setPrescriptionDialogOpen}
            />
        </div>
    );
}