"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Pill, Plus, ChevronLeft, ChevronRight, Edit } from "lucide-react";
import { usePatientMedications } from "../../hooks/use-provider-medications";
import { MedicationType } from "../../types/medication-vaccination.types";
import { Skeleton } from "@/components/ui/skeleton";
import AddMedicationDialog from "./add-medication-dialog";
import EditMedicationDialog from "./edit-medication-dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type PatientMedicationsTabProps = {
    patientId: string;
};

export default function PatientMedicationsTab({ patientId }: PatientMedicationsTabProps) {
    const [addDialogOpen, setAddDialogOpen] = useState(false);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [selectedMedication, setSelectedMedication] = useState<MedicationType | null>(null);
    const [currentOnly, setCurrentOnly] = useState(true);
    const [page, setPage] = useState(0);
    const pageSize = 10;

    const { data: medicationsData, isLoading } = usePatientMedications(patientId, currentOnly, page, pageSize);

    const medications = medicationsData?.data?.content || [];
    const totalPages = medicationsData?.data?.totalPages || 0;
    const totalElements = medicationsData?.data?.totalElements || 0;
    const isFirstPage = medicationsData?.data?.first ?? true;
    const isLastPage = medicationsData?.data?.last ?? true;

    const handleEditMedication = (medication: MedicationType) => {
        setSelectedMedication(medication);
        setEditDialogOpen(true);
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
                    <h3 className="text-xl font-bold">Médicaments</h3>
                    <p className="text-sm text-muted-foreground">
                        {totalElements} médicament{totalElements > 1 ? "s" : ""}
                    </p>
                </div>
                <Button onClick={() => setAddDialogOpen(true)} className="gap-2">
                    <Plus className="h-4 w-4" />
                    Ajouter un médicament
                </Button>
            </div>

            <Tabs value={currentOnly ? "current" : "all"} onValueChange={(v) => setCurrentOnly(v === "current")}>
                <TabsList>
                    <TabsTrigger value="current">En cours</TabsTrigger>
                    <TabsTrigger value="all">Tous</TabsTrigger>
                </TabsList>

                <TabsContent value={currentOnly ? "current" : "all"} className="mt-6">
                    {medications.length === 0 ? (
                        <Card>
                            <CardContent className="flex flex-col items-center justify-center py-12">
                                <Pill className="h-16 w-16 text-muted-foreground mb-4 opacity-50" />
                                <p className="text-lg font-medium mb-2">Aucun médicament</p>
                                <p className="text-muted-foreground mb-4">
                                    Commencez par ajouter un médicament
                                </p>
                                <Button onClick={() => setAddDialogOpen(true)} className="gap-2">
                                    <Plus className="h-4 w-4" />
                                    Ajouter un médicament
                                </Button>
                            </CardContent>
                        </Card>
                    ) : (
                        <>
                            <div className="space-y-4">
                                {medications.map((medication: MedicationType) => (
                                    <Card key={medication.medicationId}>
                                        <CardHeader className="pb-3">
                                            <div className="flex items-start justify-between">
                                                <div className="flex items-center gap-3">
                                                    <div className="p-2 bg-blue-500/10 rounded-lg">
                                                        <Pill className="h-5 w-5 text-blue-600" />
                                                    </div>
                                                    <div>
                                                        <CardTitle className="text-base">{medication.name}</CardTitle>
                                                        <p className="text-sm text-muted-foreground mt-1">
                                                            Prescrit par {medication.prescribedByName}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    {medication.isCurrent && (
                                                        <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                                                            En cours
                                                        </Badge>
                                                    )}
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => handleEditMedication(medication)}
                                                        className="gap-1"
                                                    >
                                                        <Edit className="h-4 w-4" />
                                                        Modifier
                                                    </Button>
                                                </div>
                                            </div>
                                        </CardHeader>
                                        <CardContent className="space-y-2">
                                            <div className="grid grid-cols-2 gap-4 text-sm">
                                                <div>
                                                    <span className="text-muted-foreground">Dosage:</span>
                                                    <p className="font-medium">{medication.dosage}</p>
                                                </div>
                                                <div>
                                                    <span className="text-muted-foreground">Fréquence:</span>
                                                    <p className="font-medium">{medication.frequency}</p>
                                                </div>
                                                <div>
                                                    <span className="text-muted-foreground">Date de début:</span>
                                                    <p className="font-medium">
                                                        {new Date(medication.startDate).toLocaleDateString("fr-FR")}
                                                    </p>
                                                </div>
                                                <div>
                                                    <span className="text-muted-foreground">Date de fin:</span>
                                                    <p className="font-medium">
                                                        {new Date(medication.endDate).toLocaleDateString("fr-FR")}
                                                    </p>
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

            <AddMedicationDialog open={addDialogOpen} setOpen={setAddDialogOpen} patientId={patientId} />
            <EditMedicationDialog 
                open={editDialogOpen} 
                setOpen={setEditDialogOpen} 
                medication={selectedMedication} 
            />
        </div>
    );
}