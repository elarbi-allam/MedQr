"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Pill,
    Eye,
    Upload,
    ChevronLeft,
    ChevronRight,
    FileText,
    Clock,
    DollarSign,
} from "lucide-react";
import {
    useMyApprovedRequests,
    useViewPrescriptionDocument,
} from "../../hooks/use-facility";
import { Skeleton } from "@/components/ui/skeleton";
import PrescriptionDetailsDialog from "./prescription-details-dialog";
import UploadResultDialog from "./upload-result-dialog";
import { FacilityPrescriptionRequestResponse } from "../../types/facility-prescription.types";

export default function ApprovedPrescriptionsList() {
    const [page, setPage] = useState(0);
    const [selectedRequest, setSelectedRequest] = useState<FacilityPrescriptionRequestResponse | null>(null);
    const [detailsOpen, setDetailsOpen] = useState(false);
    const [uploadOpen, setUploadOpen] = useState(false);
    const pageSize = 10;

    const { data: requestsData, isLoading } = useMyApprovedRequests(page, pageSize);
    const { mutate: viewDocument, isPending: isViewing } = useViewPrescriptionDocument();

    const requests = requestsData?.data?.content || [];
    const totalPages = requestsData?.data?.totalPages || 0;
    const totalElements = requestsData?.data?.totalElements || 0;
    const isFirstPage = requestsData?.data?.first ?? true;
    const isLastPage = requestsData?.data?.last ?? true;

    const handleViewDocument = (requestId: string) => {
        viewDocument(requestId);
    };

    const handleShowDetails = (request: FacilityPrescriptionRequestResponse) => {
        setSelectedRequest(request);
        setDetailsOpen(true);
    };

    const handleUploadResult = (request: FacilityPrescriptionRequestResponse) => {
        setSelectedRequest(request);
        setUploadOpen(true);
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
                    <h2 className="text-2xl font-bold">Ordonnances Approuvées</h2>
                    <p className="text-muted-foreground">
                        Gérez les ordonnances dont vous avez l&apos;accès ({totalElements} ordonnance
                        {totalElements > 1 ? "s" : ""})
                    </p>
                </div>
            </div>

            {requests.length === 0 ? (
                <Card>
                    <CardContent className="flex flex-col items-center justify-center py-12">
                        <Pill className="h-16 w-16 text-muted-foreground mb-4 opacity-50" />
                        <p className="text-lg font-medium mb-2">Aucune ordonnance approuvée</p>
                        <p className="text-muted-foreground text-center">
                            Les ordonnances approuvées apparaîtront ici
                        </p>
                    </CardContent>
                </Card>
            ) : (
                <>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {requests.map((request: FacilityPrescriptionRequestResponse) => (
                            <Card key={request.requestId} className="hover:shadow-lg transition-shadow">
                                <CardHeader className="pb-3">
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                                                <Pill className="h-5 w-5 text-green-600 dark:text-green-400" />
                                            </div>
                                            <div className="flex-1">
                                                <CardTitle className="text-base line-clamp-1">
                                                    {request.facilityName}
                                                </CardTitle>
                                                <p className="text-xs text-muted-foreground mt-1">
                                                    {new Date(request.requestedAt).toLocaleDateString("fr-FR")}
                                                </p>
                                            </div>
                                        </div>
                                        <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                                            Approuvée
                                        </Badge>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <p className="text-sm text-muted-foreground line-clamp-2">
                                        {request.prescriptionDetails}
                                    </p>
                                    <div className="grid grid-cols-2 gap-2 text-sm">
                                        <div className="flex items-center gap-1 text-muted-foreground">
                                            <Clock className="h-3 w-3" />
                                            <span className="text-xs">{request.estimatedDelay}</span>
                                        </div>
                                        <div className="flex items-center gap-1 text-muted-foreground">
                                            <DollarSign className="h-3 w-3" />
                                            <span className="text-xs">{request.estimatedPrice} DH</span>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="flex-1 gap-1"
                                            onClick={() => handleShowDetails(request)}
                                        >
                                            <Eye className="h-3 w-3" />
                                            Détails
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="flex-1 gap-1"
                                            onClick={() => handleViewDocument(request.requestId)}
                                            disabled={isViewing}
                                        >
                                            <FileText className="h-3 w-3" />
                                            PDF
                                        </Button>
                                    </div>
                                    <Button
                                        variant="default"
                                        size="sm"
                                        className="w-full gap-1"
                                        onClick={() => handleUploadResult(request)}
                                    >
                                        <Upload className="h-3 w-3" />
                                        Ajouter résultat
                                    </Button>
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

            <PrescriptionDetailsDialog
                request={selectedRequest}
                open={detailsOpen}
                setOpen={setDetailsOpen}
            />
            <UploadResultDialog request={selectedRequest} open={uploadOpen} setOpen={setUploadOpen} />
        </div>
    );
}