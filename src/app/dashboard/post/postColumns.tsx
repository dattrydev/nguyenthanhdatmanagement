import {ColumnDef} from "@tanstack/react-table";
import {PostList} from "@/types/dashboard/post";
import * as React from "react";
import {Checkbox} from "@/components/ui/checkbox";
import {PostActions} from "@/app/dashboard/post/PostAction";

export const postColumns: ColumnDef<PostList>[] = [
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
            <div className="w-full line-clamp-1">{row.getValue("title")}</div>
        ),
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({row}) => <div className="lowercase">{row.getValue("status")}</div>,
    },
    {
        accessorKey: "category",
        header: "Category",
        cell: ({row}) => row.original.category_name,
        enableColumnFilter: true,
    },
    {
        accessorKey: "tags",
        header: "Tags",
        cell: ({row}) => row.original.tags_name,
        enableColumnFilter: true,
    },
    {
        id: "actions",
        enableHiding: false,
        cell: ({row}) => {
            const post = row.original;
            return <PostActions post={post}/>;
        },
    },
];
