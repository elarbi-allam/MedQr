// frontend/src/features/facility-prescriptions/components/facility/prescription-details-dialog.tsx
"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Calendar, User, Stethoscope, Pill } from "lucide-react";
import { useViewPrescriptionDetails } from "../../hooks/use-facility";
import { Skeleton } from "@/components/ui/skeleton";

interface Request {
    requestId: string;
}

type PrescriptionDetailsDialogProps = {
    request: Request | null;
    open: boolean;
    setOpen: (open: boolean) => void;
};

export default function PrescriptionDetailsDialog({ request, open, setOpen }: PrescriptionDetailsDialogProps) {
    const { data: detailsData, isLoading } = useViewPrescriptionDetails(request?.requestId || "");
    const details = detailsData?.data;

    if (!request) return null;

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Pill className="h-5 w-5" />
                        Détails de l&apos;ordonnance
                    </DialogTitle>
                </DialogHeader>

                {isLoading ? (
                    <div className="space-y-4">
                        <Skeleton className="h-6 w-full" />
                        <Skeleton className="h-20 w-full" />
                        <Skeleton className="h-6 w-full" />
                    </div>
                ) : details ? (
                    <div className="space-y-4">
                        <div>
                            <h3 className="font-semibold text-lg">{details.documentTitle}</h3>
                            <Badge className="mt-2">{details.documentType}</Badge>
                        </div>

                        <Separator />

                        <div className="space-y-3">
                            <div className="flex items-center gap-3">
                                <User className="h-4 w-4 text-muted-foreground" />
                                <div>
                                    <p className="text-sm font-medium">Patient</p>
                                    <p className="text-sm text-muted-foreground">
                                        {details.patientFirstName} {details.patientLastName}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        Né(e) le {new Date(details.patientDateOfBirth).toLocaleDateString("fr-FR")}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <Stethoscope className="h-4 w-4 text-muted-foreground" />
                                <div>
                                    <p className="text-sm font-medium">Médecin prescripteur</p>
                                    <p className="text-sm text-muted-foreground">
                                        {details.providerFirstName} {details.providerLastName}
                                    </p>
                                    {details.providerSpecialty && (
                                        <p className="text-xs text-muted-foreground">{details.providerSpecialty}</p>
                                    )}
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                <div>
                                    <p className="text-sm font-medium">Date de prescription</p>
                                    <p className="text-sm text-muted-foreground">
                                        {new Date(details.prescriptionDate).toLocaleDateString("fr-FR")}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <Separator />

                        <div>
                            <p className="text-sm font-medium mb-2">Détails de l&apos;ordonnance:</p>
                            <div className="bg-muted p-3 rounded-md">
                                <p className="text-sm whitespace-pre-wrap">{details.details}</p>
                            </div>
                        </div>

                        {details.isCompleted && (
                            <>
                                <Separator />
                                <div className="flex items-center gap-2">
                                    <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                                        Complétée
                                    </Badge>
                                    {details.completedAt && (
                                        <span className="text-sm text-muted-foreground">
                                            le {new Date(details.completedAt).toLocaleDateString("fr-FR")}
                                        </span>
                                    )}
                                </div>
                            </>
                        )}
                    </div>
                ) : (
                    <p className="text-center text-muted-foreground py-8">Impossible de charger les détails</p>
                )}
            </DialogContent>
        </Dialog>
    );
}