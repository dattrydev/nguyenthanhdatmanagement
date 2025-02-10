import {PagingResponse} from "@/types/paging";

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