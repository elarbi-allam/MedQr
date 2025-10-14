"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Pill, Syringe, FileText, TrendingUp } from "lucide-react";
import { useMyMedications } from "../../hooks/use-patient-medications";
import { useMyVaccinations } from "../../hooks/use-patient-vaccinations";
import { usePatientDocuments } from "../../hooks/use-patient-records";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function PatientMedicalSummary() {
    const { data: medicationsData, isLoading: isMedicationsLoading } = useMyMedications(true, 0, 5);
    const { data: vaccinationsData, isLoading: isVaccinationsLoading } = useMyVaccinations(0, 5);
    const { data: documentsData, isLoading: isDocumentsLoading } = usePatientDocuments(undefined, 0, 5);

    const currentMedications = medicationsData?.data?.content || [];
    const recentVaccinations = vaccinationsData?.data?.content || [];
    const recentDocuments = documentsData?.data?.content || [];

    const totalMedications = medicationsData?.data?.totalElements || 0;
    const totalVaccinations = vaccinationsData?.data?.totalElements || 0;
    const totalDocuments = documentsData?.data?.totalElements || 0;

    if (isMedicationsLoading || isVaccinationsLoading || isDocumentsLoading) {
        return (
            <div className="grid gap-4 md:grid-cols-3">
                {[1, 2, 3].map((i) => (
                    <Card key={i}>
                        <CardHeader>
                            <Skeleton className="h-6 w-1/2" />
                        </CardHeader>
                        <CardContent>
                            <Skeleton className="h-10 w-full" />
                        </CardContent>
                    </Card>
                ))}
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold">Aperçu Médical</h2>
                <p className="text-muted-foreground">Résumé de votre dossier médical</p>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                {/* Medications Card */}
                <Card className="hover:shadow-lg transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Médicaments</CardTitle>
                        <Pill className="h-4 w-4 text-blue-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalMedications}</div>
                        <p className="text-xs text-muted-foreground">
                            {currentMedications.length} en cours
                        </p>
                        <Link href="/patient/medications">
                            <Button variant="link" size="sm" className="px-0 mt-2">
                                Voir tout
                            </Button>
                        </Link>
                    </CardContent>
                </Card>

                {/* Vaccinations Card */}
                <Card className="hover:shadow-lg transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Vaccinations</CardTitle>
                        <Syringe className="h-4 w-4 text-purple-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalVaccinations}</div>
                        <p className="text-xs text-muted-foreground">
                            {recentVaccinations.length > 0
                                ? `Dernière: ${new Date(recentVaccinations[0].vaccinationDate).toLocaleDateString("fr-FR")}`
                                : "Aucune vaccination"}
                        </p>
                        <Link href="/patient/vaccinations">
                            <Button variant="link" size="sm" className="px-0 mt-2">
                                Voir tout
                            </Button>
                        </Link>
                    </CardContent>
                </Card>

                {/* Documents Card */}
                <Card className="hover:shadow-lg transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Documents</CardTitle>
                        <FileText className="h-4 w-4 text-green-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalDocuments}</div>
                        <p className="text-xs text-muted-foreground">
                            {recentDocuments.length > 0
                                ? `Dernier: ${new Date(recentDocuments[0].uploadDate).toLocaleDateString("fr-FR")}`
                                : "Aucun document"}
                        </p>
                        <Link href="/patient/medical-record">
                            <Button variant="link" size="sm" className="px-0 mt-2">
                                Voir tout
                            </Button>
                        </Link>
                    </CardContent>
                </Card>
            </div>

            {/* Recent Activity */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <TrendingUp className="h-5 w-5" />
                        Activité Récente
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {currentMedications.length === 0 && recentVaccinations.length === 0 && recentDocuments.length === 0 ? (
                        <p className="text-sm text-muted-foreground text-center py-4">
                            Aucune activité récente
                        </p>
                    ) : (
                        <>
                            {currentMedications.slice(0, 2).map((med) => (
                                <div key={med.medicationId} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                                    <Pill className="h-5 w-5 text-blue-600" />
                                    <div className="flex-1">
                                        <p className="text-sm font-medium">{med.name}</p>
                                        <p className="text-xs text-muted-foreground">{med.frequency}</p>
                                    </div>
                                    <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                                        En cours
                                    </Badge>
                                </div>
                            ))}
                            {recentVaccinations.slice(0, 2).map((vac) => (
                                <div key={vac.vaccinationId} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                                    <Syringe className="h-5 w-5 text-purple-600" />
                                    <div className="flex-1">
                                        <p className="text-sm font-medium">{vac.vaccineName}</p>
                                        <p className="text-xs text-muted-foreground">
                                            {new Date(vac.vaccinationDate).toLocaleDateString("fr-FR")}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}