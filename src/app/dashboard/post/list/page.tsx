"use client";

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
import {Header} from "@/app/dashboard/post/list/header";
import {usePostContext} from "@/context/PostContext";
import {useMemo} from "react";

export default function Page() {
    const {postList} = usePostContext();

    const postListData = useMemo(() => {
        return postList;
    }, [postList]);

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

    return (
        <div className={"flex flex-col gap-3"}>
            <Header/>
            <DataTable columns={columnsConfig} data={postListData}/>
            <Footer table={table}/>
        </div>
    );
}
