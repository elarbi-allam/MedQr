// frontend/src/features/facility-prescriptions/components/patient/facility-requests-management.tsx
"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Building2, Check, X, Clock, AlertCircle, ChevronLeft, ChevronRight, DollarSign } from "lucide-react";
import {
    useMyPendingFacilityRequests,
    useApproveFacilityRequest,
    useRejectFacilityRequest,
} from "../../hooks/use-patient-facility";
import { Skeleton } from "@/components/ui/skeleton";

export default function FacilityRequestsManagement() {
    const [page, setPage] = useState(0);
    const pageSize = 10;

    const { data: requestsData, isLoading } = useMyPendingFacilityRequests(page, pageSize);
    const { mutate: approveRequest, isPending: isApproving } = useApproveFacilityRequest();
    const { mutate: rejectRequest, isPending: isRejecting } = useRejectFacilityRequest();

    const requests = requestsData?.data?.content || [];
    const totalPages = requestsData?.data?.totalPages || 0;
    const totalElements = requestsData?.data?.totalElements || 0;
    const isFirstPage = requestsData?.data?.first ?? true;
    const isLastPage = requestsData?.data?.last ?? true;

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
            <div>
                <div className="flex items-center gap-2 mb-4">
                    <Building2 className="h-5 w-5" />
                    <h3 className="text-lg font-semibold">Demandes des établissements</h3>
                    {totalElements > 0 && <Badge variant="secondary">{totalElements}</Badge>}
                </div>

                {requests.length === 0 ? (
                    <Card>
                        <CardContent className="flex flex-col items-center justify-center py-12">
                            <Clock className="h-16 w-16 text-muted-foreground mb-4 opacity-50" />
                            <p className="text-lg font-medium mb-2">Aucune demande en attente</p>
                            <p className="text-muted-foreground text-center">
                                Les demandes des établissements apparaîtront ici
                            </p>
                        </CardContent>
                    </Card>
                ) : (
                    <>
                        <div className="grid gap-4 md:grid-cols-2">
                            {requests.map((request: any) => (
                                <Card key={request.requestId} className="border-l-4 border-l-yellow-500">
                                    <CardHeader className="pb-3">
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <CardTitle className="text-base">{request.facilityName}</CardTitle>
                                                <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                                                    {request.prescriptionDetails}
                                                </p>
                                            </div>
                                            <Badge variant="secondary" className="gap-1">
                                                <Clock className="h-3 w-3" />
                                                En attente
                                            </Badge>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="space-y-3">
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
                                            <AlertCircle className="h-4 w-4" />
                                            <span>
                                                Demandé le {new Date(request.requestedAt).toLocaleDateString("fr-FR")}
                                            </span>
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

                        {totalPages > 1 && (
                            <div className="flex items-center justify-between">
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
        </div>
    );
}