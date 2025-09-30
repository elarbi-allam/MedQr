"use client";

import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { Calendar, CheckCircle, XCircle, MapPin, Flag } from "lucide-react";

import RenderTH from "@/components/render-th";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CityDataType, CityStatus } from "../types/city.type";
import { AdminCityActions } from "./admin-city-actions";

const CityStatusBadge = ({ status }: { status: CityStatus }) => {
  switch (status) {
    case CityStatus.ACTIVE:
      return (
        <Badge
          variant="default"
          className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 flex items-center gap-1"
        >
          <CheckCircle className="h-3 w-3" />
          ACTIF
        </Badge>
      );
    case CityStatus.INACTIVE:
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

export const AdminCityColumns: ColumnDef<CityDataType>[] = [
  {
    accessorKey: "city",
    header: () => <RenderTH header="Ville" />,
    size: 240,
    cell: ({ row }) => {
      const city = row.original;
      return (
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={city.country.flag} alt={city.country.name} />
            <AvatarFallback className="bg-gradient-to-br from-brand to-primary text-brand-foreground">
              <MapPin className="h-4 w-4" />
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="font-medium">{city.name}</div>
            <div className="text-sm text-muted-foreground">{city.en_name}</div>
          </div>
        </div>
      );
    },
    enableHiding: false,
    filterFn: "includesString",
    enableColumnFilter: true,
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
    accessorKey: "country",
    header: () => <RenderTH header="Pays" />,
    size: 200,
    cell: ({ row }) => {
      const country = row.original.country;
      return (
        <div className="flex items-center gap-2">
          <Avatar className="h-6 w-6">
            <AvatarImage src={country.flag} alt={country.name} />
            <AvatarFallback>
              <Flag className="h-3 w-3" />
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="font-medium text-sm">{country.name}</div>
            <div className="text-xs text-muted-foreground">{country.isoA3}</div>
          </div>
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
      return <CityStatusBadge status={status} />;
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
      const city = row.original;
      return <AdminCityActions city={city} />;
    },
    enableHiding: false,
    enableColumnFilter: false,
  },
];
