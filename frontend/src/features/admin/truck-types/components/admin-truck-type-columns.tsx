'use client';

import { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import { Calendar, CheckCircle, XCircle, Truck, Archive } from 'lucide-react';

import RenderTH from '@/components/render-th';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { TruckTypeDataType, TruckTypeStatus } from '../types/truck-type.type';
import { AdminTruckTypeActions } from './admin-truck-type-actions';

const TruckTypeStatusBadge = ({ status }: { status: TruckTypeStatus }) => {
    switch (status) {
        case TruckTypeStatus.ACTIVE:
            return (
                <Badge
                    variant="default"
                    className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 flex items-center gap-1"
                >
                    <CheckCircle className="h-3 w-3" />
                    ACTIF
                </Badge>
            );
        case TruckTypeStatus.INACTIVE:
            return (
                <Badge
                    variant="destructive"
                    className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300 flex items-center gap-1"
                >
                    <XCircle className="h-3 w-3" />
                    INACTIF
                </Badge>
            );
        case TruckTypeStatus.ARCHIVE:
            return (
                <Badge
                    variant="outline"
                    className="bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300 flex items-center gap-1"
                >
                    <Archive className="h-3 w-3" />
                    ARCHIVÉ
                </Badge>
            );
        default:
            return <Badge variant="secondary">INCONNU</Badge>;
    }
};

export const AdminTruckTypeColumns: ColumnDef<TruckTypeDataType>[] = [
    {
        accessorKey: 'truckType',
        header: () => <RenderTH header="Type de Camion" />,
        size: 300,
        cell: ({ row }) => {
            const truckType = row.original;
            return (
                <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                        <AvatarImage
                            src={truckType.icon}
                            alt={truckType.name}
                        />
                        <AvatarFallback className="bg-gradient-to-br from-brand to-primary text-brand-foreground">
                            <Truck className="h-5 w-5" />
                        </AvatarFallback>
                    </Avatar>
                    <div>
                        <div className="font-medium">{truckType.name}</div>
                        <div className="text-sm text-muted-foreground">
                            {truckType.slug}
                        </div>
                    </div>
                </div>
            );
        },
        enableHiding: false,
        filterFn: 'includesString',
        enableColumnFilter: true,
    },
    {
        accessorKey: 'description',
        header: () => <RenderTH header="Description" />,
        size: 250,
        cell: ({ row }) => {
            const description = row.original.description;
            return (
                <div className="max-w-[250px] truncate" title={description}>
                    {description}
                </div>
            );
        },
        enableColumnFilter: false,
    },
    {
        accessorKey: 'status',
        header: () => <RenderTH header="Statut" />,
        size: 120,
        cell: ({ row }) => {
            const status = row.original.status;
            return status ? (
                <TruckTypeStatusBadge status={status} />
            ) : (
                <Badge variant="secondary">INCONNU</Badge>
            );
        },
        enableColumnFilter: false,
    },
    {
        accessorKey: 'updatedAt',
        header: () => <RenderTH header="Dernière modification" />,
        size: 160,
        cell: ({ row }) => {
            const updatedAt = row.original.updatedAt;
            return (
                <div className="text-nowrap">
                    <span className="flex items-center gap-2">
                        <Calendar className="size-4 text-muted-foreground" />
                        {updatedAt ? (
                            format(new Date(updatedAt), 'dd/MM/yyyy')
                        ) : (
                            <Badge variant="secondary">INCONNU</Badge>
                        )}
                    </span>
                </div>
            );
        },
        enableHiding: false,
        enableColumnFilter: false,
    },
    {
        accessorKey: 'actions',
        header: () => {},
        size: 80,
        cell: ({ row }) => {
            const truckType = row.original;
            return <AdminTruckTypeActions truckType={truckType} />;
        },
        enableHiding: false,
        enableColumnFilter: false,
    },
];
