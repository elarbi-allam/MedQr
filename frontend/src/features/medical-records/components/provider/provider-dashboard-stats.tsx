"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Pill, Syringe, FileText, TrendingUp, Plus } from "lucide-react";
import { useProviderPatients } from "../../hooks/use-provider-records";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";

export default function ProviderDashboardStats() {
    const { data: patientsData, isLoading } = useProviderPatients();
    const patients = patientsData?.data || [];

    if (isLoading) {
        return (
            <div className="space-y-4">
                <Skeleton className="h-32 w-full" />
                <div className="grid gap-4 md:grid-cols-4">
                    {[1, 2, 3, 4].map((i) => (
                        <Skeleton key={i} className="h-32 w-full" />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Tableau de Bord</h1>
                    <p className="text-muted-foreground">Bienvenue sur votre espace médecin</p>
                </div>
                <Link href="/provider/patients">
                    <Button className="gap-2">
                        <Plus className="h-4 w-4" />
                        Ajouter un patient
                    </Button>
                </Link>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-4">
                <Card className="hover:shadow-lg transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Patients</CardTitle>
                        <Users className="h-4 w-4 text-blue-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{patients.length}</div>
                        <p className="text-xs text-muted-foreground">Total sous supervision</p>
                        <Link href="/provider/patients">
                            <Button variant="link" size="sm" className="px-0 mt-2">
                                Voir tout
                            </Button>
                        </Link>
                    </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Médicaments</CardTitle>
                        <Pill className="h-4 w-4 text-green-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">-</div>
                        <p className="text-xs text-muted-foreground">Traitements actifs</p>
                        <Link href="/provider/medications">
                            <Button variant="link" size="sm" className="px-0 mt-2">
                                Gérer
                            </Button>
                        </Link>
                    </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Vaccinations</CardTitle>
                        <Syringe className="h-4 w-4 text-purple-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">-</div>
                        <p className="text-xs text-muted-foreground">Total administrées</p>
                        <Link href="/provider/vaccinations">
                            <Button variant="link" size="sm" className="px-0 mt-2">
                                Gérer
                            </Button>
                        </Link>
                    </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Documents</CardTitle>
                        <FileText className="h-4 w-4 text-orange-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">-</div>
                        <p className="text-xs text-muted-foreground">Documents totaux</p>
                    </CardContent>
                </Card>
            </div>

            {/* Quick Actions */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <TrendingUp className="h-5 w-5" />
                        Actions Rapides
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
                        <Link href="/provider/patients">
                            <Button variant="outline" className="w-full gap-2">
                                <Users className="h-4 w-4" />
                                Voir patients
                            </Button>
                        </Link>
                        <Link href="/provider/medications">
                            <Button variant="outline" className="w-full gap-2">
                                <Pill className="h-4 w-4" />
                                Médicaments
                            </Button>
                        </Link>
                        <Link href="/provider/vaccinations">
                            <Button variant="outline" className="w-full gap-2">
                                <Syringe className="h-4 w-4" />
                                Vaccinations
                            </Button>
                        </Link>
                        <>
                            <Button variant="outline" className="w-full gap-2" disabled>
                                <FileText className="h-4 w-4" />
                                Ordonnances
                            </Button>
                        </>
                    </div>
                </CardContent>
            </Card>

            {/* Recent Patients */}
            {patients.length > 0 && (
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <CardTitle>Patients Récents</CardTitle>
                            <Link href="/provider/patients">
                                <Button variant="link" size="sm">
                                    Voir tout
                                </Button>
                            </Link>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {patients.slice(0, 5).map((patient) => (
                                <Link
                                    key={patient.patientId}
                                    href={`/provider/patients/${patient.patientId}`}
                                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors"
                                >
                                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                        <Users className="h-5 w-5 text-primary" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-medium">
                                            {patient.firstName} {patient.lastName}
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            Né(e) le {new Date(patient.dateOfBirth).toLocaleDateString("fr-FR")}
                                        </p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}