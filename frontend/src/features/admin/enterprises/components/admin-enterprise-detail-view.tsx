"use client";

import {
  ArrowLeft,
  Building,
  Calendar,
  MapPin,
  User,
  ShieldCheck,
  Loader2,
  XIcon,
  RotateCcwIcon,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  Trash,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import dynamic from "next/dynamic";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { useAdminEnterprise } from "../hooks/use-admin-enterprise";
import {
  EnterpriseStatus,
  EnterpriseType,
} from "../types/enterprise.type";

// Lazy load des dialogs
const DeleteAdminEnterpriseDialog = dynamic(
  () => import("./delete-admin-enterprise-dialog")
);
const ChangeEnterpriseStatusDialog = dynamic(
  () => import("./change-enterprise-status-dialog")
);

const enterpriseTypeLabels = {
  [EnterpriseType.CARRIER]: "Transporteur",
  [EnterpriseType.SHIPPER]: "Expéditeur",
};

const enterpriseTypeColors = {
  [EnterpriseType.CARRIER]:
    "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  [EnterpriseType.SHIPPER]:
    "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
};

const getStatusBadge = (status: EnterpriseStatus) => {
  const statusConfig = {
    [EnterpriseStatus.ACTIVE]: {
      className:
        "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
      icon: <CheckCircle className="h-3 w-3" />,
      label: "ACTIVE",
    },
    [EnterpriseStatus.INACTIVE]: {
      className: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
      icon: <XCircle className="h-3 w-3" />,
      label: "INACTIVE",
    },
    [EnterpriseStatus.PENDING_VERIFICATION]: {
      className:
        "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
      icon: <Clock className="h-3 w-3" />,
      label: "EN ATTENTE",
    },
    [EnterpriseStatus.SUSPENDED]: {
      className:
        "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
      icon: <AlertTriangle className="h-3 w-3" />,
      label: "SUSPENDUE",
    },
    [EnterpriseStatus.REJECTED]: {
      className: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
      icon: <XCircle className="h-3 w-3" />,
      label: "REJETÉE",
    },
    [EnterpriseStatus.INCOMPLETE]: {
      className:
        "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300",
      icon: <AlertTriangle className="h-3 w-3" />,
      label: "INCOMPLÈTE",
    },
    [EnterpriseStatus.DELETED]: {
      className:
        "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300",
      icon: <Trash className="h-3 w-3" />,
      label: "SUPPRIMÉE",
    },
  };

  const config = statusConfig[status] || {
    className: "",
    icon: null,
    label: "INCONNU",
  };

  return (
    <Badge
      variant="default"
      className={`flex items-center gap-1 ${config.className}`}
    >
      {config.icon}
      {config.label}
    </Badge>
  );
};

interface AdminEnterpriseDetailViewProps {
  enterpriseId: string;
}

export default function AdminEnterpriseDetailView({
  enterpriseId,
}: AdminEnterpriseDetailViewProps) {
  const router = useRouter();
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [statusModalOpen, setStatusModalOpen] = useState(false);

  const {
    data: enterpriseResponse,
    isLoading,
    isPending,
    isRefetching,
    refetch,
    error,
  } = useAdminEnterprise(enterpriseId);

  const handleGoBack = () => {
    router.push("/admin/enterprises");
  };

  // Loading state
  if (isLoading || isPending) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="size-8 animate-spin text-brand" />
          <p className="text-muted-foreground">
            Chargement des détails de l&apos;entreprise...
          </p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || enterpriseResponse?.status === "ERROR") {
    return (
      <div className="space-y-8">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            onClick={handleGoBack}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Retour à la liste
          </Button>
        </div>

        <div className="flex items-center justify-between border border-brand/60 bg-brand/10 rounded-lg p-4 text-brand">
          <div className="flex items-center justify-center gap-1">
            {isRefetching ? (
              <>
                <Loader2 className="size-5 animate-spin" />
                Chargement ...
              </>
            ) : (
              <>
                <XIcon className="size-5" />
                Impossible de charger les détails de l&apos;entreprise
              </>
            )}
          </div>

          <Button
            variant="outline"
            className="border-brand bg-brand/20 text-brand hover:bg-brand/30 hover:text-brand has-[>svg]:px-4"
            onClick={() => refetch()}
          >
            <RotateCcwIcon className="size-4" /> Réessayer
          </Button>
        </div>
      </div>
    );
  }

  const enterprise = enterpriseResponse?.data;

  if (!enterprise) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-lg font-medium text-muted-foreground">
            Entreprise non trouvée
          </p>
          <Button
            variant="outline"
            onClick={handleGoBack}
            className="mt-4 flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Retour à la liste
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header avec navigation et actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            onClick={handleGoBack}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Retour à la liste
          </Button>

          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12">
              <AvatarImage
                src={enterprise.logo || undefined}
                alt={enterprise.name}
              />
              <AvatarFallback className="bg-gradient-to-br from-brand to-primary text-brand-foreground">
                {enterprise.name.charAt(0)}
                {enterprise.name.charAt(1) || "E"}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                {enterprise.name}
              </h1>
              <p className="text-muted-foreground">Détails de l&apos;entreprise</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => setStatusModalOpen(true)}
            className="flex items-center gap-2"
          >
            <Edit className="h-4 w-4" />
            Changer le statut
          </Button>

          <Button
            variant="destructive"
            onClick={() => setDeleteModalOpen(true)}
            className="flex items-center gap-2"
          >
            <Trash2 className="h-4 w-4" />
            Supprimer
          </Button>
        </div>
      </div>

      <Separator />

      {/* Contenu principal */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Informations générales */}
        <Card className="glass">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Building className="h-5 w-5" />
              Informations générales
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <span className="text-sm font-medium text-muted-foreground">
                  Nom de l&apos;entreprise
                </span>
                <p className="font-medium">{enterprise.name}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-muted-foreground">
                  Type d&apos;entreprise
                </span>
                <div className="mt-1">
                  <Badge
                    className={enterpriseTypeColors[enterprise.enterpriseType]}
                  >
                    {enterpriseTypeLabels[enterprise.enterpriseType]}
                  </Badge>
                </div>
              </div>
            </div>

            <div>
              <span className="text-sm font-medium text-muted-foreground">
                Description
              </span>
              <p className="mt-1">{enterprise.description}</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <span className="text-sm font-medium text-muted-foreground">
                  Numéro ICE
                </span>
                <p className="font-medium">{enterprise.ice}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-muted-foreground">
                  Registre de commerce
                </span>
                <p className="font-medium">{enterprise.rc}</p>
              </div>
            </div>

            <div>
              <span className="text-sm font-medium text-muted-foreground">
                Statut
              </span>
              <div className="mt-1">{getStatusBadge(enterprise.status)}</div>
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-col justify-between">
          {/* Localisation */}
          <Card className="glass">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <MapPin className="h-5 w-5" />
                Localisation
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-muted-foreground">
                  Ville
                </span>
                <span className="font-medium">{enterprise.city.name}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-muted-foreground">
                  Pays
                </span>
                <span className="font-medium">
                  {enterprise.city.country.name} (
                  {enterprise.city.country.en_name})
                </span>
              </div>
            </CardContent>
          </Card>
          {/* Dates importantes */}
          <Card className="glass">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Calendar className="h-5 w-5" />
                Dates importantes
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-muted-foreground">
                  Date de création
                </span>
                <span className="font-medium">
                  {new Date(enterprise.createdAt).toLocaleDateString("fr-FR", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-muted-foreground">
                  Dernière modification
                </span>
                <span className="font-medium">
                  {new Date(enterprise.updatedAt).toLocaleDateString("fr-FR", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Responsable */}
        <Card className="glass">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <User className="h-5 w-5" />
              Responsable
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-muted-foreground">
                Nom complet
              </span>
              <span className="font-medium">
                {enterprise.responsible.firstName}{" "}
                {enterprise.responsible.lastName}
              </span>
            </div>
            {enterprise.responsible.email && (
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-muted-foreground">
                  Email
                </span>
                <span className="font-medium">
                  {enterprise.responsible.email}
                </span>
              </div>
            )}
          </CardContent>
        </Card>
        {/* Section de vérification (si applicable) */}
        {enterprise.verifiedAt && enterprise.verifiedBy && (
          <Card className="glass border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg text-green-800 dark:text-green-200">
                <ShieldCheck className="h-5 w-5" />
                Informations de vérification
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="font-medium text-green-800 dark:text-green-200">
                  Vérifiée le
                </span>
                <span className="text-green-800 dark:text-green-200">
                  {new Date(enterprise.verifiedAt).toLocaleDateString("fr-FR", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium text-green-800 dark:text-green-200">
                  Vérifiée par
                </span>
                <span className="text-green-800 dark:text-green-200">
                  {enterprise.verifiedBy.firstName}{" "}
                  {enterprise.verifiedBy.lastName}
                </span>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Dialogs */}
      <DeleteAdminEnterpriseDialog
        enterprise={enterprise}
        open={deleteModalOpen}
        setOpen={setDeleteModalOpen}
        redirectAfterDelete={true}
      />
      <ChangeEnterpriseStatusDialog
        enterprise={enterprise}
        open={statusModalOpen}
        setOpen={setStatusModalOpen}
      />
    </div>
  );
}
