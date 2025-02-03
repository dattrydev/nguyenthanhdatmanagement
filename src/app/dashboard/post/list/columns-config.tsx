import {ColumnDef} from "@tanstack/react-table";
import {PostList} from "@/types/dashboard/post";
import * as React from "react";
import {Checkbox} from "@/components/ui/checkbox";
import {Button} from "@/components/ui/button";
import {MoreHorizontal} from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel, DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

export const columnsConfig: ColumnDef<PostList>[] = [
    {
        id: "select",
        header: ({table}) => (
            <Checkbox
                checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
                onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                aria-label="Select all"
            />
        ),
        cell: ({row}) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label="Select row"
            />
        ),
        enableSorting: false,
    },
    {
        id: "title",
        accessorKey: "title",
        header: "Title",
        cell: ({row}) => (
            <div className="capitalize w-36 line-clamp-1">{row.getValue("title")}</div>
        ),
        enableColumnFilter: true,
        filterFn: (row, columnId, value) => {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            return row.getValue("title").toLowerCase().includes(value.toLowerCase());
        },
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({row}) => <div className="lowercase">{row.getValue("status")}</div>,
        enableColumnFilter: true,
        filterFn: (row, columnId, value) => {
            return value.includes(row.getValue("status"));
        },
    },
    {
        accessorKey: "category",
        header: "Category",
        cell: ({row}) => row.original.category_name,
        enableColumnFilter: true,
        filterFn: (row, columnId, value) => {
            // Logic for filtering by category
            return value.includes(row.getValue("category"));
        },
    },
    {
        accessorKey: "tags_name",
        header: "Tags",
        cell: ({row}) => row.original.tags_name,
        enableColumnFilter: true,
        filterFn: (row, columnId, value) => {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            return value.some(tag => row.getValue("tags_name").includes(tag));
        },
    },
    {
        id: "actions",
        enableHiding: false,
        cell: ({row}) => {
            const payment = row.original;

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal/>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => navigator.clipboard.writeText(payment.slug)}>
                            Copy payment ID
                        </DropdownMenuItem>
                        <DropdownMenuSeparator/>
                        <DropdownMenuItem>View customer</DropdownMenuItem>
                        <DropdownMenuItem>View payment details</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    },
];
