import * as z from "zod";

const nameRegex = /^[a-zA-Zà-üÀ-Ü'-\s]+$/;
const phoneRegex = /^(06|07)\d{8}$/;
export const updateProfileSchema = z.object({
  firstName: z
    .string()
    .min(2, "Le prénom doit contenir au moins 2 caractères.")
    .regex(nameRegex, "Le prénom ne doit contenir que des lettres."),
  lastName: z
    .string()
    .min(2, "Le nom de famille doit contenir au moins 2 caractères.")
    .regex(nameRegex, "Le nom ne doit contenir que des lettres."),
  phoneNumber: z
    .string()
    .regex(
      phoneRegex,
      "Le numéro de téléphone doit être valide (ex: 0612345678)."
    ),
});

export const updateProfileImageSchema = z.object({
  profile: z.string().min(1, "L'image de profil est requise."),
});

export const changePasswordSchema = z
  .object({
    currentPassword: z
      .string()
      .min(1, { message: "Le mot de passe actuel est requis." }),
    newPassword: z
      .string()
      .min(8, "Le mot de passe doit contenir au moins 8 caractères.")
      .regex(
        /[A-Z]/,
        "Le mot de passe doit contenir au moins une lettre majuscule."
      )
      .regex(
        /[a-z]/,
        "Le mot de passe doit contenir au moins une lettre minuscule."
      )
      .regex(/\d/, "Le mot de passe doit contenir au moins un chiffre.")
      .regex(
        /[^A-Za-z0-9]/,
        "Le mot de passe doit contenir au moins un caractère spécial."
      ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Les mots de passe ne correspondent pas.",
    path: ["confirmPassword"],
  });
