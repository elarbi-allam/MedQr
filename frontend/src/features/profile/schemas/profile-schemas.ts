import * as z from "zod";

// Schema commun pour Patient
export const updatePatientProfileSchema = z.object({
  firstName: z
    .string()
    .min(2, "Le prénom doit contenir au moins 2 caractères.")
    .optional(),
  lastName: z
    .string()
    .min(2, "Le nom doit contenir au moins 2 caractères.")
    .optional(),
  dateOfBirth: z.string().optional(), // Format ISO: "YYYY-MM-DD"
  phoneNumber: z
    .string()
    .regex(/^[0-9+\s()-]+$/, "Numéro de téléphone invalide")
    .optional(),
  address: z.string().optional(),
});

// Schema pour Provider
export const updateProviderProfileSchema = z.object({
  firstName: z
    .string()
    .min(2, "Le prénom doit contenir au moins 2 caractères.")
    .optional(),
  lastName: z
    .string()
    .min(2, "Le nom doit contenir au moins 2 caractères.")
    .optional(),
  specialty: z.string().optional(),
  phoneNumber: z
    .string()
    .regex(/^[0-9+\s()-]+$/, "Numéro de téléphone invalide")
    .optional(),
  licenseNumber: z.string().min(3, "Numéro de licence invalide").optional(),
});

// Schema pour Facility
export const updateFacilityProfileSchema = z.object({
  name: z.string().min(2, "Le nom doit contenir au moins 2 caractères.").optional(),
  type: z.string().optional(),
  address: z.string().optional(),
  phoneNumber: z
    .string()
    .regex(/^[0-9+\s()-]+$/, "Numéro de téléphone invalide")
    .optional(),
});

// Schema pour changement de mot de passe (commun à tous)
export const changePasswordSchema = z
  .object({
    currentPassword: z
      .string()
      .min(1, { message: "Le mot de passe actuel est requis." }),
    newPassword: z
      .string()
      .min(8, "Le mot de passe doit contenir au moins 8 caractères."),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Les mots de passe ne correspondent pas.",
    path: ["confirmPassword"],
  });