"use client";

import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { Calendar, CheckCircle, XCircle, Flag } from "lucide-react";

import RenderTH from "@/components/render-th";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CountryDataType, CountryStatus } from "../types/country.type";
import { AdminCountryActions } from "./admin-country-actions";

const CountryStatusBadge = ({ status }: { status: CountryStatus }) => {
  switch (status) {
    case CountryStatus.ACTIVE:
      return (
        <Badge
          variant="default"
          className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 flex items-center gap-1"
        >
          <CheckCircle className="h-3 w-3" />
          ACTIF
        </Badge>
      );
    case CountryStatus.INACTIVE:
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

export const AdminCountryColumns: ColumnDef<CountryDataType>[] = [
  {
    accessorKey: "country",
    header: () => <RenderTH header="Pays" />,
    size: 300,
    cell: ({ row }) => {
      const country = row.original;
      return (
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={country.flag} alt={country.name} />
            <AvatarFallback className="bg-gradient-to-br from-brand to-primary text-brand-foreground">
              <Flag className="h-4 w-4" />
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="font-medium">{country.name}</div>
            <div className="text-sm text-muted-foreground">
              {country.en_name}
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
    accessorKey: "details",
    header: () => <RenderTH header="Détails" />,
    size: 200,
    cell: ({ row }) => {
      const country = row.original;
      return (
        <div>
          <div className="text-sm font-medium">ISO: {country.isoA3}</div>
          <div className="text-sm text-muted-foreground">
            Code: {country.dialCode}
          </div>
          <div className="text-sm text-muted-foreground">
            Num: {country.isoNum}
          </div>
        </div>
      );
    },
    enableColumnFilter: false,
  },
  {
    accessorKey: "ar_name",
    header: () => <RenderTH header="Nom Arabe" />,
    size: 150,
    cell: ({ row }) => {
      const arName = row.original.ar_name;
      return (
        <div className="text-right font-medium" dir="rtl">
          {arName}
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
      return <CountryStatusBadge status={status} />;
    },
    enableColumnFilter: false,
  },
  {
    accessorKey: "updatedAt",
    header: () => <RenderTH header="Dernière modification" />,
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
      const country = row.original;
      return <AdminCountryActions country={country} />;
    },
    enableHiding: false,
    enableColumnFilter: false,
  },
];
