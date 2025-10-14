import { z } from "zod";

export const vaccinationSchema = z.object({
    vaccineName: z.string().min(1, "Le nom du vaccin est requis"),
    vaccinationDate: z.string().min(1, "La date de vaccination est requise"),
}).refine((data) => {
    const vaccinationDate = new Date(data.vaccinationDate);
    const today = new Date();
    return vaccinationDate <= today;
}, {
    message: "La date de vaccination ne peut pas être dans le futur",
    path: ["vaccinationDate"],
});

export type VaccinationSchemaType = z.infer<typeof vaccinationSchema>;