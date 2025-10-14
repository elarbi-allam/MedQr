import { z } from "zod";

export const medicationSchema = z.object({
    name: z.string().min(1, "Le nom du médicament est requis"),
    dosage: z.string().min(1, "Le dosage est requis"),
    frequency: z.string().min(1, "La fréquence est requise"),
    startDate: z.string().min(1, "La date de début est requise"),
    endDate: z.string().min(1, "La date de fin est requise"),
    isCurrent: z.boolean(),
}).refine((data) => {
    const start = new Date(data.startDate);
    const end = new Date(data.endDate);
    return end >= start;
}, {
    message: "La date de fin doit être après la date de début",
    path: ["endDate"],
});

export type MedicationSchemaType = z.infer<typeof medicationSchema>;