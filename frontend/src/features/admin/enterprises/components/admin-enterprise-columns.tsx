"use client";

import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import {
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  Trash,
  Shield,
  ShieldCheck,
} from "lucide-react";

import RenderTH from "@/components/render-th";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  EnterpriseDataType,
  EnterpriseStatus,
  EnterpriseType,
} from "../types/enterprise.type";
import { AdminEnterpriseActions } from "./admin-enterprise-actions";

const EnterpriseStatusBadge = ({ status }: { status: EnterpriseStatus }) => {
  switch (status) {
    case EnterpriseStatus.ACTIVE:
      return (
        <Badge
          variant="default"
          className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 flex items-center gap-1"
        >
          <CheckCircle className="h-3 w-3" />
          ACTIVE
        </Badge>
      );
    case EnterpriseStatus.INACTIVE:
      return (
        <Badge
          variant="destructive"
          className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300 flex items-center gap-1"
        >
          <XCircle className="h-3 w-3" />
          INACTIVE
        </Badge>
      );
    case EnterpriseStatus.PENDING_VERIFICATION:
      return (
        <Badge
          variant="secondary"
          className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300 flex items-center gap-1"
        >
          <Clock className="h-3 w-3" />
          EN ATTENTE
        </Badge>
      );
    case EnterpriseStatus.SUSPENDED:
      return (
        <Badge
          variant="destructive"
          className="bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300 flex items-center gap-1"
        >
          <AlertTriangle className="h-3 w-3" />
          SUSPENDUE
        </Badge>
      );
    case EnterpriseStatus.REJECTED:
      return (
        <Badge
          variant="destructive"
          className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300 flex items-center gap-1"
        >
          <XCircle className="h-3 w-3" />
          REJETÉE
        </Badge>
      );
    case EnterpriseStatus.INCOMPLETE:
      return (
        <Badge
          variant="outline"
          className="bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300 flex items-center gap-1"
        >
          <AlertTriangle className="h-3 w-3" />
          INCOMPLÈTE
        </Badge>
      );
    case EnterpriseStatus.DELETED:
      return (
        <Badge
          variant="outline"
          className="bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300 flex items-center gap-1"
        >
          <Trash className="h-3 w-3" />
          SUPPRIMÉE
        </Badge>
      );
    default:
      return <Badge variant="secondary">INCONNU</Badge>;
  }
};

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

export const AdminEnterpriseColumns: ColumnDef<EnterpriseDataType>[] = [
  {
    accessorKey: "enterprise",
    header: () => <RenderTH header="Entreprise" />,
    size: 270,
    cell: ({ row }) => {
      const enterprise = row.original;
      return (
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
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
            <div className="font-medium">{enterprise.name}</div>
            <div className="text-sm text-muted-foreground">
              ICE: {enterprise.ice}
            </div>
            <div className="text-sm text-muted-foreground">
              RC: {enterprise.rc}
            </div>
          </div>
        </div>
      );
    },
    enableHiding: false,
    filterFn: "includesString",
    enableColumnFilter: true,
  },
  {
    accessorKey: "enterpriseType",
    header: () => <RenderTH header="Type" />,
    size: 120,
    cell: ({ row }) => {
      const type = row.original.enterpriseType;
      return (
        <Badge variant="secondary" className={enterpriseTypeColors[type]}>
          {enterpriseTypeLabels[type]}
        </Badge>
      );
    },
    enableColumnFilter: true,
  },
  {
    accessorKey: "city",
    header: () => <RenderTH header="Localisation" />,
    size: 170,
    cell: ({ row }) => {
      const city = row.original.city;
      return (
        <div>
          <p className="font-medium">{city.name}</p>
          <p className="text-sm text-muted-foreground">{city.country.name}</p>
        </div>
      );
    },
    enableColumnFilter: false,
  },
  {
    accessorKey: "responsible",
    header: () => <RenderTH header="Responsable" />,
    size: 200,
    cell: ({ row }) => {
      const responsible = row.original.responsible;
      return (
        <div>
          <p className="font-medium">
            {responsible.firstName} {responsible.lastName}
          </p>
          <p className="text-sm text-muted-foreground">{responsible.email}</p>
        </div>
      );
    },
    enableColumnFilter: false,
  },
  {
    accessorKey: "status",
    header: () => <RenderTH header="Statut" />,
    size: 120,
    cell: ({ row }) => {
      const status = row.original.status;
      return <EnterpriseStatusBadge status={status} />;
    },
    enableColumnFilter: false,
  },
  {
    accessorKey: "verifiedAt",
    header: () => <RenderTH header="Vérification" />,
    size: 130,
    cell: ({ row }) => {
      const { verifiedAt, verifiedBy } = row.original;
      return verifiedAt ? (
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-green-600" />
          <div className="text-sm">
            <div>{format(new Date(verifiedAt), "dd/MM/yyyy")}</div>
            {verifiedBy && (
              <div className="text-xs text-muted-foreground">
                par {verifiedBy.firstName} {verifiedBy.lastName}
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <Shield className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">Non vérifiée</span>
        </div>
      );
    },
    enableHiding: false,
    enableColumnFilter: false,
  },
  {
    accessorKey: "updatedAt",
    header: () => <RenderTH header="Dernière modification" />,
    size: 130,
    cell: ({ row }) => {
      const updatedAt = row.original.updatedAt;
      return (
        <div className="text-nowrap">
          <span className="flex items-center gap-2">
            <Calendar className="size-4 text-muted-foreground" />
            {format(new Date(updatedAt), "dd/MM/yyyy")}
          </span>
        </div>
      );
    },
    enableHiding: false,
    enableColumnFilter: false,
  },
  {
    accessorKey: "actions",
    header: () => {},
    size: 60,
    cell: ({ row }) => {
      const enterprise = row.original;
      return <AdminEnterpriseActions enterprise={enterprise} />;
    },
    enableHiding: false,
    enableColumnFilter: false,
  },
];
