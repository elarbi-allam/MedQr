// frontend/src/features/medical-records/components/patient/access-management.tsx
"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { QrCode, UserPlus, Check, X, Clock, AlertCircle } from "lucide-react";
import {
    usePendingAccessRequests,
    useApproveAccessRequest,
    useRejectAccessRequest,
} from "../../hooks/use-patient-records";
import { AccessRequestType } from "../../types/medical-record.types";
import GenerateQRDialog from "./generate-qr-dialog";
import { Skeleton } from "@/components/ui/skeleton";

export default function AccessManagement() {
    const [qrDialogOpen, setQrDialogOpen] = useState(false);

    const { data: requestsData, isLoading } = usePendingAccessRequests();
    const { mutate: approveRequest, isPending: isApproving } = useApproveAccessRequest();
    const { mutate: rejectRequest, isPending: isRejecting } = useRejectAccessRequest();

    const requests = requestsData?.data || [];

    const handleApprove = (requestId: string) => {
        approveRequest(requestId);
    };

    const handleReject = (requestId: string) => {
        rejectRequest(requestId);
    };

    if (isLoading) {
        return (
            <div className="space-y-4">
                <Card>
                    <CardHeader>
                        <Skeleton className="h-6 w-1/3" />
                    </CardHeader>
                    <CardContent>
                        <Skeleton className="h-10 w-full" />
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <Card className="border-2 border-primary/20">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <QrCode className="h-5 w-5" />
                        Partager mon dossier
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                        Générez un code QR temporaire pour permettre à un médecin d&apos;accéder à votre dossier
                    </p>
                    <Button onClick={() => setQrDialogOpen(true)} className="gap-2 w-full sm:w-auto">
                        <QrCode className="h-4 w-4" />
                        Générer un code QR
                    </Button>
                </CardContent>
            </Card>

            <div>
                <div className="flex items-center gap-2 mb-4">
                    <UserPlus className="h-5 w-5" />
                    <h3 className="text-lg font-semibold">Demandes d&apos;accès en attente</h3>
                    {requests.length > 0 && <Badge variant="secondary">{requests.length}</Badge>}
                </div>

                {requests.length === 0 ? (
                    <Card>
                        <CardContent className="flex flex-col items-center justify-center py-12">
                            <Clock className="h-16 w-16 text-muted-foreground mb-4 opacity-50" />
                            <p className="text-lg font-medium mb-2">Aucune demande en attente</p>
                            <p className="text-muted-foreground text-center">Les demandes d&apos;accès apparaîtront ici</p>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid gap-4 md:grid-cols-2">
                        {requests.map((request: AccessRequestType) => (
                            <Card key={request.requestId} className="border-l-4 border-l-yellow-500">
                                <CardHeader className="pb-3">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <CardTitle className="text-base">{request.providerName}</CardTitle>
                                            {request.providerSpecialty && (
                                                <p className="text-sm text-muted-foreground mt-1">
                                                    {request.providerSpecialty}
                                                </p>
                                            )}
                                        </div>
                                        <Badge variant="secondary" className="gap-1">
                                            <Clock className="h-3 w-3" />
                                            En attente
                                        </Badge>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <AlertCircle className="h-4 w-4" />
                                        <span>
                                            Demande du {new Date(request.requestedAt).toLocaleDateString("fr-FR")}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <Clock className="h-4 w-4" />
                                        <span>Expire le {new Date(request.expiresAt).toLocaleDateString("fr-FR")}</span>
                                    </div>
                                    <div className="flex gap-2 pt-2">
                                        <Button
                                            variant="default"
                                            size="sm"
                                            className="flex-1 gap-1"
                                            onClick={() => handleApprove(request.requestId)}
                                            disabled={isApproving || isRejecting}
                                        >
                                            <Check className="h-3 w-3" />
                                            Approuver
                                        </Button>
                                        <Button
                                            variant="destructive"
                                            size="sm"
                                            className="flex-1 gap-1"
                                            onClick={() => handleReject(request.requestId)}
                                            disabled={isApproving || isRejecting}
                                        >
                                            <X className="h-3 w-3" />
                                            Rejeter
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>

            <GenerateQRDialog open={qrDialogOpen} setOpen={setQrDialogOpen} />
        </div>
    );
}
