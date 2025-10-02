import { z } from "zod";

const phoneRegex = /^(06|07)\d{8}$/;
const nameRegex = /^[a-zA-Zà-üÀ-Ü'-\s]+$/;

export const registerSchema = z
    .object({
        // Informations de base communes à tous les types d'utilisateurs
        firstName: z
            .string()
            .min(2, "Le prénom doit contenir au moins 2 caractères.")
            .regex(nameRegex, "Le prénom ne doit contenir que des lettres."),

        lastName: z
            .string()
            .min(2, "Le nom de famille doit contenir au moins 2 caractères.")
            .regex(nameRegex, "Le nom ne doit contenir que des lettres."),

        email: z.string().email("Adresse email invalide."),

        phoneNumber: z.string().regex(phoneRegex, "Le numéro de téléphone doit être valide (ex: 0612345678)."),

        dateOfBirth: z
            .string()
            .min(1, "La date de naissance est requise.")
            .refine((date) => {
                const birthDate = new Date(date);
                const today = new Date();
                const age = today.getFullYear() - birthDate.getFullYear();
                return age >= 18 && age <= 120;
            }, "Vous devez avoir au moins 18 ans."),

        address: z.string().min(10, "L'adresse doit contenir au moins 10 caractères.").optional(),

        // Type de compte: PATIENT, PROVIDER (Médecin), ou FACILITY (Établissement)
        userType: z.enum(["PATIENT", "PROVIDER", "FACILITY"], {
            required_error: "Le type de compte est requis.",
        }),

        // Champs spécifiques pour les professionnels de santé (PROVIDER)
        specialty: z.string().optional(),
        licenseNumber: z.string().optional(),

        // Champs spécifiques pour les établissements médicaux (FACILITY)
        facilityName: z.string().optional(),
        facilityType: z.string().optional(),

        // Mot de passe avec validations strictes
        password: z
            .string()
            .min(8, "Le mot de passe doit contenir au moins 8 caractères.")
            .regex(/[A-Z]/, "Le mot de passe doit contenir au moins une lettre majuscule.")
            .regex(/[a-z]/, "Le mot de passe doit contenir au moins une lettre minuscule.")
            .regex(/\d/, "Le mot de passe doit contenir au moins un chiffre.")
            .regex(/[^A-Za-z0-9]/, "Le mot de passe doit contenir au moins un caractère spécial."),

        confirmPassword: z.string(),
    })
    // Vérification que les mots de passe correspondent
    .refine((data) => data.password === data.confirmPassword, {
        message: "Les mots de passe ne correspondent pas.",
        path: ["confirmPassword"],
    })
    // Validation conditionnelle pour les professionnels de santé
    .refine(
        (data) => {
            if (data.userType === "PROVIDER") {
                return data.specialty && data.specialty.length >= 2 && data.licenseNumber;
            }
            return true;
        },
        {
            message: "La spécialité et le numéro de licence sont requis pour les professionnels de santé.",
            path: ["specialty"],
        },
    )
    // Validation conditionnelle pour les établissements
    .refine(
        (data) => {
            if (data.userType === "FACILITY") {
                return data.facilityName && data.facilityName.length >= 2 && data.facilityType;
            }
            return true;
        },
        {
            message: "Le nom et le type d'établissement sont requis.",
            path: ["facilityName"],
        },
    );

export type RegisterFormData = z.infer<typeof registerSchema>;
