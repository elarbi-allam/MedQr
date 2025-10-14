"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Pill } from "lucide-react";
import { useUpdateMedication } from "../../hooks/use-provider-medications";
import { MedicationType, MedicationFormData } from "../../types/medication-vaccination.types";

type EditMedicationDialogProps = {
    open: boolean;
    setOpen: (open: boolean) => void;
    medication: MedicationType | null;
};

export default function EditMedicationDialog({ open, setOpen, medication }: EditMedicationDialogProps) {
    const [formData, setFormData] = useState<MedicationFormData>({
        name: "",
        dosage: "",
        frequency: "",
        startDate: "",
        endDate: "",
        isCurrent: true,
    });

    const { mutate: updateMedication, isPending } = useUpdateMedication();

    useEffect(() => {
        if (medication) {
            setFormData({
                name: medication.name,
                dosage: medication.dosage,
                frequency: medication.frequency,
                startDate: medication.startDate,
                endDate: medication.endDate,
                isCurrent: medication.isCurrent,
            });
        }
    }, [medication]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!medication) return;

        updateMedication(
            { medicationId: medication.medicationId, data: formData },
            {
                onSuccess: (data) => {
                    if (data.status === "SUCCESS") {
                        setOpen(false);
                    }
                },
            }
        );
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Pill className="h-5 w-5" />
                        Modifier le médicament
                    </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Nom du médicament *</Label>
                        <Input
                            id="name"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            placeholder="Ex: Paracétamol 500mg"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="dosage">Dosage *</Label>
                        <Input
                            id="dosage"
                            value={formData.dosage}
                            onChange={(e) => setFormData({ ...formData, dosage: e.target.value })}
                            placeholder="Ex: 500mg"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="frequency">Fréquence *</Label>
                        <Input
                            id="frequency"
                            value={formData.frequency}
                            onChange={(e) => setFormData({ ...formData, frequency: e.target.value })}
                            placeholder="Ex: 3 fois par jour"
                            required
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="startDate">Date de début *</Label>
                            <Input
                                id="startDate"
                                type="date"
                                value={formData.startDate}
                                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="endDate">Date de fin *</Label>
                            <Input
                                id="endDate"
                                type="date"
                                value={formData.endDate}
                                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                                required
                            />
                        </div>
                    </div>

                    <div className="flex items-center space-x-2">
                        <Checkbox
                            id="isCurrent"
                            checked={formData.isCurrent}
                            onCheckedChange={(checked) =>
                                setFormData({ ...formData, isCurrent: checked === true })
                            }
                        />
                        <Label htmlFor="isCurrent" className="cursor-pointer">
                            Traitement en cours
                        </Label>
                    </div>

                    <div className="flex justify-end gap-2 pt-4">
                        <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                            Annuler
                        </Button>
                        <Button type="submit" disabled={isPending}>
                            {isPending ? "Modification..." : "Modifier"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}