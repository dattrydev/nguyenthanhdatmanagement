import {PagingResponse} from "@/types/api";

export interface Tag {
    id: string;
    name: string;
}

export interface TagListResponse extends PagingResponse {
    tags: Tag[];
}

export interface CreateTag {
    name: string;
}