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
import {useMemo, useEffect, useCallback} from "react";
import {getTableFilterConfig} from "@/components/custom/TableFilterConfig";
import {PostStatusOptions} from "@/types/dashboard/post";
import {useCategoryContext} from "@/context/CategoryContext";
import {useTagContext} from "@/context/TagContext";
import {DataTablePagination} from "@/components/custom/DataTablePagination";
import {useRouter} from "next/navigation";

export default function Page() {
    const {postList, paging, updatePostListPagingRequest} = usePostContext();
    const {categoryList} = useCategoryContext();
    const {tagList} = useTagContext();

    const router = useRouter();

    const postListData = useMemo(() => {
        return postList;
    }, [postList]);

    const handlePageChange = useCallback((page: number) => {
        updatePostListPagingRequest({page});
    }, [updatePostListPagingRequest]);

    const handlePageSizeChange = useCallback((size: number) => {
        updatePostListPagingRequest({size});
    }, [updatePostListPagingRequest]);

    const handleCreatePost = useCallback(() => {
        router.push("/dashboard/post/create");
    }, [router]);

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

    const tableFilterConfig = useMemo(() => {
        return (
            getTableFilterConfig([
                {key: "title", label: "title", type: "text"},
                {
                    key: "status",
                    label: "Status",
                    type: "multi-select",
                    options: PostStatusOptions,
                },
                {
                    key: "reading_time",
                    label: "Reading Time",
                    type: "number",
                },
                {
                    key: "category",
                    label: "Category",
                    type: "multi-select",
                    options: categoryList.map((category) => ({label: category.name, value: category.id})),
                },
                {
                    key: "tags",
                    label: "Tags",
                    type: "multi-select",
                    options: tagList.map((tag) => ({label: tag.name, value: tag.id})),
                }
            ]));
    }, [categoryList, tagList]);

    const handleFilterChange = useCallback((filters: Record<string, any>) => {
        const formattedFilters: Record<string, any> = {};

        Object.keys(filters).forEach((key) => {
            if (Array.isArray(filters[key])) {
                formattedFilters[key] = filters[key].join(",");
            } else {
                formattedFilters[key] = filters[key];
            }
        });

        updatePostListPagingRequest(formattedFilters);
    }, [updatePostListPagingRequest]);


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
            <TableHeader handleCreatePost={handleCreatePost}/>
            <DataTable
                columns={postColumns}
                data={postListData}
                tableFilterConfig={tableFilterConfig}
                onChangeFilter={handleFilterChange}
            />
            <DataTablePagination totalPages={paging.totalPages} currentPage={paging.currentPage}
                                 onPageChange={handlePageChange} onPageSizeChange={handlePageSizeChange}/>
        </div>
    );
}
