import { Table as TableType } from "@tanstack/react-table";

import TablePagination from "./pagination";
import RenderTableBody from "./render-table-body";
import RenderTableHeader from "./render-table-header";
import TableLoading from "./table-loading";
import { Table } from "./ui/table";

interface RenderTableProps<TData> {
    table: TableType<TData>;
    isLoading: boolean;
}

export default function RenderTable<TData>({ table, isLoading }: RenderTableProps<TData>) {
    if (isLoading) {
        return <TableLoading />;
    }

    return (
        <>
            <div className="w-full relative overflow-x-auto rounded-xl border ring-offset-background bg-background">
                <Table className="w-full table-fixed">
                    <RenderTableHeader table={table} />
                    <RenderTableBody table={table} />
                </Table>
            </div>

            <TablePagination table={table} />
        </>
    );
}
