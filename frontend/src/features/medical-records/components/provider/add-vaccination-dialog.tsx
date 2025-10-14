"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Syringe } from "lucide-react";
import { useAddVaccinationForPatient } from "../../hooks/use-provider-vaccinations";
import { VaccinationFormData } from "../../types/medication-vaccination.types";

type AddVaccinationDialogProps = {
    open: boolean;
    setOpen: (open: boolean) => void;
    patientId: string;
};

export default function AddVaccinationDialog({ open, setOpen, patientId }: AddVaccinationDialogProps) {
    const [formData, setFormData] = useState<VaccinationFormData>({
        vaccineName: "",
        vaccinationDate: "",
    });

    const { mutate: addVaccination, isPending } = useAddVaccinationForPatient(patientId);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        addVaccination(formData, {
            onSuccess: (data) => {
                if (data.status === "SUCCESS") {
                    setOpen(false);
                    setFormData({
                        vaccineName: "",
                        vaccinationDate: "",
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
                        <Syringe className="h-5 w-5" />
                        Ajouter une vaccination
                    </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="vaccineName">Nom du vaccin *</Label>
                        <Input
                            id="vaccineName"
                            value={formData.vaccineName}
                            onChange={(e) => setFormData({ ...formData, vaccineName: e.target.value })}
                            placeholder="Ex: COVID-19 (Pfizer)"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="vaccinationDate">Date de vaccination *</Label>
                        <Input
                            id="vaccinationDate"
                            type="date"
                            value={formData.vaccinationDate}
                            onChange={(e) => setFormData({ ...formData, vaccinationDate: e.target.value })}
                            required
                        />
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