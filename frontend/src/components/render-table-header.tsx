import { flexRender, Table } from "@tanstack/react-table";

import { TableHead, TableHeader, TableRow } from "./ui/table";

interface RenderTableHeaderProps<TData> {
    table: Table<TData>;
}

export default function RenderTableHeader<TData>({ table }: RenderTableHeaderProps<TData>) {
    return (
        <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id} className="hover:bg-transparent">
                    {headerGroup.headers.map((header) => (
                        <TableHead
                            key={header.id}
                            style={{ width: header.getSize() }}
                            className="relative bg-muted/30 h-12 px-4 [&:has([role=checkbox])]:p-0"
                        >
                            {header.isPlaceholder
                                ? null
                                : flexRender(header.column.columnDef.header, header.getContext())}
                        </TableHead>
                    ))}
                </TableRow>
            ))}
        </TableHeader>
    );
}
