import { z } from "zod";

// Regex pour valider le format des données
const phoneRegex = /^(06|07)\d{8}$/; // Numéros marocains commençant par 06 ou 07
const nameRegex = /^[a-zA-Zà-üÀ-Ü'-\s]+$/; // Lettres, accents, apostrophes et espaces

// ============================================
// SCHÉMA DE BASE (sans validations complexes)
// ============================================
const baseRegisterSchema = z.object({
    // Champ obligatoire : type d'utilisateur
    userType: z.enum(["PATIENT", "PROVIDER", "FACILITY"], {
        required_error: "Le type de compte est requis.",
    }),

    // Champs optionnels (seront requis conditionnellement)
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    address: z.string().optional(),
    dateOfBirth: z.string().optional(),
    specialty: z.string().optional(),
    licenseNumber: z.string().optional(),
    facilityName: z.string().optional(),
    facilityType: z.string().optional(),

    // Champs obligatoires pour tous
    email: z.string().email("Adresse email invalide."),
    phoneNumber: z.string().regex(phoneRegex, "Le numéro de téléphone doit être valide (ex: 0612345678)."),

    // Mot de passe avec validations strictes
    password: z
        .string()
        .min(8, "Le mot de passe doit contenir au moins 8 caractères.")
        .regex(/[A-Z]/, "Le mot de passe doit contenir au moins une lettre majuscule.")
        .regex(/[a-z]/, "Le mot de passe doit contenir au moins une lettre minuscule.")
        .regex(/\d/, "Le mot de passe doit contenir au moins un chiffre.")
        .regex(/[^A-Za-z0-9]/, "Le mot de passe doit contenir au moins un caractère spécial."),

    confirmPassword: z.string().min(1, "Veuillez confirmer votre mot de passe."),
});

// ============================================
// SCHÉMA POUR LE FORMULAIRE CLIENT
// (avec confirmPassword et toutes les validations)
// ============================================
export const registerSchema = baseRegisterSchema
    // 1. Vérifier que password === confirmPassword
    .refine((data) => data.password === data.confirmPassword, {
        message: "Les mots de passe ne correspondent pas.",
        path: ["confirmPassword"], // L'erreur s'affiche sur le champ confirmPassword
    })
    // 2. Validations conditionnelles selon le userType
    .superRefine((data, ctx) => {
        // --- VALIDATIONS POUR PATIENT ---
        if (data.userType === "PATIENT") {
            // Prénom obligatoire
            if (!data.firstName || data.firstName.length < 2) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: "Le prénom doit contenir au moins 2 caractères.",
                    path: ["firstName"],
                });
            }
            // Prénom doit contenir que des lettres
            if (data.firstName && !nameRegex.test(data.firstName)) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: "Le prénom ne doit contenir que des lettres.",
                    path: ["firstName"],
                });
            }
            // Nom obligatoire
            if (!data.lastName || data.lastName.length < 2) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: "Le nom doit contenir au moins 2 caractères.",
                    path: ["lastName"],
                });
            }
            // Nom doit contenir que des lettres
            if (data.lastName && !nameRegex.test(data.lastName)) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: "Le nom ne doit contenir que des lettres.",
                    path: ["lastName"],
                });
            }
            // Date de naissance obligatoire
            if (!data.dateOfBirth) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: "La date de naissance est requise.",
                    path: ["dateOfBirth"],
                });
            } else {
                // Vérifier l'âge (18-120 ans)
                const birthDate = new Date(data.dateOfBirth);
                const today = new Date();
                const age = today.getFullYear() - birthDate.getFullYear();
                if (age < 18 || age > 120) {
                    ctx.addIssue({
                        code: z.ZodIssueCode.custom,
                        message: "Vous devez avoir au moins 18 ans.",
                        path: ["dateOfBirth"],
                    });
                }
            }
        }

        // --- VALIDATIONS POUR PROVIDER (Professionnel de santé) ---
        if (data.userType === "PROVIDER") {
            // Prénom obligatoire
            if (!data.firstName || data.firstName.length < 2) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: "Le prénom doit contenir au moins 2 caractères.",
                    path: ["firstName"],
                });
            }
            if (data.firstName && !nameRegex.test(data.firstName)) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: "Le prénom ne doit contenir que des lettres.",
                    path: ["firstName"],
                });
            }
            // Nom obligatoire
            if (!data.lastName || data.lastName.length < 2) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: "Le nom doit contenir au moins 2 caractères.",
                    path: ["lastName"],
                });
            }
            if (data.lastName && !nameRegex.test(data.lastName)) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: "Le nom ne doit contenir que des lettres.",
                    path: ["lastName"],
                });
            }
            // Spécialité obligatoire
            if (!data.specialty || data.specialty.length < 2) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: "La spécialité est requise.",
                    path: ["specialty"],
                });
            }
            // Numéro de licence obligatoire
            if (!data.licenseNumber || data.licenseNumber.length < 2) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: "Le numéro de licence est requis.",
                    path: ["licenseNumber"],
                });
            }
        }

        // --- VALIDATIONS POUR FACILITY (Établissement médical) ---
        if (data.userType === "FACILITY") {
            // Nom de l'établissement obligatoire
            if (!data.facilityName || data.facilityName.length < 2) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: "Le nom de l'établissement est requis.",
                    path: ["facilityName"],
                });
            }
            // Type d'établissement obligatoire
            if (!data.facilityType) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: "Le type d'établissement est requis.",
                    path: ["facilityType"],
                });
            }
            // Adresse obligatoire (min 10 caractères)
            if (!data.address || data.address.length < 10) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: "L'adresse est requise (minimum 10 caractères).",
                    path: ["address"],
                });
            }
        }
    });

// ============================================
// SCHÉMA POUR LE SERVEUR
// (sans confirmPassword car déjà vérifié côté client)
// ============================================
export const registerServerSchema = baseRegisterSchema
    // On retire confirmPassword avec .omit()
    .omit({ confirmPassword: true })
    // On applique les MÊMES validations conditionnelles
    .superRefine((data, ctx) => {
        // Copier-coller exactement le même contenu du superRefine ci-dessus
        if (data.userType === "PATIENT") {
            if (!data.firstName || data.firstName.length < 2) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: "Le prénom doit contenir au moins 2 caractères.",
                    path: ["firstName"],
                });
            }
            if (data.firstName && !nameRegex.test(data.firstName)) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: "Le prénom ne doit contenir que des lettres.",
                    path: ["firstName"],
                });
            }
            if (!data.lastName || data.lastName.length < 2) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: "Le nom doit contenir au moins 2 caractères.",
                    path: ["lastName"],
                });
            }
            if (data.lastName && !nameRegex.test(data.lastName)) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: "Le nom ne doit contenir que des lettres.",
                    path: ["lastName"],
                });
            }
            if (!data.dateOfBirth) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: "La date de naissance est requise.",
                    path: ["dateOfBirth"],
                });
            } else {
                const birthDate = new Date(data.dateOfBirth);
                const today = new Date();
                const age = today.getFullYear() - birthDate.getFullYear();
                if (age < 18 || age > 120) {
                    ctx.addIssue({
                        code: z.ZodIssueCode.custom,
                        message: "Vous devez avoir au moins 18 ans.",
                        path: ["dateOfBirth"],
                    });
                }
            }
        }

        if (data.userType === "PROVIDER") {
            if (!data.firstName || data.firstName.length < 2) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: "Le prénom doit contenir au moins 2 caractères.",
                    path: ["firstName"],
                });
            }
            if (data.firstName && !nameRegex.test(data.firstName)) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: "Le prénom ne doit contenir que des lettres.",
                    path: ["firstName"],
                });
            }
            if (!data.lastName || data.lastName.length < 2) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: "Le nom doit contenir au moins 2 caractères.",
                    path: ["lastName"],
                });
            }
            if (data.lastName && !nameRegex.test(data.lastName)) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: "Le nom ne doit contenir que des lettres.",
                    path: ["lastName"],
                });
            }
            if (!data.specialty || data.specialty.length < 2) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: "La spécialité est requise.",
                    path: ["specialty"],
                });
            }
            if (!data.licenseNumber || data.licenseNumber.length < 2) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: "Le numéro de licence est requis.",
                    path: ["licenseNumber"],
                });
            }
        }

        if (data.userType === "FACILITY") {
            if (!data.facilityName || data.facilityName.length < 2) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: "Le nom de l'établissement est requis.",
                    path: ["facilityName"],
                });
            }
            if (!data.facilityType) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: "Le type d'établissement est requis.",
                    path: ["facilityType"],
                });
            }
            if (!data.address || data.address.length < 10) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: "L'adresse est requise (minimum 10 caractères).",
                    path: ["address"],
                });
            }
        }
    });

// Types TypeScript générés automatiquement
export type RegisterFormData = z.infer<typeof registerSchema>; // Pour le formulaire
export type RegisterServerData = z.infer<typeof registerServerSchema>; // Pour le serveur