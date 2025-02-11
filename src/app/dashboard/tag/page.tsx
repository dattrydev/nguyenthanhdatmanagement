"use client";

import {tagColumns} from "@/app/dashboard/tag/tagColumns";
import * as React from "react";
import {
    getCoreRowModel,
    useReactTable,
} from "@tanstack/react-table";
import {DataTable} from "@/components/custom/DataTable";
import {TableHeader} from "@/app/dashboard/tag/TableHeader";
import {useMemo, useEffect, useCallback, useState} from "react";
import {getTableFilterConfig} from "@/components/custom/TableFilterConfig";
import {DataTablePagination} from "@/components/custom/DataTablePagination";
import {useRouter} from "next/navigation";
import {toast} from "@/hooks/use-toast";
import {useTagContext} from "@/context/TagContext";
import {isErrorResponse} from "@/types/error/error-response";

export default function Page() {
    const {
        tagList,
        paging,
        updateTagListPagingRequest,
        deleteTags
    } = useTagContext();

    const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({});
    const [sortColumn, setSortColumn] = useState<string>("");

    const router = useRouter();

    const tagListData = useMemo(() => {
        return tagList;
    }, [tagList]);

    const handlePageChange = useCallback((page: number) => {
        updateTagListPagingRequest({page});
    }, [updateTagListPagingRequest]);

    const handlePageSizeChange = useCallback((size: number) => {
        updateTagListPagingRequest({size});
    }, [updateTagListPagingRequest]);

    const handleCreateTag = useCallback(() => {
        router.push("/dashboard/tag/create");
    }, [router]);

    const table = useReactTable({
        data: tagListData,
        columns: tagColumns,
        getCoreRowModel: getCoreRowModel(),
        onRowSelectionChange: setRowSelection,
        state: {
            rowSelection,
        },
    });

    const tableFilterConfig = useMemo(() => {
        return (
            getTableFilterConfig([
                {key: "name", label: "Name", type: "text"},
            ]));
    }, []);

    const handleFilterChange = useCallback((filters: Record<string, any>) => {
        const formattedFilters: Record<string, any> = {};

        Object.keys(filters).forEach((key) => {
            if (Array.isArray(filters[key])) {
                formattedFilters[key] = filters[key].join(",");
            } else {
                formattedFilters[key] = filters[key];
            }
        });

        updateTagListPagingRequest(formattedFilters);
    }, [updateTagListPagingRequest]);


    const handleDeleteTags = useCallback(async () => {
        const selectedCategoryIds = Object.keys(rowSelection);

        try {
            const response = await deleteTags(selectedCategoryIds);

            if (isErrorResponse(response)) {
                throw new Error(response.message || "An error occurred while deleting tags.");
            }

            toast({
                title: "Success",
                description: "Tags deleted successfully",
            });
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.message || "Error deleting tags",
                variant: "destructive",
            });
        }
    }, [deleteTags, rowSelection]);


    useEffect(() => {
        if (tagListData) {
            table.setState((prevState) => ({
                ...prevState,
                data: tagListData,
            }));
        }
    }, [tagListData, table]);

    useEffect(() => {
        const sortDirection = sortColumn.includes("-") ? "desc" : "asc";
        const sortBy = sortColumn.replace("-", "");
        if (sortColumn) {
            updateTagListPagingRequest({sortBy, sortDirection});
        }
    }, [sortColumn, updateTagListPagingRequest]);

    return (
        <div className={"flex flex-col gap-3"}>
            <TableHeader rowSelection={rowSelection} handleCreateTag={handleCreateTag}
                         handleDeleteTags={handleDeleteTags}/>
            <DataTable
                columns={tagColumns}
                data={tagListData}
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
