import { Table } from "@tanstack/react-table";
import { ChevronFirst, ChevronLast, ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "./ui/label";
import { Pagination, PaginationContent, PaginationItem } from "./ui/pagination";

interface PaginationProps<TData> {
    table: Table<TData>;
}

export default function TablePagination<TData>({ table }: PaginationProps<TData>) {
    return (
        <div className="flex items-center w-full justify-between gap-8">
            {/* Results per page */}
            <div className="flex items-center gap-3">
                <Label htmlFor="rows-per-page" className="max-sm:sr-only">
                    Rows per page
                </Label>
                <Select
                    value={table.getState().pagination.pageSize.toString()}
                    onValueChange={(value) => {
                        table.setPageSize(Number(value));
                    }}
                >
                    <SelectTrigger id="rows-per-page" className="w-fit whitespace-nowrap rounded-lg">
                        <SelectValue placeholder="Select number of results" />
                    </SelectTrigger>
                    <SelectContent className="rounded-lg [&_*[role=option]>span]:end-2 [&_*[role=option]>span]:start-auto [&_*[role=option]]:pe-8 [&_*[role=option]]:ps-2">
                        {[5, 10, 15, 25].map((pageSize) => (
                            <SelectItem key={pageSize} value={pageSize.toString()}>
                                {pageSize}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {/* Page number information */}
            <div className="flex grow justify-end whitespace-nowrap text-sm text-muted-foreground">
                <p className="whitespace-nowrap text-sm text-muted-foreground" aria-live="polite">
                    <span className="text-foreground">
                        {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1}-
                        {table.getState().pagination.pageIndex * table.getState().pagination.pageSize +
                            table.getState().pagination.pageSize}
                    </span>{" "}
                    of <span className="text-foreground">{table.getRowCount().toString()}</span>
                </p>
            </div>

            {/* Pagination buttons */}
            <div>
                <Pagination>
                    <PaginationContent>
                        {/* First page button */}
                        <PaginationItem>
                            <Button
                                size="icon"
                                variant="outline"
                                className="disabled:pointer-events-none disabled:opacity-50 rounded-lg"
                                onClick={() => table.firstPage()}
                                disabled={!table.getCanPreviousPage()}
                                aria-label="Go to first page"
                            >
                                <ChevronFirst size={16} strokeWidth={2} aria-hidden="true" />
                            </Button>
                        </PaginationItem>
                        {/* Previous page button */}
                        <PaginationItem>
                            <Button
                                size="icon"
                                variant="outline"
                                className="disabled:pointer-events-none disabled:opacity-50 rounded-lg"
                                onClick={() => table.previousPage()}
                                disabled={!table.getCanPreviousPage()}
                                aria-label="Go to previous page"
                            >
                                <ChevronLeft size={16} strokeWidth={2} aria-hidden="true" />
                            </Button>
                        </PaginationItem>
                        {/* Next page button */}
                        <PaginationItem>
                            <Button
                                size="icon"
                                variant="outline"
                                className="disabled:pointer-events-none disabled:opacity-50 rounded-lg"
                                onClick={() => table.nextPage()}
                                disabled={!table.getCanNextPage()}
                                aria-label="Go to next page"
                            >
                                <ChevronRight size={16} strokeWidth={2} aria-hidden="true" />
                            </Button>
                        </PaginationItem>
                        {/* Last page button */}
                        <PaginationItem>
                            <Button
                                size="icon"
                                variant="outline"
                                className="disabled:pointer-events-none disabled:opacity-50 rounded-lg"
                                onClick={() => table.lastPage()}
                                disabled={!table.getCanNextPage()}
                                aria-label="Go to last page"
                            >
                                <ChevronLast size={16} strokeWidth={2} aria-hidden="true" />
                            </Button>
                        </PaginationItem>
                    </PaginationContent>
                </Pagination>
            </div>
        </div>
    );
}
