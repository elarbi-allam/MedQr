import {
  ShieldCheck,
  Building,
  User as UserIcon,
  AlertTriangle,
} from "lucide-react";
import { UserRole } from "@/lib/types/user.type";

const roleConfig = {
  [UserRole.ADMIN]: {
    label: "Administrateur",
    message:
      "Vous disposez des pleins pouvoirs et d'un accès total au système.",
    icon: <ShieldCheck className="h-5 w-5 text-green-500" />,
    styleClasses:
      "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  },
  [UserRole.ENTERPRISE_USER]: {
    label: "Compte Entreprise",
    message:
      "Vous êtes rattaché à un compte entreprise avec des fonctionnalités dédiées.",
    icon: <Building className="h-5 w-5 text-blue-500" />,
    styleClasses:
      "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  },
  [UserRole.USER]: {
    label: "Utilisateur",
    message:
      "Vous disposez de permissions de gestion étendues, avec certaines limitations sur les actions critiques.",
    icon: <UserIcon className="h-5 w-5 text-purple-500" />,
    styleClasses:
      "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
  },
  ["default"]: {
    label: "Rôle non défini",
    message:
      "Votre rôle n'a pas pu être identifié. Veuillez contacter le support.",
    icon: <AlertTriangle className="h-5 w-5 text-yellow-500" />,
    styleClasses:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
  },
};

interface RoleDisplayProps {
  role: UserRole | undefined;
}

export function RoleDisplay({ role }: RoleDisplayProps) {
  const config = role ? roleConfig[role] : roleConfig["default"];

  return (
    <div className="flex items-center gap-3 rounded-lg border bg-card p-4 shadow-sm">
      {/* Icône toujours visible */}
      <div className="flex-shrink-0">{config.icon}</div>

      {/* Conteneur pour les textes avec gestion responsive */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:gap-3">
        {/* Titre "Votre Rôle Actuel" - visible sauf sur très petits écrans */}
        <h3 className="hidden xs:block font-semibold text-card-foreground sm:inline">
          Votre Rôle Actuel :
        </h3>

        {/* Label du rôle - toujours visible */}
        <span
          className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${config.styleClasses}`}
        >
          {config.label}
        </span>

        {/* Message de description - visible seulement sur grands écrans */}
        <p className="hidden lg:block text-sm text-muted-foreground mt-1 sm:mt-0">
          {config.message}
        </p>
      </div>
    </div>
  );
}
