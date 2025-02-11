import {ColumnDef} from "@tanstack/react-table";
import * as React from "react";
import {Checkbox} from "@/components/ui/checkbox";
import {CategoryList} from "@/types/dashboard/category";
import {CategoryActions} from "@/app/dashboard/category/CategoryActions";

export const categoryColumns: ColumnDef<CategoryList>[] = [
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
    },
    {
        id: "name",
        accessorKey: "name",
        header: "Name",
        cell: ({row}) => (
            <div className="w-full line-clamp-1 hover:line-clamp-none">{row.getValue("name")}</div>
        ),
        enableSorting: true,
    },
    {
        id: "actions",
        cell: ({row}) => {
            const category = row.original;
            return <CategoryActions category={category}/>;
        },
    },
];
