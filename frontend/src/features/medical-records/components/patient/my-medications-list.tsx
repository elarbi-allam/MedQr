"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Pill, ChevronLeft, ChevronRight } from "lucide-react";
import { useMyMedications } from "../../hooks/use-patient-medications";
import { MedicationType } from "../../types/medication-vaccination.types";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function MyMedicationsList() {
    const [currentOnly, setCurrentOnly] = useState(true);
    const [page, setPage] = useState(0);
    const pageSize = 10;

    const { data: medicationsData, isLoading } = useMyMedications(currentOnly, page, pageSize);

    const medications = medicationsData?.data?.content || [];
    const totalPages = medicationsData?.data?.totalPages || 0;
    const totalElements = medicationsData?.data?.totalElements || 0;
    const isFirstPage = medicationsData?.data?.first ?? true;
    const isLastPage = medicationsData?.data?.last ?? true;

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
                <h2 className="text-2xl font-bold">Mes Médicaments</h2>
                <p className="text-muted-foreground">
                    Consultez vos traitements médicaux ({totalElements} médicament{totalElements > 1 ? "s" : ""})
                </p>
            </div>

            <Tabs value={currentOnly ? "current" : "all"} onValueChange={(v) => setCurrentOnly(v === "current")}>
                <TabsList>
                    <TabsTrigger value="current">Traitements en cours</TabsTrigger>
                    <TabsTrigger value="all">Tous les traitements</TabsTrigger>
                </TabsList>

                <TabsContent value={currentOnly ? "current" : "all"} className="mt-6">
                    {medications.length === 0 ? (
                        <Card>
                            <CardContent className="flex flex-col items-center justify-center py-12">
                                <Pill className="h-16 w-16 text-muted-foreground mb-4 opacity-50" />
                                <p className="text-lg font-medium mb-2">Aucun médicament</p>
                                <p className="text-muted-foreground">
                                    Vous n&apos;avez pas de médicaments {currentOnly ? "en cours" : "enregistrés"}
                                </p>
                            </CardContent>
                        </Card>
                    ) : (
                        <>
                            <div className="grid gap-4 md:grid-cols-2">
                                {medications.map((medication: MedicationType) => (
                                    <Card key={medication.medicationId} className="hover:shadow-lg transition-shadow">
                                        <CardHeader className="pb-3">
                                            <div className="flex items-start justify-between">
                                                <div className="flex items-center gap-3">
                                                    <div className="p-2 bg-blue-500/10 rounded-lg">
                                                        <Pill className="h-5 w-5 text-blue-600" />
                                                    </div>
                                                    <div className="flex-1">
                                                        <CardTitle className="text-base">{medication.name}</CardTitle>
                                                        <p className="text-xs text-muted-foreground mt-1">
                                                            Prescrit par {medication.prescribedByName}
                                                        </p>
                                                    </div>
                                                </div>
                                                {medication.isCurrent && (
                                                    <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                                                        En cours
                                                    </Badge>
                                                )}
                                            </div>
                                        </CardHeader>
                                        <CardContent className="space-y-3">
                                            <div className="grid grid-cols-2 gap-3 text-sm">
                                                <div>
                                                    <span className="text-muted-foreground text-xs">Dosage</span>
                                                    <p className="font-medium">{medication.dosage}</p>
                                                </div>
                                                <div>
                                                    <span className="text-muted-foreground text-xs">Fréquence</span>
                                                    <p className="font-medium">{medication.frequency}</p>
                                                </div>
                                            </div>
                                            <div className="pt-2 border-t">
                                                <div className="flex items-center justify-between text-sm">
                                                    <span className="text-muted-foreground">Période</span>
                                                    <span className="font-medium">
                                                        {new Date(medication.startDate).toLocaleDateString("fr-FR")} -{" "}
                                                        {new Date(medication.endDate).toLocaleDateString("fr-FR")}
                                                    </span>
                                                </div>
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
                </TabsContent>
            </Tabs>
        </div>
    );
}