"use client";

import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { Calendar, Truck, Weight, Hash } from "lucide-react";

import RenderTH from "@/components/render-th";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { TruckDataType } from "../types/truck.type";
import { TruckActions } from "./truck-actions";

// Colonnes pour les camions (carriers)
export const MyTrucksColumns: ColumnDef<TruckDataType>[] = [
  {
    accessorKey: "truck",
    header: () => <RenderTH header="Camion" />,
    size: 300,
    cell: ({ row }) => {
      const truck = row.original;
      return (
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={truck.truckType.icon} alt={truck.truckType.name} />
            <AvatarFallback className="bg-gradient-to-br from-brand to-primary text-brand-foreground">
              <Truck className="h-5 w-5" />
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="font-medium flex items-center gap-2">
              <Hash className="h-4 w-4 text-muted-foreground" />
              {truck.registrationNumber}
            </div>
            <div className="text-sm text-muted-foreground">
              {truck.truckType.name}
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
    accessorKey: "maxWeight",
    header: () => <RenderTH header="Poids Max" />,
    size: 120,
    cell: ({ row }) => {
      const maxWeight = row.original.maxWeight;
      return (
        <Badge variant="outline" className="flex items-center gap-1">
          <Weight className="h-3 w-3" />
          {maxWeight} T
        </Badge>
      );
    },
    enableColumnFilter: false,
  },
  {
    accessorKey: "truckType",
    header: () => <RenderTH header="Type" />,
    size: 200,
    cell: ({ row }) => {
      const truckType = row.original.truckType;
      return (
        <div className="flex items-center gap-2">
          <span className="text-lg">{truckType.icon}</span>
          <span>{truckType.name}</span>
        </div>
      );
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
    size: 80,
    cell: ({ row }) => {
      const truck = row.original;
      return <TruckActions truck={truck} />;
    },
    enableHiding: false,
    enableColumnFilter: false,
  },
];

// Colonnes pour les camions (admin)
export const AdminTrucksColumns: ColumnDef<TruckDataType>[] = [
  {
    accessorKey: "truck",
    header: () => <RenderTH header="Camion" />,
    size: 300,
    cell: ({ row }) => {
      const truck = row.original;
      return (
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={truck.truckType.icon} alt={truck.truckType.name} />
            <AvatarFallback className="bg-gradient-to-br from-brand to-primary text-brand-foreground">
              <Truck className="h-5 w-5" />
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="font-medium flex items-center gap-2">
              <Hash className="h-4 w-4 text-muted-foreground" />
              {truck.registrationNumber}
            </div>
            <div className="text-sm text-muted-foreground">
              {truck.truckType.name}
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
    size: 200,
    cell: ({ row }) => {
      const enterprise = row.original.enterprise;
      if (!enterprise) return <span className="text-muted-foreground">-</span>;
      
      return (
        <div>
          <div className="font-medium">{enterprise.name}</div>
          <div className="text-sm text-muted-foreground">
            ICE: {enterprise.ice}
          </div>
        </div>
      );
    },
    enableColumnFilter: false,
  },
  {
    accessorKey: "maxWeight",
    header: () => <RenderTH header="Poids Max" />,
    size: 120,
    cell: ({ row }) => {
      const maxWeight = row.original.maxWeight;
      return (
        <Badge variant="outline" className="flex items-center gap-1">
          <Weight className="h-3 w-3" />
          {maxWeight} T
        </Badge>
      );
    },
    enableColumnFilter: false,
  },
  {
    accessorKey: "truckType",
    header: () => <RenderTH header="Type" />,
    size: 150,
    cell: ({ row }) => {
      const truckType = row.original.truckType;
      return (
        <div className="flex items-center gap-2">
          <span className="text-lg">{truckType.icon}</span>
          <span>{truckType.name}</span>
        </div>
      );
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
    size: 80,
    cell: ({ row }) => {
      const truck = row.original;
      return <TruckActions truck={truck} isAdmin={true} />;
    },
    enableHiding: false,
    enableColumnFilter: false,
  },
];