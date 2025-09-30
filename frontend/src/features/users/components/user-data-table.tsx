"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { z } from "zod";

import RenderTable from "@/components/render-table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MetaType } from "@/lib/types/meta.type";
import { PaginationParams } from "@/lib/types/pagination.type";
import { useUsers } from "../hooks/use-user";
import { useUserTable } from "../hooks/use-user-table";
import { STATUS_OPTIONS, UserDataType, UserParams } from "../types/user.type";
import { Loader2Icon, RotateCcwIcon, XIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function UserDataTable() {
    const [activeTab, setActiveTab] = useState<string>("all");
    const [pagination, setPagination] = useState<PaginationParams>({
        order: "DESC",
        page: 0,
        take: 10,
    });

    // Combine params and pagination into a single state to reduce renders
    const [params, setParams] = useState<UserParams>({
        order: "DESC",
        page: 1,
        take: 10,
    });

    // Memoize query parameters to prevent unnecessary recalculations
    const queryParams = useMemo(() => {
        const baseParams = {
            ...params,
            order: pagination.order,
            page: pagination.page + 1, // API expects 1-indexed pages
            take: pagination.take,
        };

        return activeTab === "all"
            ? baseParams
            : {
                  ...baseParams,
                  status: activeTab as "active" | "inActive" | "archive",
              };
    }, [activeTab, params, pagination]);

    const {
        data: users,
        isLoading,
        isPending,
        isRefetching,
        refetch,
    } = useUsers(queryParams);

    // Sync pagination changes with params
    useEffect(() => {
        setParams((prev) => ({
            ...prev,
            order: pagination.order || "DESC",
            page: (pagination.page || 0) + 1, // API expects 1-indexed pages
            take: pagination.take || 10,
        }));
    }, [pagination]);

    // Memoize table data to prevent unnecessary re-renders
    const tableData = useMemo(
        () => ({
            data: users?.data as unknown as UserDataType[],
            meta: users?.meta as MetaType,
            isLoading,
            isPending,
            paginationParams: pagination,
            setPaginationParams: setPagination,
        }),
        [users?.data, users?.meta, isLoading, isPending, pagination]
    );

    const table = useUserTable(tableData);

    // Use useCallback to prevent recreation of this function on every render
    const handleStatusFilter = useCallback((filter: string) => {
        setActiveTab(filter);
        // Only update params if the status is not "all"
        if (filter !== "all") {
            setParams((prev) => ({
                ...prev,
                status: filter as z.infer<typeof STATUS_OPTIONS>,
                // Reset pagination when changing filters
                page: 1,
            }));
            // Also reset pagination state
            setPagination((prev) => ({
                ...prev,
                page: 0, // Table uses 0-indexed pages
            }));
        } else {
            setParams((prev) => ({
                ...prev,
                status: undefined,
                page: 1,
            }));
            // Also reset pagination state
            setPagination((prev) => ({
                ...prev,
                page: 0, // Table uses 0-indexed pages
            }));
        }
    }, []);

    // Memoize the TabsTriggers to prevent unnecessary re-renders
    const statusTabs = useMemo(
        () => (
            <TabsList>
                <TabsTrigger value="all" className="px-3 py-1.5 text-sm">
                    Tous
                </TabsTrigger>
                {Object.keys(STATUS_OPTIONS.enum).map((key) => {
                    const getStatusLabel = (status: string) => {
                        if (status === "active") return "Actif";
                        if (status === "inActive") return "Inactif";
                        return "Archivé";
                    };

                    return (
                        <TabsTrigger
                            key={key}
                            value={key}
                            className="px-3 py-1.5 text-sm"
                        >
                            {getStatusLabel(key)}
                        </TabsTrigger>
                    );
                })}
            </TabsList>
        ),
        []
    );

    // Error handling
    if (users?.status === "ERROR") {
        return (
            <div className="flex items-center justify-between border border-brand/60 bg-brand/10 rounded-lg p-4 text-brand">
                <div className="flex items-center justify-center gap-1">
                    {isRefetching ? (
                        <>
                            <Loader2Icon className="size-5 animate-spin" />
                            Chargement ...
                        </>
                    ) : (
                        <>
                            <XIcon className="size-5" />
                            Une erreur est survenue, veuillez réessayer plus
                            tard
                        </>
                    )}
                </div>

                {/* try again */}
                <Button
                    variant="outline"
                    className="border-brand bg-brand/20 text-brand hover:bg-brand/30 hover:text-brand has-[>svg]:px-4"
                    onClick={() => refetch()}
                >
                    <RotateCcwIcon className="size-4" /> Réessayer
                </Button>
            </div>
        );
    }

    return (
        <>
            <Tabs
                defaultValue={activeTab}
                className="w-full"
                onValueChange={handleStatusFilter}
            >
                {statusTabs}

                <TabsContent
                    value={activeTab}
                    className="p-0 w-full flex flex-col gap-3"
                >
                    <RenderTable table={table} isLoading={isPending} />
                </TabsContent>
            </Tabs>
        </>
    );
}
