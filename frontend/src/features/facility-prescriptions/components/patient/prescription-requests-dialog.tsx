"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Building2, Clock, DollarSign, Calendar } from "lucide-react";
import { useRequestsForPrescription } from "../../hooks/use-patient-facility";
import { Skeleton } from "@/components/ui/skeleton";
import { 
    FacilityRequestStatus, 
    FacilityPrescriptionRequestResponse 
} from "../../types/facility-prescription.types";
import { PrescriptionType } from "@/features/medical-records/types/medical-record.types";


type PrescriptionRequestsDialogProps = {
    prescription: PrescriptionType | null;
    open: boolean;
    setOpen: (open: boolean) => void;
};

const getStatusBadge = (status: FacilityRequestStatus) => {
    switch (status) {
        case FacilityRequestStatus.PENDING:
            return <Badge variant="secondary">En attente</Badge>;
        case FacilityRequestStatus.APPROVED:
            return (
                <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                    Approuvée
                </Badge>
            );
        case FacilityRequestStatus.REJECTED:
            return <Badge variant="destructive">Rejetée</Badge>;
        default:
            return <Badge variant="outline">Inconnu</Badge>;
    }
};

export default function PrescriptionRequestsDialog({
    prescription,
    open,
    setOpen,
}: PrescriptionRequestsDialogProps) {
    const { data: requestsData, isLoading } = useRequestsForPrescription(prescription?.prescriptionId || "");
    const requests = requestsData?.data || [];

    if (!prescription) return null;

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Building2 className="h-5 w-5" />
                        Demandes des établissements
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-4">
                    <div className="bg-muted p-3 rounded-lg">
                        <p className="text-sm font-medium mb-1">Ordonnance:</p>
                        <p className="text-sm text-muted-foreground whitespace-pre-wrap line-clamp-2">
                            {prescription.details}
                        </p>
                    </div>

                    {isLoading ? (
                        <div className="space-y-3">
                            {[1, 2].map((i) => (
                                <Card key={i}>
                                    <CardContent className="p-4">
                                        <Skeleton className="h-6 w-full" />
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    ) : requests.length === 0 ? (
                        <Card>
                            <CardContent className="flex flex-col items-center justify-center py-8">
                                <Building2 className="h-12 w-12 text-muted-foreground mb-3 opacity-50" />
                                <p className="text-sm font-medium mb-1">Aucune demande</p>
                                <p className="text-sm text-muted-foreground text-center">
                                    Aucun établissement n&apos;a fait de demande pour cette ordonnance
                                </p>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="space-y-3">
                            {requests.map((request: FacilityPrescriptionRequestResponse) => (
                                <Card key={request.requestId}>
                                    <CardContent className="p-4 space-y-3">
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <p className="font-medium">{request.facilityName}</p>
                                                <p className="text-sm text-muted-foreground line-clamp-1">
                                                    {request.prescriptionDetails}
                                                </p>
                                            </div>
                                            {getStatusBadge(request.status)}
                                        </div>
                                        <div className="grid grid-cols-2 gap-2 text-sm">
                                            <div className="flex items-center gap-2 text-muted-foreground">
                                                <Clock className="h-4 w-4" />
                                                <span>{request.estimatedDelay}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-muted-foreground">
                                                <DollarSign className="h-4 w-4" />
                                                <span>{request.estimatedPrice} DH</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                            <Calendar className="h-4 w-4" />
                                            <span>
                                                Demandé le {new Date(request.requestedAt).toLocaleDateString("fr-FR")}
                                            </span>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}