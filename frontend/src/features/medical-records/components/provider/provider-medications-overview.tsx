"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Pill, Search, Users, Calendar } from "lucide-react";
import { useProviderPatients } from "../../hooks/use-provider-records";
import { Skeleton } from "@/components/ui/skeleton";
import { useRouter } from "next/navigation";
import { PatientType } from "../../types/medical-record.types";

export default function ProviderMedicationsOverview() {
    const [searchQuery, setSearchQuery] = useState("");
    const router = useRouter();

    const { data: patientsData, isLoading } = useProviderPatients();
    const patients = patientsData?.data || [];

    const filteredPatients = patients.filter((patient: PatientType) => {
        const searchLower = searchQuery.toLowerCase();
        return (
            patient.firstName.toLowerCase().includes(searchLower) ||
            patient.lastName.toLowerCase().includes(searchLower)
        );
    });

    if (isLoading) {
        return (
            <div className="space-y-4">
                <Skeleton className="h-32 w-full" />
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {[1, 2, 3].map((i) => (
                        <Skeleton key={i} className="h-40 w-full" />
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
                    <h1 className="text-3xl font-bold">Gestion des Médicaments</h1>
                    <p className="text-muted-foreground">
                        Gérez les traitements médicaux de vos patients
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="gap-1">
                        <Users className="h-3 w-3" />
                        {patients.length} patient{patients.length > 1 ? "s" : ""}
                    </Badge>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Total Patients</CardTitle>
                        <Users className="h-4 w-4 text-blue-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{patients.length}</div>
                        <p className="text-xs text-muted-foreground">
                            Patients sous votre supervision
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Médicaments</CardTitle>
                        <Pill className="h-4 w-4 text-green-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">-</div>
                        <p className="text-xs text-muted-foreground">
                            Traitements actifs
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Cette Semaine</CardTitle>
                        <Calendar className="h-4 w-4 text-purple-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">-</div>
                        <p className="text-xs text-muted-foreground">
                            Nouveaux traitements
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Search */}
            <Card>
                <CardHeader>
                    <CardTitle>Rechercher un Patient</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Rechercher par nom ou prénom..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Patients List */}
            <div>
                <h2 className="text-xl font-bold mb-4">
                    {searchQuery ? "Résultats de recherche" : "Tous les Patients"}
                </h2>
                {filteredPatients.length === 0 ? (
                    <Card>
                        <CardContent className="flex flex-col items-center justify-center py-12">
                            <Users className="h-16 w-16 text-muted-foreground mb-4 opacity-50" />
                            <p className="text-lg font-medium mb-2">
                                {searchQuery ? "Aucun patient trouvé" : "Aucun patient"}
                            </p>
                            <p className="text-muted-foreground text-center">
                                {searchQuery
                                    ? "Essayez avec un autre terme de recherche"
                                    : "Vous n'avez pas encore de patients"}
                            </p>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {filteredPatients.map((patient: PatientType) => (
                            <Card
                                key={patient.patientId}
                                className="hover:shadow-lg transition-all cursor-pointer group"
                                onClick={() => router.push(`/provider/patients/${patient.patientId}`)}
                            >
                                <CardHeader className="pb-3">
                                    <div className="flex items-center gap-3">
                                        <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full">
                                            <Users className="h-6 w-6 text-blue-600" />
                                        </div>
                                        <div className="flex-1">
                                            <CardTitle className="text-base group-hover:text-primary transition-colors">
                                                {patient.firstName} {patient.lastName}
                                            </CardTitle>
                                            <p className="text-xs text-muted-foreground mt-1">
                                                Né(e) le {new Date(patient.dateOfBirth).toLocaleDateString("fr-FR")}
                                            </p>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-2">
                                    {patient.phoneNumber && (
                                        <div className="text-sm text-muted-foreground">
                                            {patient.phoneNumber}
                                        </div>
                                    )}
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="w-full gap-2 group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            router.push(`/provider/patients/${patient.patientId}`);
                                        }}
                                    >
                                        <Pill className="h-4 w-4" />
                                        Gérer les médicaments
                                    </Button>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
