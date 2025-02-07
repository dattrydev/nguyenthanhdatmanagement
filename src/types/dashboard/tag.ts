import {PagingResponse} from "@/types/api-response";

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