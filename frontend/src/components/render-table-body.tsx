import { flexRender, Table } from "@tanstack/react-table";

import { TableBody, TableCell, TableRow } from "@/components/ui/table";
import { TableEmptyState } from "./table-empty-state";

interface RenderTableBodyProps<TData> {
    table: Table<TData>;
}

export default function RenderTableBody<TData>({ table }: RenderTableBodyProps<TData>) {
    return (
        <TableBody>
            {table.getRowModel().rows.length ? (
                table.getRowModel().rows.map((row) => (
                    <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                        {row.getVisibleCells().map((cell) => (
                            <TableCell
                                key={cell.id}
                                style={{ width: cell.column.getSize() }}
                                className="whitespace-nowrap h-12 px-4 min-w-fit text-ellipsis overflow-hidden [&:has([role=checkbox])]:p-0"
                            >
                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                            </TableCell>
                        ))}
                    </TableRow>
                ))
            ) : (
                <TableRow>
                    <TableCell
                        colSpan={
                            table.getHeaderGroups().length === 1
                                ? table.getVisibleFlatColumns().length
                                : table.getHeaderGroups().length
                        }
                        className="text-center"
                    >
                        <TableEmptyState />
                    </TableCell>
                </TableRow>
            )}
        </TableBody>
    );
}
