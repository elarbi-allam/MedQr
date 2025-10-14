"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Syringe, ChevronLeft, ChevronRight, Building2, Calendar } from "lucide-react";
import { useMyVaccinations } from "../../hooks/use-patient-vaccinations";
import { VaccinationType } from "../../types/medication-vaccination.types";
import { Skeleton } from "@/components/ui/skeleton";

export default function MyVaccinationsList() {
    const [page, setPage] = useState(0);
    const pageSize = 10;

    const { data: vaccinationsData, isLoading } = useMyVaccinations(page, pageSize);

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
            <div>
                <h2 className="text-2xl font-bold">Mes Vaccinations</h2>
                <p className="text-muted-foreground">
                    Historique de vos vaccinations ({totalElements} vaccination{totalElements > 1 ? "s" : ""})
                </p>
            </div>

            {vaccinations.length === 0 ? (
                <Card>
                    <CardContent className="flex flex-col items-center justify-center py-12">
                        <Syringe className="h-16 w-16 text-muted-foreground mb-4 opacity-50" />
                        <p className="text-lg font-medium mb-2">Aucune vaccination</p>
                        <p className="text-muted-foreground">
                            Vous n&apos;avez pas encore de vaccinations enregistrées
                        </p>
                    </CardContent>
                </Card>
            ) : (
                <>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {vaccinations.map((vaccination: VaccinationType) => (
                            <Card key={vaccination.vaccinationId} className="hover:shadow-lg transition-shadow">
                                <CardHeader className="pb-3">
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-purple-500/10 rounded-lg">
                                                <Syringe className="h-5 w-5 text-purple-600" />
                                            </div>
                                            <div className="flex-1">
                                                <CardTitle className="text-base line-clamp-1">
                                                    {vaccination.vaccineName}
                                                </CardTitle>
                                            </div>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <div className="flex items-center gap-2 text-sm">
                                        <Calendar className="h-4 w-4 text-muted-foreground" />
                                        <span className="text-muted-foreground">Date:</span>
                                        <Badge variant="secondary">
                                            {new Date(vaccination.vaccinationDate).toLocaleDateString("fr-FR")}
                                        </Badge>
                                    </div>
                                    <div className="pt-2 border-t space-y-2">
                                        <div className="text-sm">
                                            <span className="text-muted-foreground text-xs">Administré par</span>
                                            <p className="font-medium">{vaccination.administeredByName}</p>
                                        </div>
                                        {vaccination.facilityName && (
                                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                <Building2 className="h-4 w-4" />
                                                <span className="text-xs">{vaccination.facilityName}</span>
                                            </div>
                                        )}
                                    </div>
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
        </div>
    );
}