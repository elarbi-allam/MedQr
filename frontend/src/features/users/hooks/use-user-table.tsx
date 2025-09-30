"use client";

import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { ColumnDef, getCoreRowModel, PaginationState, useReactTable } from "@tanstack/react-table";

import { MetaType } from "@/lib/types/meta.type";
import { PaginationParams } from "@/lib/types/pagination.type";
import { UserColumns } from "../components/user-columns";
import { UserDataType } from "../types/user.type";

interface UseUserTable<TData extends UserDataType> {
    data: TData[];
    meta: MetaType;
    isLoading: boolean;
    isPending: boolean;
    paginationParams: PaginationParams;
    setPaginationParams: Dispatch<SetStateAction<PaginationParams>>;
}

export function useUserTable<TData extends UserDataType>({
    data,
    meta,
    isLoading,
    isPending,
    paginationParams,
    setPaginationParams,
}: UseUserTable<TData>) {
    // Initialize tablePagination with the current paginationParams
    const [tablePagination, setTablePagination] = useState<PaginationState>({
        pageIndex: paginationParams.page,
        pageSize: paginationParams.take,
    });

    const [rowSelection, setRowSelection] = useState({});

    // Sync tablePagination with paginationParams when paginationParams changes externally
    useEffect(() => {
        setTablePagination({
            pageIndex: paginationParams.page,
            pageSize: paginationParams.take,
        });
    }, [paginationParams.page, paginationParams.take]);

    // Reset row selection when page changes
    useEffect(() => {
        setRowSelection({});
    }, [data]);

    // Update paginationParams when tablePagination changes
    useEffect(() => {
        // Only update if values actually changed to prevent infinite loops
        if (tablePagination.pageIndex !== paginationParams.page || tablePagination.pageSize !== paginationParams.take) {
            setPaginationParams((prev) => ({
                ...prev,
                page: tablePagination.pageIndex,
                take: tablePagination.pageSize,
            }));
        }
    }, [
        tablePagination.pageIndex,
        tablePagination.pageSize,
        paginationParams.page,
        paginationParams.take,
        setPaginationParams,
    ]);

    return useReactTable<TData>({
        data: isLoading || isPending ? [] : (data as TData[]),
        columns: UserColumns as ColumnDef<TData>[],
        getCoreRowModel: getCoreRowModel(),
        manualPagination: true,
        pageCount: Math.ceil((meta?.total ?? 0) / tablePagination.pageSize),
        rowCount: meta?.total ?? 0,
        enableRowSelection: true,
        enableMultiRowSelection: true,
        onRowSelectionChange: setRowSelection,
        onPaginationChange: setTablePagination,
        state: {
            pagination: tablePagination,
            rowSelection,
        },
    });
}
