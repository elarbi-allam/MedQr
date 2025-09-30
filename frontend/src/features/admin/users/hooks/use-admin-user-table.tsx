"use client";

import { Dispatch, SetStateAction, useEffect, useState, useCallback } from "react";
import { ColumnDef, getCoreRowModel, PaginationState, useReactTable } from "@tanstack/react-table";

import { MetaType } from "@/lib/types/meta.type";
import { PaginationParams } from "@/lib/types/pagination.type";
import { AdminUserColumns } from "../components/admin-user-columns";
import { AdminUserDataType } from "../types/admin-user.type";

interface UseAdminUserTable<TData extends AdminUserDataType> {
    data: TData[];
    meta: MetaType;
    isLoading: boolean;
    isPending: boolean;
    paginationParams: PaginationParams;
    setPaginationParams: Dispatch<SetStateAction<PaginationParams>>;
}

export function useAdminUserTable<TData extends AdminUserDataType>({
    data,
    meta,
    isLoading,
    isPending,
    paginationParams,
    setPaginationParams,
}: UseAdminUserTable<TData>) {
    const [tablePagination, setTablePagination] = useState<PaginationState>({
        pageIndex: paginationParams.page,
        pageSize: paginationParams.take,
    });

    const [rowSelection, setRowSelection] = useState({});

    // Synchroniser la pagination du tableau avec les paramètres externes
    useEffect(() => {
        setTablePagination(prev => {
            if (prev.pageIndex !== paginationParams.page || prev.pageSize !== paginationParams.take) {
                return {
                    pageIndex: paginationParams.page,
                    pageSize: paginationParams.take,
                };
            }
            return prev;
        });
    }, [paginationParams.page, paginationParams.take]);

    // Reset row selection when data changes
    useEffect(() => {
        setRowSelection({});
    }, [data]);

    // Callback pour gérer les changements de pagination du tableau
    const handlePaginationChange = useCallback((updaterOrValue: PaginationState | ((old: PaginationState) => PaginationState)) => {
        setTablePagination(prev => {
            const newPagination = typeof updaterOrValue === 'function' 
                ? updaterOrValue(prev) 
                : updaterOrValue;
            
            // Mettre à jour les paramètres externes seulement si nécessaire
            setPaginationParams(currentParams => {
                if (currentParams.page !== newPagination.pageIndex || currentParams.take !== newPagination.pageSize) {
                    return {
                        ...currentParams,
                        page: newPagination.pageIndex,
                        take: newPagination.pageSize,
                    };
                }
                return currentParams;
            });
            
            return newPagination;
        });
    }, [setPaginationParams]);

    return useReactTable<TData>({
        data: isLoading || isPending ? [] : (data as TData[]),
        columns: AdminUserColumns as ColumnDef<TData>[],
        getCoreRowModel: getCoreRowModel(),
        manualPagination: true,
        pageCount: Math.ceil((meta?.total ?? 0) / tablePagination.pageSize),
        rowCount: meta?.total ?? 0,
        enableRowSelection: true,
        enableMultiRowSelection: true,
        onRowSelectionChange: setRowSelection,
        onPaginationChange: handlePaginationChange,
        state: {
            pagination: tablePagination,
            rowSelection,
        },
    });
}