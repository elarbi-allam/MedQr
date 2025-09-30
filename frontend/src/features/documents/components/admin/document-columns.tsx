"use client";

import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import {
  Calendar,
  FileText,
  Building2,
  Truck,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
} from "lucide-react";

import RenderTH from "@/components/render-th";
import { Badge } from "@/components/ui/badge";
import { DocumentDataType, DocumentStatus } from "../../types/document.type";
import { DocumentActions } from "./document-actions";

const StatusBadge = ({ status }: { status: DocumentStatus }) => {
  switch (status) {
    case DocumentStatus.PENDING:
      return (
        <Badge
          variant="secondary"
          className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300 flex items-center gap-1"
        >
          <Clock className="h-3 w-3" />
          EN ATTENTE
        </Badge>
      );
    case DocumentStatus.ACCEPTED:
      return (
        <Badge
          variant="default"
          className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 flex items-center gap-1"
        >
          <CheckCircle className="h-3 w-3" />
          ACCEPTÉ
        </Badge>
      );
    case DocumentStatus.REJECTED:
      return (
        <Badge
          variant="destructive"
          className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300 flex items-center gap-1"
        >
          <XCircle className="h-3 w-3" />
          REJETÉ
        </Badge>
      );
    case DocumentStatus.EXPIRED:
      return (
        <Badge
          variant="outline"
          className="bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300 flex items-center gap-1 border-gray-300"
        >
          <AlertTriangle className="h-3 w-3" />
          EXPIRÉ
        </Badge>
      );
    default:
      return <Badge variant="secondary">INCONNU</Badge>;
  }
};

const AppliesToBadge = ({ appliesTo }: { appliesTo: string }) => {
  switch (appliesTo) {
    case "ENTERPRISE":
      return (
        <Badge
          variant="secondary"
          className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 flex items-center gap-1"
        >
          <Building2 className="h-3 w-3" />
          ENTREPRISE
        </Badge>
      );
    case "TRUCK":
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

export const AdminDocumentColumns: ColumnDef<DocumentDataType>[] = [
  {
    accessorKey: "document",
    header: () => <RenderTH header="Document" />,
    size: 300,
    cell: ({ row }) => {
      const document = row.original;
      return (
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-brand/20 to-primary/20 rounded-lg">
            <FileText className="h-5 w-5 text-brand" />
          </div>
          <div>
            <div className="font-medium">
              {document.docName || "Document sans nom"}
            </div>
            <div className="text-sm text-muted-foreground">
              {document.documentTemplate?.name || "Modèle non défini"}
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
    accessorKey: "enterprise",
    header: () => <RenderTH header="Entreprise" />,
    size: 150,
    cell: ({ row }) => {
      const enterprise = row.original.enterprise;
      if (!enterprise) {
        return (
          <span className="text-muted-foreground">Entreprise non définie</span>
        );
      }
      return (
        <div>
          <div className="font-medium">
            {enterprise.name || "Nom non défini"}
          </div>
          <div className="text-sm text-muted-foreground">
            {enterprise.enterpriseType === "CARRIER"
              ? "Transporteur"
              : "Expéditeur"}
          </div>
        </div>
      );
    },
    enableColumnFilter: false,
  },
  {
    accessorKey: "appliesTo",
    header: () => <RenderTH header="Type" />,
    size: 85,
    cell: ({ row }) => {
      const appliesTo = row.original.documentTemplate?.appliesTo || "UNKNOWN";
      return <AppliesToBadge appliesTo={appliesTo} />;
    },
    enableColumnFilter: true,
  },
  {
    accessorKey: "status",
    header: () => <RenderTH header="Statut" />,
    size: 75,
    cell: ({ row }) => {
      const status = row.original.status;
      return <StatusBadge status={status} />;
    },
    enableColumnFilter: false,
  },
  {
    accessorKey: "createdAt",
    header: () => <RenderTH header="Date de création" />,
    size: 75,
    cell: ({ row }) => {
      const createdAt = row.original.createdAt;
      return (
        <div className="text-nowrap">
          <span className="flex items-center gap-2">
            <Calendar className="size-4 text-muted-foreground" />
            {createdAt
              ? format(new Date(createdAt), "dd/MM/yyyy")
              : "Date non définie"}
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
    size: 20,
    cell: ({ row }) => {
      const document = row.original;
      return <DocumentActions document={document} />;
    },
    enableHiding: false,
    enableColumnFilter: false,
  },
];
