"use client";

import {columnsConfig} from "@/app/dashboard/post/columns-config";
import * as React from "react";
import {
    ColumnFiltersState,
    getCoreRowModel, getFilteredRowModel,
    getPaginationRowModel, getSortedRowModel,
    SortingState,
    useReactTable,
    VisibilityState
} from "@tanstack/react-table";
import {Footer} from "@/app/dashboard/post/footer";
import {DataTable} from "@/components/custom/DataTable";
import {Header} from "@/app/dashboard/post/header";
import {usePostContext} from "@/context/PostContext";
import {useMemo, useEffect} from "react";
import {getTableFilterConfig} from "@/components/custom/TableFilterConfig";
import {PostList, PostStatusOptions} from "@/types/dashboard/post";
import {useCategoryContext} from "@/context/CategoryContext";
import {useTagContext} from "@/context/TagContext";
import {useRouter} from "next/navigation";

export default function Page() {
    const {postList} = usePostContext();
    const {categoryList} = useCategoryContext();
    const {tagList} = useTagContext();

    const router = useRouter();

    const postListData = useMemo(() => {
        return postList;
    }, [postList]);

    const [sorting, setSorting] = React.useState<SortingState>([])
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
    const [rowSelection, setRowSelection] = React.useState({})

    const table = useReactTable({
        data: postListData,
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
    });

    const tableFilterConfig = getTableFilterConfig([
        {key: "title", type: "text"},
        {
            key: "status",
            type: "multi-select",
            options: PostStatusOptions,
        },
        {
            key: "category",
            type: "multi-select",
            options: categoryList.map((category) => ({label: category.name, value: category.id})),
        },
        {
            key: "tags",
            type: "multi-select",
            options: tagList.map((tag) => ({label: tag.name, value: tag.id})),
        }
    ]);

    const onClickRow = (row: PostList) => {
        router.push(`/dashboard/post/${row.slug}`);
    }

    useEffect(() => {
        if (postListData) {
            table.setState((prevState) => ({
                ...prevState,
                data: postListData,
            }));
        }
    }, [postListData, table]);

    useEffect(() => {
        console.log(postList);
    }, [postList]);


    return (
        <div className={"flex flex-col gap-3"}>
            <Header/>
            <DataTable
                columns={columnsConfig}
                data={postListData}
                tableFilterConfig={tableFilterConfig}
                onClickRow={onClickRow}
            />
            <Footer table={table}/>
        </div>
    );
}
