"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Pill } from "lucide-react";
import { useAddMedicationForPatient } from "../../hooks/use-provider-medications";
import { MedicationFormData } from "../../types/medication-vaccination.types";

type AddMedicationDialogProps = {
    open: boolean;
    setOpen: (open: boolean) => void;
    patientId: string;
};

export default function AddMedicationDialog({ open, setOpen, patientId }: AddMedicationDialogProps) {
    const [formData, setFormData] = useState<MedicationFormData>({
        name: "",
        dosage: "",
        frequency: "",
        startDate: "",
        endDate: "",
        isCurrent: true,
    });

    const { mutate: addMedication, isPending } = useAddMedicationForPatient(patientId);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        addMedication(formData, {
            onSuccess: (data) => {
                if (data.status === "SUCCESS") {
                    setOpen(false);
                    setFormData({
                        name: "",
                        dosage: "",
                        frequency: "",
                        startDate: "",
                        endDate: "",
                        isCurrent: true,
                    });
                }
            },
        });
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Pill className="h-5 w-5" />
                        Ajouter un médicament
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
                            {isPending ? "Ajout..." : "Ajouter"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}