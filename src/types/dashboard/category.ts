import {PagingResponse} from "@/types/paging";

export interface Category {
    id: string;
    name: string;
}

export interface CategoryListResponse extends PagingResponse {
    categories: Category[];
}

export interface CreateCategory {
    name: string;
}