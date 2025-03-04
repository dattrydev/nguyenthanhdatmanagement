import {ColumnDef} from "@tanstack/react-table";
import {PostList} from "@/types/dashboard/post";
import * as React from "react";
import {Checkbox} from "@/components/ui/checkbox";
import {PostActions} from "@/app/dashboard/post/PostActions";

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
    },
    {
        id: "title",
        accessorKey: "title",
        header: "Title",
        cell: ({row}) => (
            <div className="w-full line-clamp-1 hover:line-clamp-none">{row.getValue("title")}</div>
        ),
        enableSorting: true,
    },
    {
        id: "status",
        accessorKey: "status",
        header: "Status",
        cell: ({row}) => <div className="lowercase">{row.getValue("status")}</div>,
        enableSorting: true,
    },
    {
        id: "reading_time",
        accessorKey: "reading_time",
        header: "Reading Time",
        cell: ({row}) =>
            <div className={""}>
                {row.original.readingTime}
            </div>,
        enableSorting: true,
    },
    {
        id: "category",
        accessorKey: "category",
        header: "Category",
        cell: ({row}) => row.original.categoryName,
        enableSorting: true,
    },
    {
        id: "tags",
        accessorKey: "tags",
        header: "Tags",
        cell: ({row}) => row.original.tagsName,
        enableSorting: true,
    },
    {
        id: "actions",
        cell: ({row}) => {
            const post = row.original;
            return <PostActions post={post}/>;
        },
    },
];
