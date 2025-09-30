"use client";

import { Dispatch, SetStateAction, useEffect, useState } from "react";
import {
  ColumnDef,
  getCoreRowModel,
  PaginationState,
  useReactTable,
} from "@tanstack/react-table";

import { MetaType } from "@/lib/types/meta.type";
import { PaginationParams } from "@/lib/types/pagination.type";
import { TruckDataType } from "../types/truck.type";

interface UseTrucksTable<TData extends TruckDataType> {
  data: TData[];
  meta: MetaType;
  isLoading: boolean;
  isPending: boolean;
  paginationParams: PaginationParams;
  setPaginationParams: Dispatch<SetStateAction<PaginationParams>>;
  columns: ColumnDef<TData>[];
}

export function useTrucksTable<TData extends TruckDataType>({
  data,
  meta,
  isLoading,
  isPending,
  paginationParams,
  setPaginationParams,
  columns,
}: UseTrucksTable<TData>) {
  const [tablePagination, setTablePagination] = useState<PaginationState>({
    pageIndex: paginationParams.page,
    pageSize: paginationParams.take,
  });

  const [rowSelection, setRowSelection] = useState({});

  useEffect(() => {
    setTablePagination({
      pageIndex: paginationParams.page,
      pageSize: paginationParams.take,
    });
  }, [paginationParams.page, paginationParams.take]);

  useEffect(() => {
    setRowSelection({});
  }, [data]);

  useEffect(() => {
    if (
      tablePagination.pageIndex !== paginationParams.page ||
      tablePagination.pageSize !== paginationParams.take
    ) {
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
    columns: columns,
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