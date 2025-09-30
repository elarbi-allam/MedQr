"use client";

import { useCallback, useMemo, useState } from "react";
import { Search, Filter, X } from "lucide-react";

import RenderTable from "@/components/render-table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MetaType } from "@/lib/types/meta.type";
import { PaginationParams } from "@/lib/types/pagination.type";
import { useDocumentTemplates } from "../hooks/use-document-template";
import { useDocumentTemplateTable } from "../hooks/use-document-template-table";
import {
  DocumentTemplateDataType,
  AppliesTo,
  EnterpriseType,
  DocumentTemplateStatus,
} from "../types/document-template.type";
import { Loader2Icon, RotateCcwIcon, XIcon } from "lucide-react";
import AddDocumentTemplate from "./add-document-template";

const appliesToOptions = [
  { value: AppliesTo.ENTERPRISE, label: "Entreprise" },
  { value: AppliesTo.TRUCK, label: "Camion" },
];

const enterpriseTypeOptions = [
  { value: EnterpriseType.CARRIER, label: "Transporteur" },
  { value: EnterpriseType.SHIPPER, label: "Expéditeur" },
];

const statusOptions = [
  { value: DocumentTemplateStatus.ACTIVE, label: "Actif" },
  { value: DocumentTemplateStatus.INACTIVE, label: "Inactif" },
];

export default function DocumentTemplateDataTable() {
  const [search, setSearch] = useState<string>("");
  const [appliesToFilter, setAppliesToFilter] = useState<AppliesTo | undefined>(
    undefined
  );
  const [enterpriseTypeFilter, setEnterpriseTypeFilter] = useState<
    EnterpriseType | undefined
  >(undefined);
  const [statusFilter, setStatusFilter] = useState<
    DocumentTemplateStatus | undefined
  >(undefined);
  const [order, setOrder] = useState<"ASC" | "DESC">("DESC");

  // État séparé pour la pagination du tableau
  const [pagination, setPagination] = useState<PaginationParams>({
    order: "DESC",
    page: 0,
    take: 10,
  });

  // Paramètres de requête pour l'API
  const queryParams = useMemo(() => {
    return {
      order: order,
      page: pagination.page + 1,
      take: pagination.take,
      search: search,
      appliesTo: appliesToFilter,
      enterpriseType: enterpriseTypeFilter,
      status: statusFilter,
    };
  }, [
    order,
    pagination.page,
    pagination.take,
    search,
    appliesToFilter,
    enterpriseTypeFilter,
    statusFilter,
  ]);

  const {
    data: templates,
    isLoading,
    isPending,
    isRefetching,
    refetch,
  } = useDocumentTemplates(queryParams);

  const tableData = useMemo(
    () => ({
      data: templates?.data as unknown as DocumentTemplateDataType[],
      meta: templates?.meta as MetaType,
      isLoading,
      isPending,
      paginationParams: pagination,
      setPaginationParams: setPagination,
    }),
    [templates?.data, templates?.meta, isLoading, isPending, pagination]
  );

  const table = useDocumentTemplateTable(tableData);

  const resetToFirstPage = useCallback(() => {
    setPagination((prev) => ({
      ...prev,
      page: 0,
    }));
  }, []);

  // Gestionnaires de changement avec reset de pagination
  const handleSearchChange = useCallback(
    (value: string) => {
      setSearch(value);
      resetToFirstPage();
    },
    [resetToFirstPage]
  );

  const handleAppliesToFilterChange = useCallback(
    (value: string) => {
      setAppliesToFilter(value === "all" ? undefined : (value as AppliesTo));
      resetToFirstPage();
    },
    [resetToFirstPage]
  );

  const handleEnterpriseTypeFilterChange = useCallback(
    (value: string) => {
      setEnterpriseTypeFilter(
        value === "all" ? undefined : (value as EnterpriseType)
      );
      resetToFirstPage();
    },
    [resetToFirstPage]
  );

  const handleStatusFilterChange = useCallback(
    (value: string) => {
      setStatusFilter(
        value === "all" ? undefined : (value as DocumentTemplateStatus)
      );
      resetToFirstPage();
    },
    [resetToFirstPage]
  );

  const handleOrderChange = useCallback(
    (value: "ASC" | "DESC") => {
      setOrder(value);
      resetToFirstPage();
    },
    [resetToFirstPage]
  );

  const handleResetFilters = useCallback(() => {
    setSearch("");
    setAppliesToFilter(undefined);
    setEnterpriseTypeFilter(undefined);
    setStatusFilter(undefined);
    setOrder("DESC");
    setPagination({
      order: "DESC",
      page: 0,
      take: 10,
    });
  }, []);

  const hasActiveFilters = useMemo(() => {
    return (
      search !== "" ||
      appliesToFilter !== undefined ||
      enterpriseTypeFilter !== undefined ||
      statusFilter !== undefined ||
      order !== "DESC"
    );
  }, [search, appliesToFilter, enterpriseTypeFilter, statusFilter, order]);

  // Error handling
  if (templates?.status === "ERROR") {
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
              Une erreur est survenue, veuillez réessayer plus tard
            </>
          )}
        </div>

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
    <div className="space-y-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Gestion des Modèles de Documents
          </h1>
          <p className="text-muted-foreground">
            Gérez les modèles de documents requis pour les entreprises et
            camions
          </p>
        </div>
        <AddDocumentTemplate />
      </div>

      {/* Filtres de recherche */}
      <div className="flex flex-col gap-4 p-4 bg-muted/50 rounded-lg border">
        <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
          <Filter className="h-4 w-4" />
          Filtres de recherche
        </div>

        <div className="flex flex-col gap-4 lg:flex-row lg:items-end">
          {/* Barre de recherche */}
          <div className="flex-1">
            <label className="text-sm font-medium text-foreground">
              Rechercher
            </label>
            <div className="relative mt-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Rechercher par nom, description..."
                value={search}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>

          <div className="flex-1 lg:max-w-[150px]">
            <label className="text-sm font-medium text-foreground">Ordre</label>
            <Select value={order} onValueChange={handleOrderChange}>
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="DESC">Décroissant</SelectItem>
                <SelectItem value="ASC">Croissant</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Filtre par type d'application */}
          <div className="flex-1 lg:max-w-[180px]">
            <label className="text-sm font-medium text-foreground">
              S&apos;applique à
            </label>
            <Select
              value={appliesToFilter || "all"}
              onValueChange={handleAppliesToFilterChange}
            >
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les types</SelectItem>
                {appliesToOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Filtre par type d'entreprise */}
          <div className="flex-1 lg:max-w-[180px]">
            <label className="text-sm font-medium text-foreground">
              Type d&apos;entreprise
            </label>
            <Select
              value={enterpriseTypeFilter || "all"}
              onValueChange={handleEnterpriseTypeFilterChange}
            >
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les types</SelectItem>
                {enterpriseTypeOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Filtre par statut */}
          <div className="flex-1 lg:max-w-[150px]">
            <label className="text-sm font-medium text-foreground">
              Statut
            </label>
            <Select
              value={statusFilter || "all"}
              onValueChange={handleStatusFilterChange}
            >
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                {statusOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Bouton reset */}
          {hasActiveFilters && (
            <Button
              variant="outline"
              onClick={handleResetFilters}
              className="flex items-center gap-2"
            >
              <X className="h-4 w-4" />
              Réinitialiser
            </Button>
          )}
        </div>
      </div>

      <div className="w-full">
        <RenderTable table={table} isLoading={isPending} />
      </div>
    </div>
  );
}
