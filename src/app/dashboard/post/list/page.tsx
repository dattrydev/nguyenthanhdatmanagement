"use client";

import {useCallback, useEffect, useState} from "react";
import {PostList} from "@/types/dashboard/post";
import {getPostListApi} from "@/api/dashboard/post/post";
import {columnsConfig} from "@/app/dashboard/post/list/columns-config";
import * as React from "react";
import {
    ColumnFiltersState,
    getCoreRowModel, getFilteredRowModel,
    getPaginationRowModel, getSortedRowModel,
    SortingState,
    useReactTable,
    VisibilityState
} from "@tanstack/react-table";
import {Footer} from "@/app/dashboard/post/list/footer";
import {DataTable} from "@/components/custom/DataTable";

export default function Page() {
    const [postList, setPostList] = useState<PostList[]>([]);

    const fetchPostList = useCallback(async () => {
        const response = await getPostListApi();
        if ("posts" in response) {
            if (Array.isArray(response.posts)) {
                setPostList(response.posts);
            } else {
                console.log("Failed to fetch post list: " + response);
            }
        }
    }, []);

    const [sorting, setSorting] = React.useState<SortingState>([])
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
        []
    )
    const [columnVisibility, setColumnVisibility] =
        React.useState<VisibilityState>({})
    const [rowSelection, setRowSelection] = React.useState({})

    const table = useReactTable({
        data: postList,
        columns: columnsConfig,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
        },
    })

    useEffect(() => {
        fetchPostList();
    }, [fetchPostList]);

    return (
        <div>
            <DataTable columns={columnsConfig} data={postList}/>
            <Footer table={table}/>
        </div>
    );
}
