"use client";

import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import {
  Calendar,
  CheckCircle,
  XCircle,
  FileText,
  Building2,
  Truck,
} from "lucide-react";

import RenderTH from "@/components/render-th";
import { Badge } from "@/components/ui/badge";
import {
  DocumentTemplateDataType,
  AppliesTo,
  EnterpriseType,
  DocumentTemplateStatus,
} from "../types/document-template.type";
import { DocumentTemplateActions } from "./document-template-actions";

const StatusBadge = ({ status }: { status: DocumentTemplateStatus }) => {
  switch (status) {
    case DocumentTemplateStatus.ACTIVE:
      return (
        <Badge
          variant="default"
          className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 flex items-center gap-1"
        >
          <CheckCircle className="h-3 w-3" />
          ACTIF
        </Badge>
      );
    case DocumentTemplateStatus.INACTIVE:
      return (
        <Badge
          variant="destructive"
          className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300 flex items-center gap-1"
        >
          <XCircle className="h-3 w-3" />
          INACTIF
        </Badge>
      );
    default:
      return <Badge variant="secondary">INCONNU</Badge>;
  }
};

const AppliesToBadge = ({ appliesTo }: { appliesTo: AppliesTo }) => {
  switch (appliesTo) {
    case AppliesTo.ENTERPRISE:
      return (
        <Badge
          variant="secondary"
          className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 flex items-center gap-1"
        >
          <Building2 className="h-3 w-3" />
          ENTREPRISE
        </Badge>
      );
    case AppliesTo.TRUCK:
      return (
        <Badge
          variant="secondary"
          className="bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300 flex items-center gap-1"
        >
          <Truck className="h-3 w-3" />
          CAMION
        </Badge>
      );
    default:
      return <Badge variant="secondary">INCONNU</Badge>;
  }
};

const EnterpriseTypeBadge = ({
  enterpriseType,
}: {
  enterpriseType: EnterpriseType | null;
}) => {
  if (!enterpriseType) {
    return (
      <Badge variant="outline" className="text-muted-foreground">
        TOUS
      </Badge>
    );
  }

  switch (enterpriseType) {
    case EnterpriseType.CARRIER:
      return (
        <Badge
          variant="secondary"
          className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300"
        >
          TRANSPORTEUR
        </Badge>
      );
    case EnterpriseType.SHIPPER:
      return (
        <Badge
          variant="secondary"
          className="bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-300"
        >
          EXPÉDITEUR
        </Badge>
      );
    default:
      return <Badge variant="secondary">INCONNU</Badge>;
  }
};

export const DocumentTemplateColumns: ColumnDef<DocumentTemplateDataType>[] = [
  {
    accessorKey: "template",
    header: () => <RenderTH header="Modèle" />,
    size: 270,
    cell: ({ row }) => {
      const template = row.original;
      return (
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-brand/20 to-primary/20 rounded-lg">
            <FileText className="h-5 w-5 text-brand" />
          </div>
          <div>
            <div className="font-medium">{template.name}</div>
            <div className="text-sm text-muted-foreground">
              {template.fieldname}
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
    accessorKey: "description",
    header: () => <RenderTH header="Description" />,
    size: 300,
    cell: ({ row }) => {
      const description = row.original.description;
      return (
        <div className="max-w-[200px]">
          <p className="text-sm truncate" title={description}>
            {description}
          </p>
        </div>
      );
    },
    enableColumnFilter: false,
  },
  {
    accessorKey: "appliesTo",
    header: () => <RenderTH header="S'applique à" />,
    size: 130,
    cell: ({ row }) => {
      const appliesTo = row.original.appliesTo;
      return <AppliesToBadge appliesTo={appliesTo} />;
    },
    enableColumnFilter: true,
  },
  {
    accessorKey: "enterpriseType",
    header: () => <RenderTH header="Type d'entreprise" />,
    size: 130,
    cell: ({ row }) => {
      const enterpriseType = row.original.enterpriseType;
      return <EnterpriseTypeBadge enterpriseType={enterpriseType} />;
    },
    enableColumnFilter: false,
  },
  {
    accessorKey: "status",
    header: () => <RenderTH header="Statut" />,
    size: 90,
    cell: ({ row }) => {
      const status = row.original.status;
      return <StatusBadge status={status} />;
    },
    enableColumnFilter: false,
  },
  {
    accessorKey: "updatedAt",
    header: () => <RenderTH header="Dernière modification" />,
    size: 120,
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
    size: 40,
    cell: ({ row }) => {
      const template = row.original;
      return <DocumentTemplateActions template={template} />;
    },
    enableHiding: false,
    enableColumnFilter: false,
  },
];
