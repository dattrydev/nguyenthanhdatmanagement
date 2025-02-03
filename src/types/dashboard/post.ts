import {Tag} from "@/types/dashboard/tag";
import {Category} from "@/types/dashboard/category";
import {UUID} from "node:crypto";
import {PagingResponse} from "@/types/api-response";

enum PostStatus {
    PUBLISHED = "PUBLISHED",
    DRAFT = "DRAFT",
    ARCHIVED = "ARCHIVED",
}

export interface Post {
    id: UUID;
    title: string;
    content: string;
    status: PostStatus;
    readingTime: number;
    slug: string;
    category: Category;
    tags: Tag[];
    thumbnailUrl: string;
}

export type PostList = Pick<Post, "title" | "status" | "slug"> & {
    category_name: string;
    tags_name: string;
}

export interface PostListResponse extends PagingResponse {
    posts: PostList[];
}