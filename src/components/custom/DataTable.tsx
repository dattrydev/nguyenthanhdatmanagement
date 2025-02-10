import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    useReactTable,
    getFilteredRowModel,
    ColumnFiltersState,
} from "@tanstack/react-table";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {Input} from "@/components/ui/input";
import {MultiSelect} from "@/components/custom/MultiSelect";
import * as React from "react";
import {useState} from "react";
import {TableFilterConfig} from "@/components/custom/TableFilterConfig";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {ScrollArea} from "@/components/ui/scroll-area";

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
    tableFilterConfig?: TableFilterConfig[];
    onClickRow?: (row: TData) => void;
}

export function DataTable<TData, TValue>({
                                             columns,
                                             data,
                                             tableFilterConfig = [],
                                         }: DataTableProps<TData, TValue>) {
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const table = useReactTable({
        data,
        columns,
        state: {
            columnFilters,
        },
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnFiltersChange: setColumnFilters,
    });

    return (
        <div className="rounded-md border">
            <ScrollArea className={"max-h-[650px] overflow-auto"}>
                <Table>
                    <TableHeader className={"sticky top-0"}>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <TableHead key={header.id}>
                                        {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>

                    <TableBody>
                        <TableRow>
                            {table.getHeaderGroups().map((headerGroup) =>
                                headerGroup.headers.map((header) => {
                                    const filterConfig = tableFilterConfig.find((config) => config.key === header.column.id);
                                    if (!filterConfig) return <TableCell key={header.id}/>;

                                    return (
                                        <TableCell key={header.id}>
                                            {filterConfig.type === "text" && (
                                                <Input
                                                    value={(header.column.getFilterValue() as string) ?? ""}
                                                    onChange={(e) => header.column.setFilterValue(e.target.value)}
                                                    placeholder={filterConfig.placeholder || `Search ${header.column.id}`}
                                                />
                                            )}

                                            {filterConfig.type === "select" && filterConfig.options && (
                                                <Select
                                                    value={header.column.getFilterValue() as string}
                                                    onValueChange={(value) => header.column.setFilterValue(value)}
                                                >
                                                    <SelectTrigger className="h-8 w-[150px]">
                                                        <SelectValue
                                                            placeholder={filterConfig.placeholder || `Select ${header.column.id}`}/>
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {filterConfig.options.map((option) => (
                                                            <SelectItem key={option.value} value={option.value}>
                                                                {option.label}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            )}

                                            {filterConfig.type === "multi-select" && filterConfig.options && (
                                                <MultiSelect
                                                    options={filterConfig.options}
                                                    onValueChange={(values) => header.column.setFilterValue(values)}
                                                    defaultValue={filterConfig.defaultValue ? [filterConfig.defaultValue] : []}
                                                    placeholder={filterConfig.placeholder || `Select ${header.column.id}`}
                                                />
                                            )}
                                        </TableCell>
                                    );
                                })
                            )}
                        </TableRow>

                        {table.getRowModel().rows.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && "selected"}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </ScrollArea>
        </div>
    );
}
