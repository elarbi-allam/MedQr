// frontend/src/features/medical-records/components/provider/provider-patients-list.tsx
"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, Calendar, Phone, QrCode, KeyRound } from "lucide-react";
import { useProviderPatients } from "../../hooks/use-provider-records";
import { Skeleton } from "@/components/ui/skeleton";
import { useRouter } from "next/navigation";
import RequestAccessDialog from "./request-access-dialog";

export default function ProviderPatientsList() {
    const [accessDialogOpen, setAccessDialogOpen] = useState(false);
    const router = useRouter();

    const { data: patientsData, isLoading } = useProviderPatients();
    const patients = patientsData?.data || [];

    const handleViewPatient = (patientId: string) => {
        router.push(`/provider/patients/${patientId}`);
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
                    <h2 className="text-2xl font-bold">Mes Patients</h2>
                    <p className="text-muted-foreground">Gérez et consultez les dossiers de vos patients</p>
                </div>
                <Button onClick={() => setAccessDialogOpen(true)} className="gap-2">
                    <QrCode className="h-4 w-4" />
                    Ajouter un patient
                </Button>
            </div>

            {patients.length === 0 ? (
                <Card>
                    <CardContent className="flex flex-col items-center justify-center py-12">
                        <Users className="h-16 w-16 text-muted-foreground mb-4 opacity-50" />
                        <p className="text-lg font-medium mb-2">Aucun patient</p>
                        <p className="text-muted-foreground mb-4 text-center">
                            Scannez le code QR d'un patient pour accéder à son dossier
                        </p>
                        <Button onClick={() => setAccessDialogOpen(true)} className="gap-2">
                            <QrCode className="h-4 w-4" />
                            Scanner un code QR
                        </Button>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {patients.map((patient: any) => (
                        <Card
                            key={patient.patientId}
                            className="hover:shadow-lg transition-shadow cursor-pointer"
                            onClick={() => handleViewPatient(patient.patientId)}
                        >
                            <CardHeader className="pb-3">
                                <div className="flex items-center gap-3">
                                    <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full">
                                        <Users className="h-6 w-6 text-blue-600" />
                                    </div>
                                    <div>
                                        <CardTitle className="text-base">
                                            {patient.firstName} {patient.lastName}
                                        </CardTitle>
                                        <Badge variant="secondary" className="mt-1">
                                            Patient
                                        </Badge>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <Calendar className="h-4 w-4" />
                                    <span>Né(e) le {new Date(patient.dateOfBirth).toLocaleDateString("fr-FR")}</span>
                                </div>
                                {patient.phoneNumber && (
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <Phone className="h-4 w-4" />
                                        <span>{patient.phoneNumber}</span>
                                    </div>
                                )}
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="w-full mt-3"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleViewPatient(patient.patientId);
                                    }}
                                >
                                    Voir le dossier
                                </Button>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            <RequestAccessDialog open={accessDialogOpen} setOpen={setAccessDialogOpen} />
        </div>
    );
}
