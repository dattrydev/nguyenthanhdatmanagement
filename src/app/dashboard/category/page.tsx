"use client";

import * as React from "react";
import {
    getCoreRowModel,
    useReactTable,
} from "@tanstack/react-table";
import {DataTable} from "@/components/custom/DataTable";
import {TableHeader} from "@/app/dashboard/category/TableHeader";
import {useMemo, useEffect, useCallback, useState} from "react";
import {getTableFilterConfig} from "@/components/custom/TableFilterConfig";
import {useCategoryContext} from "@/context/CategoryContext";
import {DataTablePagination} from "@/components/custom/DataTablePagination";
import {useRouter} from "next/navigation";
import {toast} from "@/hooks/use-toast";
import {categoryColumns} from "@/app/dashboard/category/categoryColumns";
import {isErrorResponse} from "@/types/error/error-response";

export default function Page() {
    const {
        categoryList,
        paging,
        updateCategoryListPagingRequest,
        deleteCategories
    } = useCategoryContext();

    const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({});
    const [sortColumn, setSortColumn] = useState<string>("");

    const router = useRouter();

    const categoryListData = useMemo(() => {
        return categoryList;
    }, [categoryList]);

    const handlePageChange = useCallback((page: number) => {
        updateCategoryListPagingRequest({page});
    }, [updateCategoryListPagingRequest]);

    const handlePageSizeChange = useCallback((size: number) => {
        updateCategoryListPagingRequest({size});
    }, [updateCategoryListPagingRequest]);

    const handleCreateCategory = useCallback(() => {
        router.push("/dashboard/category/create");
    }, [router]);

    const table = useReactTable({
        data: categoryListData,
        columns: categoryColumns,
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

        updateCategoryListPagingRequest(formattedFilters);
    }, [updateCategoryListPagingRequest]);


    const handleDeleteCategories = useCallback(async () => {
        const selectedCategoryIds = Object.keys(rowSelection);

        try {
            const response = await deleteCategories(selectedCategoryIds);

            if (isErrorResponse(response)) {
                throw new Error(response.message || "An error occurred while deleting categories.");
            }

            toast({
                title: "Success",
                description: "Categories deleted successfully",
            });
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.message || "Error deleting categories",
                variant: "destructive",
            });
        }
    }, [deleteCategories, rowSelection]);


    useEffect(() => {
        if (categoryListData) {
            table.setState((prevState) => ({
                ...prevState,
                data: categoryListData,
            }));
        }
    }, [categoryListData, table]);

    useEffect(() => {
        const sortDirection = sortColumn.includes("-") ? "desc" : "asc";
        const sortBy = sortColumn.replace("-", "");
        if (sortColumn) {
            updateCategoryListPagingRequest({sortBy, sortDirection});
        }
    }, [sortColumn, updateCategoryListPagingRequest]);

    return (
        <div className={"flex flex-col gap-3"}>
            <TableHeader rowSelection={rowSelection} handleCreateCategory={handleCreateCategory}
                         handleDeleteCategorys={handleDeleteCategories}/>
            <DataTable
                columns={categoryColumns}
                data={categoryListData}
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
