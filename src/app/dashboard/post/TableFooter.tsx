import * as React from "react";
import {PostList} from "@/types/dashboard/post";
import {Table} from "@tanstack/table-core";
import {DataTablePagination} from "@/components/custom/DataTablePagination";

interface TableFooterProps {
    table: Table<PostList>;
}

export const TableFooter = ({table}: TableFooterProps) => {
    return (
        <div className="">
            <DataTablePagination table={table}/>
        </div>
    );
};