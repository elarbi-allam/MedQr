"use client";

import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { Calendar, CheckCircle, XCircle, Clock, Package, DollarSign, Truck, AlertTriangle, Ban } from "lucide-react";

import RenderTH from "@/components/render-th";
import { Badge } from "@/components/ui/badge";
import { ShipmentOfferDataType, ShipmentOfferStatus } from "../../types/shipment-offer.type";
import { ShipmentOfferActions } from "./shipment-offer-actions";

const StatusBadge = ({ status }: { status: ShipmentOfferStatus }) => {
    switch (status) {
        case ShipmentOfferStatus.PENDING:
            return (
                <Badge
                    variant="secondary"
                    className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300 flex items-center gap-1"
                >
                    <Clock className="h-3 w-3" />
                    EN ATTENTE
                </Badge>
            );
        case ShipmentOfferStatus.ACCEPTED:
            return (
                <Badge
                    variant="default"
                    className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 flex items-center gap-1"
                >
                    <CheckCircle className="h-3 w-3" />
                    ACCEPTÉ
                </Badge>
            );
        case ShipmentOfferStatus.REJECTED:
            return (
                <Badge
                    variant="destructive"
                    className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300 flex items-center gap-1"
                >
                    <XCircle className="h-3 w-3" />
                    REJETÉ
                </Badge>
            );
        case ShipmentOfferStatus.EXPIRED:
            return (
                <Badge
                    variant="secondary"
                    className="bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300 flex items-center gap-1"
                >
                    <AlertTriangle className="h-3 w-3" />
                    EXPIRÉ
                </Badge>
            );
        case ShipmentOfferStatus.CANCELLED:
            return (
                <Badge
                    variant="outline"
                    className="bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300 flex items-center gap-1"
                >
                    <Ban className="h-3 w-3" />
                    ANNULÉ
                </Badge>
            );
        default:
            return <Badge variant="secondary">INCONNU</Badge>;
    }
};

export const ShipmentOfferColumns: ColumnDef<ShipmentOfferDataType>[] = [
    {
        accessorKey: "createdAt",
        header: () => <RenderTH header="Date de création" />,
        size: 200,
        cell: ({ row }) => {
            const createdAt = row.original.createdAt;
            return (
                <div className="text-nowrap">
                    <span className="flex items-center gap-2">
                        <Calendar className="size-4 text-muted-foreground" />
                        {format(new Date(createdAt), "dd/MM/yyyy HH:mm")}
                    </span>
                </div>
            );
        },
        enableHiding: false,
        enableColumnFilter: false,
    },
    {
        accessorKey: "commodity",
        header: () => <RenderTH header="Marchandise" />,
        size: 200,
        cell: ({ row }) => {
            const commodity = row.original.commodity;
            return (
                <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-brand/20 to-primary/20 rounded-lg">
                        <Package className="h-4 w-4 text-brand" />
                    </div>
                    <div>
                        <div className="font-medium max-w-[150px] truncate" title={commodity}>
                            {commodity}
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
        accessorKey: "truckType",
        header: () => <RenderTH header="Type de camion" />,
        size: 180,
        cell: ({ row }) => {
            const truckType = row.original.truckType;
            return (
                <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg">
                        <Truck className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                        <div className="font-medium">{truckType?.name}</div>
                        <div
                            className="text-xs text-muted-foreground max-w-[120px] truncate"
                            title={truckType?.description}
                        >
                            {truckType?.description}
                        </div>
                    </div>
                </div>
            );
        },
        enableColumnFilter: false,
    },
    {
        accessorKey: "reservePrice",
        header: () => <RenderTH header="Prix de réserve" />,
        size: 140,
        cell: ({ row }) => {
            const reservePrice = parseFloat(row.original.reservePrice);
            return (
                <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-green-600" />
                    <span className="font-medium text-green-700">
                        {reservePrice.toLocaleString("fr-FR", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                        })}{" "}
                        DH
                    </span>
                </div>
            );
        },
        enableColumnFilter: false,
    },
    {
        accessorKey: "availableTo",
        header: () => <RenderTH header="Disponible jusqu'au" />,
        size: 160,
        cell: ({ row }) => {
            const availableTo = row.original.availableTo;
            const isExpired = new Date(availableTo) < new Date();
            return (
                <div className={`text-nowrap ${isExpired ? "text-red-600" : "text-foreground"}`}>
                    <span className="flex items-center gap-2">
                        <Calendar className={`size-4 ${isExpired ? "text-red-600" : "text-muted-foreground"}`} />
                        {format(new Date(availableTo), "dd/MM/yyyy HH:mm")}
                    </span>
                    {isExpired && (
                        <span className="text-xs text-red-600 flex items-center gap-1">
                            <AlertTriangle className="size-3" />
                            Expiré
                        </span>
                    )}
                </div>
            );
        },
        enableHiding: false,
        enableColumnFilter: false,
    },
    {
        accessorKey: "status",
        header: () => <RenderTH header="Statut" />,
        size: 130,
        cell: ({ row }) => {
            const status = row.original.status;
            return <StatusBadge status={status} />;
        },
        enableColumnFilter: false,
    },
    {
        accessorKey: "actions",
        header: () => {},
        size: 40,
        cell: ({ row }) => {
            const offer = row.original;
            return <ShipmentOfferActions offer={offer} />;
        },
        enableHiding: false,
        enableColumnFilter: false,
    },
];
