// frontend/src/features/facility-prescriptions/components/facility/facility-dashboard.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { QrCode } from "lucide-react";
import ApprovedPrescriptionsList from "./approved-prescriptions-list";
import ScanPrescriptionDialog from "./scan-prescription-dialog";

export default function FacilityDashboard() {
    const [scanDialogOpen, setScanDialogOpen] = useState(false);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Tableau de bord</h1>
                    <p className="text-muted-foreground">Gérez les ordonnances de vos patients</p>
                </div>
                <Button onClick={() => setScanDialogOpen(true)} size="lg" className="gap-2">
                    <QrCode className="h-5 w-5" />
                    Scanner une ordonnance
                </Button>
            </div>

            <ApprovedPrescriptionsList />

            <ScanPrescriptionDialog open={scanDialogOpen} setOpen={setScanDialogOpen} />
        </div>
    );
}