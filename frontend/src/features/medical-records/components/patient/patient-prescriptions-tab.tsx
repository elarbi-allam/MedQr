// frontend/src/features/medical-records/components/patient/patient-prescriptions-tab.tsx
"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Pill, Calendar, Stethoscope, QrCode, Eye, ChevronLeft, ChevronRight, Filter, Building2 } from "lucide-react";
import { usePatientPrescriptions } from "../../hooks/use-patient-records";
import { Skeleton } from "@/components/ui/skeleton";
import GeneratePrescriptionCodeDialog from "@/features/facility-prescriptions/components/patient/generate-prescription-code-dialog";
import PrescriptionRequestsDialog from "@/features/facility-prescriptions/components/patient/prescription-requests-dialog";

export default function PatientPrescriptionsTab() {
    const [page, setPage] = useState(0);
    const [filter, setFilter] = useState<string>("all");
    const [codeDialogOpen, setCodeDialogOpen] = useState(false);
    const [requestsDialogOpen, setRequestsDialogOpen] = useState(false);
    const [selectedPrescription, setSelectedPrescription] = useState<any>(null);
    const pageSize = 10;

    const getFilterValue = (): boolean | null | undefined => {
        if (filter === "completed") return true;
        if (filter === "pending") return false;
        return undefined;
    };

    const { data: prescriptionsData, isLoading } = usePatientPrescriptions(
        getFilterValue(),
        page,
        pageSize
    );

    const prescriptions = prescriptionsData?.data?.content || [];
    const totalPages = prescriptionsData?.data?.totalPages || 0;
    const totalElements = prescriptionsData?.data?.totalElements || 0;
    const isFirstPage = prescriptionsData?.data?.first ?? true;
    const isLastPage = prescriptionsData?.data?.last ?? true;

    const handleGenerateCode = (prescription: any) => {
        setSelectedPrescription(prescription);
        setCodeDialogOpen(true);
    };

    const handleViewRequests = (prescription: any) => {
        setSelectedPrescription(prescription);
        setRequestsDialogOpen(true);
    };

    const handleFilterChange = (value: string) => {
        setFilter(value);
        setPage(0);
    };

    if (isLoading) {
        return (
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
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold">Mes Ordonnances</h2>
                    <p className="text-muted-foreground">
                        Gérez vos ordonnances ({totalElements} ordonnance{totalElements > 1 ? "s" : ""})
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4 text-muted-foreground" />
                    <Select value={filter} onValueChange={handleFilterChange}>
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

            {prescriptions.length === 0 ? (
                <Card>
                    <CardContent className="flex flex-col items-center justify-center py-12">
                        <Pill className="h-16 w-16 text-muted-foreground mb-4 opacity-50" />
                        <p className="text-lg font-medium mb-2">Aucune ordonnance</p>
                        <p className="text-muted-foreground text-center">
                            {filter === "all"
                                ? "Vous n'avez pas encore d'ordonnances"
                                : `Aucune ordonnance ${filter === "completed" ? "complétée" : "en cours"}`}
                        </p>
                    </CardContent>
                </Card>
            ) : (
                <>
                    <div className="space-y-4">
                        {prescriptions.map((prescription: any) => (
                            <Card key={prescription.prescriptionId} className="hover:shadow-lg transition-shadow">
                                <CardHeader>
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                                                <Stethoscope className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                                            </div>
                                            <div>
                                                <CardTitle className="text-base">
                                                    Ordonnance du{" "}
                                                    {new Date(prescription.prescriptionDate).toLocaleDateString("fr-FR")}
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
                                    <div>
                                        <p className="text-sm font-medium mb-2">Détails:</p>
                                        <div className="bg-muted p-3 rounded-md">
                                            <p className="text-sm whitespace-pre-wrap line-clamp-3">
                                                {prescription.details}
                                            </p>
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
                                    <div className="flex gap-2 pt-2">
                                        <Button
                                            variant="default"
                                            size="sm"
                                            className="flex-1 gap-1"
                                            onClick={() => handleGenerateCode(prescription)}
                                        >
                                            <QrCode className="h-3 w-3" />
                                            Code établissement
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="flex-1 gap-1"
                                            onClick={() => handleViewRequests(prescription)}
                                        >
                                            <Building2 className="h-3 w-3" />
                                            Demandes
                                        </Button>
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
                                    onClick={() => setPage(page - 1)}
                                    disabled={isFirstPage}
                                    className="gap-1"
                                >
                                    <ChevronLeft className="h-4 w-4" />
                                    Précédent
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setPage(page + 1)}
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

            <GeneratePrescriptionCodeDialog
                prescription={selectedPrescription}
                open={codeDialogOpen}
                setOpen={setCodeDialogOpen}
            />
            <PrescriptionRequestsDialog
                prescription={selectedPrescription}
                open={requestsDialogOpen}
                setOpen={setRequestsDialogOpen}
            />
        </div>
    );
}