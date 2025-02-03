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
import * as React from "react";
import {MultiSelect} from "@/components/custom/MultiSelect";
import {useState} from "react";

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]; // Các cột của bảng
    data: TData[]; // Dữ liệu bảng
}

export function DataTable<TData, TValue>({
                                             columns,
                                             data,
                                         }: DataTableProps<TData, TValue>) {
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);

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

    const [selectedStatus, setSelectedStatus] = useState<string[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string[]>([]);
    const [selectedTags, setSelectedTags] = useState<string[]>([]);

    const statusList = [
        {value: "draft", label: "DRAFT"},
        {value: "inactive", label: "Inactive"},
    ];

    const categoryList = [
        {value: "tech", label: "Tech"},
        {value: "design", label: "Design"},
    ];

    const tagsList = [
        {value: "react", label: "React"},
        {value: "angular", label: "Angular"},
        {value: "vue", label: "Vue"},
    ];

    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
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
                                return (
                                    <TableCell key={header.id}>
                                        {header.column.id === "title" ? (
                                            <Input
                                                value={(header.column.getFilterValue() as string) ?? ""}
                                                onChange={(e) => header.column.setFilterValue(e.target.value)}
                                                placeholder={`Search ${header.column.id}`}
                                            />
                                        ) : header.column.id === "status" ? (
                                            <MultiSelect
                                                options={statusList}
                                                onValueChange={setSelectedStatus}
                                                defaultValue={selectedStatus}
                                                placeholder="Select status"
                                                variant="inverted"
                                                animation={2}
                                            />
                                        ) : header.column.id === "category" ? (
                                            <MultiSelect
                                                options={categoryList}
                                                onValueChange={setSelectedCategory}
                                                defaultValue={selectedCategory}
                                                placeholder="Select category"
                                                variant="inverted"
                                                animation={2}
                                            />
                                        ) : header.column.id === "tags_name" ? (
                                            <MultiSelect
                                                options={tagsList}
                                                onValueChange={setSelectedTags}
                                                defaultValue={selectedTags}
                                                placeholder="Select tags"
                                                variant="inverted"
                                                animation={2}
                                            />
                                        ) : null}
                                    </TableCell>
                                );
                            })
                        )}
                    </TableRow>

                    {table.getRowModel().rows.length ? (
                        table.getRowModel().rows.map((row) => (
                            <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
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
        </div>
    );
}
