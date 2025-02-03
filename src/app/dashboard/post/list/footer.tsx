import * as React from "react";
import {PostList} from "@/types/dashboard/post";
import {Table} from "@tanstack/table-core";
import {DataTablePagination} from "@/components/custom/DataTablePagination";

interface FooterProps {
    table: Table<PostList>;
}

export const Footer = ({table}: FooterProps) => {
    return (
        <div className="">
            <DataTablePagination table={table}/>
        </div>
    );
};