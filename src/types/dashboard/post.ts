import {Tag} from "@/types/dashboard/tag";
import {Category} from "@/types/dashboard/category";
import {PagingResponse} from "@/types/api-response";
import {z} from "zod";

export enum PostStatus {
    PUBLISHED = "PUBLISHED",
    DRAFT = "DRAFT",
    ARCHIVED = "ARCHIVED",
}

export const PostStatusOptions = [
    {label: "Published", value: PostStatus.PUBLISHED},
    {label: "Draft", value: PostStatus.DRAFT},
    {label: "Archived", value: PostStatus.ARCHIVED},
];

export interface Post {
    id: string;
    title: string;
    content: string;
    status: PostStatus;
    readingTime: number;
    slug: string;
    category: Category;
    tags: Tag[];
}

export type PostList = Pick<Post, "title" | "status" | "slug"> & {
    category_name: string;
    tags_name: string;
}

export interface PostListResponse extends PagingResponse {
    posts: PostList[];
}

export interface CreatePost {
    title: string;
    content: string;
    status: PostStatus;
    category_id: string;
    tag_ids: string[];
}

export const createPostSchema = z.object({
    title: z.string().min(1, "Title is required").optional(),
    content: z.string().min(1, "Content is required").optional(),
    status: z.nativeEnum(PostStatus),
    category_id: z.string().uuid("Category ID must be a valid UUID"),
    tag_ids: z.array(z.string().uuid("Tag ID must be a valid UUID")).optional(),
});


export const validateCreatePost = (data: unknown) => {
    try {
        return createPostSchema.parse(data);
    } catch (error) {
        console.error("Validation failed", error);
        throw error;
    }
};