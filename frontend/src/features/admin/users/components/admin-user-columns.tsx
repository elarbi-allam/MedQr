"use client";

import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { Calendar, CheckCircle, XCircle, Clock, UserX } from "lucide-react";

import RenderTH from "@/components/render-th";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AdminUserDataType } from "../types/admin-user.type";
import { AdminUserActions } from "./admin-user-actions";
import { UserRole } from "@/lib/types/user.type";
import { UserStatus } from "@/lib/enums/user-status";

const UserStatusBadge = ({ status }: { status: UserStatus }) => {
  switch (status) {
    case UserStatus.ACTIVE:
      return (
        <Badge
          variant="default"
          className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 flex items-center gap-1"
        >
          <CheckCircle className="h-3 w-3" />
          ACTIF
        </Badge>
      );
    case UserStatus.INACTIVE:
      return (
        <Badge
          variant="destructive"
          className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300 flex items-center gap-1"
        >
          <XCircle className="h-3 w-3" />
          INACTIF
        </Badge>
      );
    case UserStatus.PENDING:
      return (
        <Badge
          variant="secondary"
          className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300 flex items-center gap-1"
        >
          <Clock className="h-3 w-3" />
          EN ATTENTE
        </Badge>
      );
    case UserStatus.ARCHIVE:
      return (
        <Badge
          variant="outline"
          className="bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300 flex items-center gap-1"
        >
          <UserX className="h-3 w-3" />
          ARCHIVÉ
        </Badge>
      );
    default:
      return <Badge variant="secondary">INCONNU</Badge>;
  }
};

const roleLabels = {
  [UserRole.ADMIN]: "Admin",
  [UserRole.ENTERPRISE_USER]: "Entreprise",
  [UserRole.USER]: "Utilisateur",
};

const roleColors = {
  [UserRole.ADMIN]: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
  [UserRole.ENTERPRISE_USER]:
    "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  [UserRole.USER]:
    "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
};

export const AdminUserColumns: ColumnDef<AdminUserDataType>[] = [
  {
    accessorKey: "user",
    header: () => <RenderTH header="Utilisateur" />,
    size: 250,
    cell: ({ row }) => {
      const user = row.original;
      return (
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src="/placeholder.svg" alt={user.firstName} />
            <AvatarFallback className="bg-gradient-to-br from-brand to-primary text-brand-foreground">
              {user.firstName.charAt(0)}
              {user.lastName.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="font-medium">
              {user.firstName} {user.lastName}
            </div>
            <div className="text-sm text-muted-foreground">{user.email}</div>
          </div>
        </div>
      );
    },
    enableHiding: false,
    filterFn: "includesString",
    enableColumnFilter: true,
  },
  {
    accessorKey: "role",
    header: () => <RenderTH header="Rôle" />,
    size: 120,
    cell: ({ row }) => {
      const role = row.original.role;
      return (
        <Badge variant="secondary" className={roleColors[role]}>
          {roleLabels[role]}
        </Badge>
      );
    },
    enableColumnFilter: true,
  },
  {
    accessorKey: "enterprise",
    header: () => <RenderTH header="Entreprise" />,
    size: 270,
    cell: ({ row }) => {
      const enterprise = row.original.enterprise;
      return enterprise ? (
        <div>
          <p className="font-medium">{enterprise.name}</p>
          <p className="text-sm text-muted-foreground">ICE: {enterprise.ice}</p>
        </div>
      ) : (
        <span className="text-muted-foreground">Aucune</span>
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
      return <UserStatusBadge status={status} />;
    },
    enableColumnFilter: false,
  },
  {
    accessorKey: "updatedAt",
    header: () => <RenderTH header="Dernière activité" />,
    size: 160,
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
    size: 160,
    cell: ({ row }) => {
      const user = row.original;
      return <AdminUserActions user={user} />;
    },
    enableHiding: false,
    enableColumnFilter: false,
  },
];
