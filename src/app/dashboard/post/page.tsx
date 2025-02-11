"use client";

import {postColumns} from "@/app/dashboard/post/postColumns";
import * as React from "react";
import {
    getCoreRowModel,
    useReactTable,
} from "@tanstack/react-table";
import {DataTable} from "@/components/custom/DataTable";
import {TableHeader} from "@/app/dashboard/post/TableHeader";
import {usePostContext} from "@/context/PostContext";
import {useMemo, useEffect, useCallback, useState} from "react";
import {getTableFilterConfig} from "@/components/custom/TableFilterConfig";
import {PostStatusOptions} from "@/types/dashboard/post";
import {useCategoryContext} from "@/context/CategoryContext";
import {useTagContext} from "@/context/TagContext";
import {DataTablePagination} from "@/components/custom/DataTablePagination";
import {useRouter} from "next/navigation";
import {toast} from "@/hooks/use-toast";

export default function Page() {
    const {postList, paging, updatePostListPagingRequest, deletePosts} = usePostContext();
    const {categoryList} = useCategoryContext();
    const {tagList} = useTagContext();

    const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({});
    const [sortColumn, setSortColumn] = useState<string>("");

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

    const table = useReactTable({
        data: postListData,
        columns: postColumns,
        getCoreRowModel: getCoreRowModel(),
        onRowSelectionChange: setRowSelection,
        state: {
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


    const handleDeletePosts = useCallback(() => {
        const selectedPostIds = Object.keys(rowSelection);
        deletePosts(selectedPostIds)
            .then(() => {
                toast({
                    title: "Success",
                    description: "Posts deleted successfully",
                });

            })
            .catch(() => {
                toast({
                    title: "Error",
                    description: "Error deleting posts",
                    variant: "destructive",
                });
            });
    }, [deletePosts, rowSelection]);

    useEffect(() => {
        if (postListData) {
            table.setState((prevState) => ({
                ...prevState,
                data: postListData,
            }));
        }
    }, [postListData, table]);

    useEffect(() => {
        const sortDirection = sortColumn.includes("-") ? "desc" : "asc";
        const sortBy = sortColumn.replace("-", "");
        if (sortColumn) {
            updatePostListPagingRequest({sortBy, sortDirection});
        }
    }, [sortColumn, updatePostListPagingRequest]);

    useEffect(() => {
        console.log(rowSelection);
    }, [rowSelection]);

    return (
        <div className={"flex flex-col gap-3"}>
            <TableHeader rowSelection={rowSelection} handleCreatePost={handleCreatePost}
                         handleDeletePosts={handleDeletePosts}/>
            <DataTable
                columns={postColumns}
                data={postListData}
                tableFilterConfig={tableFilterConfig}
                onChangeFilter={handleFilterChange}
                sortColumn={sortColumn}
                setSortColumn={setSortColumn}
                rowSelection={rowSelection}
                setRowSelection={setRowSelection}
            />
            <DataTablePagination totalPages={paging.totalPages} currentPage={paging.currentPage}
                                 onPageChange={handlePageChange} onPageSizeChange={handlePageSizeChange}/>
        </div>
    );
}
