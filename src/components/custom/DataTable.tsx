import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {Input} from "@/components/ui/input";
import {MultiSelect} from "@/components/custom/MultiSelect";
import {TableFilterConfig} from "@/components/custom/TableFilterConfig";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {ScrollArea} from "@/components/ui/scroll-area";
import {FaArrowUp, FaArrowDown} from "react-icons/fa";
import {useEffect, useRef} from "react";


interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
    tableFilterConfig?: TableFilterConfig[];
    onClickRow?: (row: TData) => void;
    onChangeFilter?: (filters: Record<string, any>) => void;
    sortColumn?: string;
    setSortColumn?: (value: string) => void;
    rowSelection?: Record<string, boolean>;
    setRowSelection?: (value: Record<string, boolean>) => void;
}

export function DataTable<TData, TValue>({
                                             columns,
                                             data,
                                             tableFilterConfig = [],
                                             onChangeFilter,
                                             setRowSelection,
                                             sortColumn,
                                             setSortColumn,
                                         }: DataTableProps<TData, TValue>) {

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
    });

    const prevDataLength = useRef(data.length);
    const clearSelectionRef = useRef(false);

    const handleFilterChange = (key: string, value: any) => {
        if (onChangeFilter) {
            onChangeFilter({[key]: value});
        }
    };

    const clearRowSelection = () => {
        table.setState((oldState) => ({
            ...oldState,
            rowSelection: {},
        }));
        clearSelectionRef.current = true;
    };

    useEffect(() => {
        if (data.length !== prevDataLength.current) {
            if (!clearSelectionRef.current) {
                clearRowSelection();
            }
            prevDataLength.current = data.length;
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data.length]);


    useEffect(() => {
        if (!setRowSelection) return;

        const selectedIds = Object.values(table.getSelectedRowModel().rowsById).map(
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            (item) => item.original.id
        );

        const newSelection: Record<string, boolean> = {};

        selectedIds.forEach((id) => {
            newSelection[id] = true;
        });

        setRowSelection(newSelection);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [table.getSelectedRowModel().rowsById, data, setRowSelection]);

    return (
        <div className="rounded-md border">
            <ScrollArea className={"h-[625px]"}>
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <TableHead key={header.id}
                                               className={`${header.column.columnDef.enableSorting ? "cursor-pointer" : ""}`}
                                               onClick={() => {
                                                   if (!header.column.columnDef.enableSorting) return;
                                                   if (sortColumn === undefined) return;
                                                   if (setSortColumn === undefined) return;
                                                   if (sortColumn === header.column.id) {
                                                       setSortColumn(`-${header.column.id}`);
                                                   } else {
                                                       setSortColumn(header.column.id);
                                                   }
                                               }}>
                                        {header.isPlaceholder ? null : (
                                            <div className={"flex gap-2 items-center"}>
                                                {flexRender(header.column.columnDef.header, header.getContext())}
                                                {header.column.columnDef.enableSorting && (
                                                    <span>
                                                {sortColumn === header.column.id &&
                                                    <FaArrowUp/>
                                                }
                                                        {sortColumn === `-${header.column.id}` &&
                                                            <FaArrowDown/>
                                                        }
                                            </span>
                                                )}
                                            </div>
                                        )}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>

                    <TableBody>
                        <TableRow className={"sticky top-9 bg-secondary z-10"}>
                            {table.getHeaderGroups().map((headerGroup) =>
                                headerGroup.headers.map((header) => {
                                    const filterConfig = tableFilterConfig.find((config) => config.key === header.column.id);
                                    if (!filterConfig) return <TableCell key={header.id}/>;

                                    return (
                                        <TableCell key={header.id}>
                                            {filterConfig.type === "text" && (
                                                <Input
                                                    value={(header.column.getFilterValue() as string) ?? ""}
                                                    onChange={(e) => {
                                                        header.column.setFilterValue(e.target.value);
                                                        handleFilterChange(filterConfig.key, e.target.value);
                                                    }}
                                                    placeholder={filterConfig.placeholder || `Search ${header.column.id}`}
                                                />
                                            )}

                                            {filterConfig.type === "number" && (
                                                <Input
                                                    value={(header.column.getFilterValue() as string) ?? ""}
                                                    onChange={(e) => {
                                                        header.column.setFilterValue(e.target.value);
                                                        handleFilterChange(filterConfig.key, e.target.value);
                                                    }}
                                                    type="number"
                                                    placeholder={filterConfig.placeholder || `Search ${header.column.id}`}
                                                />
                                            )}

                                            {filterConfig.type === "select" && filterConfig.options && (
                                                <Select
                                                    value={header.column.getFilterValue() as string}
                                                    onValueChange={(value) => {
                                                        header.column.setFilterValue(value);
                                                        handleFilterChange(filterConfig.key, value);
                                                    }}
                                                >
                                                    <SelectTrigger className="h-8 w-[150px]">
                                                        <SelectValue
                                                            placeholder={filterConfig.placeholder || `Select ${header.column.id}`}
                                                        />
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
                                                    onValueChange={(values) => {
                                                        header.column.setFilterValue(values);
                                                        handleFilterChange(filterConfig.key, values);
                                                    }}
                                                    value={header.column.getFilterValue() as string[] || []}
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
                                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id} className={"px-2"}>
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
