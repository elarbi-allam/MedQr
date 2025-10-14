"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Syringe, Plus, ChevronLeft, ChevronRight, Building2 } from "lucide-react";
import { usePatientVaccinations } from "../../hooks/use-provider-vaccinations";
import { VaccinationType } from "../../types/medication-vaccination.types";
import { Skeleton } from "@/components/ui/skeleton";
import AddVaccinationDialog from "./add-vaccination-dialog";

type PatientVaccinationsTabProps = {
    patientId: string;
};

export default function PatientVaccinationsTab({ patientId }: PatientVaccinationsTabProps) {
    const [addDialogOpen, setAddDialogOpen] = useState(false);
    const [page, setPage] = useState(0);
    const pageSize = 10;

    const { data: vaccinationsData, isLoading } = usePatientVaccinations(patientId, page, pageSize);

    const vaccinations = vaccinationsData?.data?.content || [];
    const totalPages = vaccinationsData?.data?.totalPages || 0;
    const totalElements = vaccinationsData?.data?.totalElements || 0;
    const isFirstPage = vaccinationsData?.data?.first ?? true;
    const isLastPage = vaccinationsData?.data?.last ?? true;

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
                    <h3 className="text-xl font-bold">Vaccinations</h3>
                    <p className="text-sm text-muted-foreground">
                        {totalElements} vaccination{totalElements > 1 ? "s" : ""}
                    </p>
                </div>
                <Button onClick={() => setAddDialogOpen(true)} className="gap-2">
                    <Plus className="h-4 w-4" />
                    Ajouter une vaccination
                </Button>
            </div>

            {vaccinations.length === 0 ? (
                <Card>
                    <CardContent className="flex flex-col items-center justify-center py-12">
                        <Syringe className="h-16 w-16 text-muted-foreground mb-4 opacity-50" />
                        <p className="text-lg font-medium mb-2">Aucune vaccination</p>
                        <p className="text-muted-foreground mb-4">
                            Commencez par ajouter une vaccination
                        </p>
                        <Button onClick={() => setAddDialogOpen(true)} className="gap-2">
                            <Plus className="h-4 w-4" />
                            Ajouter une vaccination
                        </Button>
                    </CardContent>
                </Card>
            ) : (
                <>
                    <div className="space-y-4">
                        {vaccinations.map((vaccination: VaccinationType) => (
                            <Card key={vaccination.vaccinationId}>
                                <CardHeader className="pb-3">
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-purple-500/10 rounded-lg">
                                                <Syringe className="h-5 w-5 text-purple-600" />
                                            </div>
                                            <div>
                                                <CardTitle className="text-base">{vaccination.vaccineName}</CardTitle>
                                                <p className="text-sm text-muted-foreground mt-1">
                                                    Administré par {vaccination.administeredByName}
                                                </p>
                                            </div>
                                        </div>
                                        <Badge variant="secondary">
                                            {new Date(vaccination.vaccinationDate).toLocaleDateString("fr-FR")}
                                        </Badge>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    {vaccination.facilityName && (
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                            <Building2 className="h-4 w-4" />
                                            <span>{vaccination.facilityName}</span>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    {totalPages > 1 && (
                        <div className="flex items-center justify-between mt-6">
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

            <AddVaccinationDialog open={addDialogOpen} setOpen={setAddDialogOpen} patientId={patientId} />
        </div>
    );
}