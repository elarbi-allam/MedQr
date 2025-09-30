"use client";

import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { Calendar, CheckCircle, HelpCircle, XCircle } from "lucide-react";

import RenderTH from "@/components/render-th";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { UserDataType } from "../types/user.type";
import { UserActions } from "./user-actions";

const UserStatus = ({ status }: { status: string }) => {
    return (
        <Badge
            className={cn(
                "bg-muted text-muted-foreground flex items-center gap-1 border-muted-foreground",
                status.toLowerCase() === "active"
                    ? "bg-success text-success-foreground border-success-foreground"
                    : status.toLowerCase() === "inactive"
                      ? "bg-warning text-warning-foreground border-warning-foreground"
                      : "bg-error text-error-foreground border-error-foreground"
            )}
        >
            {status.toLowerCase() === "active" ? (
                <CheckCircle className="size-3" />
            ) : status.toLowerCase() === "inactive" ? (
                <HelpCircle className="size-3" />
            ) : (
                <XCircle className="size-3" />
            )}
            {status.toLowerCase()}
        </Badge>
    );
};

export const UserColumns: ColumnDef<UserDataType>[] = [
    {
        accessorKey: "firstName",
        header: () => <RenderTH header="Prénom" />,
        size: 120,
        cell: ({ row }) => {
            const firstName = row.getValue("firstName") as string;
            return firstName ? (
                <div className="text-wrap flex items-center gap-1">
                    {firstName}
                </div>
            ) : (
                <div className="text-wrap">________</div>
            );
        },
        enableHiding: false,
        filterFn: "includesString",
        enableColumnFilter: true,
    },
    {
        accessorKey: "lastName",
        header: () => <RenderTH header="Nom" />,
        size: 200,
        cell: ({ row }) => {
            const lastName = row.getValue("lastName") as string;
            return lastName ? (
                <div className="text-wrap flex items-center gap-1">
                    {lastName}
                </div>
            ) : (
                <div className="text-wrap">________</div>
            );
        },
        enableHiding: false,
        filterFn: "includesString",
        enableColumnFilter: true,
    },
    {
        accessorKey: "email",
        header: () => <RenderTH header="Email" />,
        size: 200,
        cell: ({ row }) => {
            const email = row.getValue("email") as string;
            return (
                <div className="text-wrap">{email ? email : "________"}</div>
            );
        },
        filterFn: "includesString",
        enableColumnFilter: true,
    },
    {
        accessorKey: "role",
        header: () => <RenderTH header="Rôle" />,
        size: 100,
        cell: ({ row }) => {
            const role = row.getValue("role") as string;
            return <div className="text-wrap">{role ? role : "________"}</div>;
        },
        enableHiding: false,
        enableColumnFilter: true,
    },
    {
        accessorKey: "status",
        header: () => <RenderTH header="Statut" />,
        size: 100,
        cell: ({ row }) => {
            const status = row.getValue("status") as string;
            return (
                <div className="flex">
                    {status ? (
                        <UserStatus status={status} />
                    ) : (
                        <div className="text-wrap">________</div>
                    )}
                </div>
            );
        },
        enableHiding: false,
        enableColumnFilter: false,
    },
    {
        accessorKey: "createdAt",
        header: () => <RenderTH header="Date de création" />,
        size: 160,
        cell: ({ row }) => {
            const flowStartAt: string = row.getValue("createdAt");

            return (
                <div className="text-nowrap">
                    {flowStartAt ? (
                        <span className="flex items-center gap-2">
                            <Calendar className="size-4 text-muted-foreground" />
                            {format(flowStartAt, "dd/MM/yyyy")}
                        </span>
                    ) : (
                        "________"
                    )}
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
            return <UserActions user={user} />;
        },
        enableHiding: false,
        enableColumnFilter: false,
    },
];
