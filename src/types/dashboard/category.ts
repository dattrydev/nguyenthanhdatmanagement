import {PagingResponse} from "@/types/api-response";

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