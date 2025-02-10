"use client";

import {postColumns} from "@/app/dashboard/post/postColumns";
import * as React from "react";
import {
    ColumnFiltersState,
    getCoreRowModel, getFilteredRowModel,
    getPaginationRowModel, getSortedRowModel,
    SortingState,
    useReactTable,
    VisibilityState
} from "@tanstack/react-table";
import {DataTable} from "@/components/custom/DataTable";
import {TableHeader} from "@/app/dashboard/post/TableHeader";
import {usePostContext} from "@/context/PostContext";
import {useMemo, useEffect} from "react";
import {getTableFilterConfig} from "@/components/custom/TableFilterConfig";
import {PostStatusOptions} from "@/types/dashboard/post";
import {useCategoryContext} from "@/context/CategoryContext";
import {useTagContext} from "@/context/TagContext";
import {DataTablePagination} from "@/components/custom/DataTablePagination";

export default function Page() {
    const {postList, paging, updatePostListPagingRequest} = usePostContext();
    const {categoryList} = useCategoryContext();
    const {tagList} = useTagContext();

    const postListData = useMemo(() => {
        return postList;
    }, [postList]);

    const handlePageChange = (page: number) => {
        updatePostListPagingRequest({page});
    };

    const handlePageSizeChange = (size: number) => {
        updatePostListPagingRequest({size});
    };

    const [sorting, setSorting] = React.useState<SortingState>([])
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
    const [rowSelection, setRowSelection] = React.useState({})

    const table = useReactTable({
        data: postListData,
        columns: postColumns,
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

    useEffect(() => {
        if (postListData) {
            table.setState((prevState) => ({
                ...prevState,
                data: postListData,
            }));
        }
    }, [postListData, table]);


    return (
        <div className={"flex flex-col gap-3"}>
            <TableHeader/>
            <DataTable
                columns={postColumns}
                data={postListData}
                tableFilterConfig={tableFilterConfig}
            />
            <DataTablePagination totalPages={paging.totalPages} currentPage={paging.currentPage}
                                 onPageChange={handlePageChange} onPageSizeChange={handlePageSizeChange}/>
        </div>
    );
}
