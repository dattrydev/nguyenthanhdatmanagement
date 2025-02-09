import {Tag} from "@/types/dashboard/tag";
import {Category} from "@/types/dashboard/category";
import {PagingRequest, PagingResponse} from "@/types/api";
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

export type PostList = Pick<Post, "id" | "title" | "status" | "slug"> & {
    category_name: string;
    tags_name: string;
}

export type PostListPagingRequest = Partial<PagingRequest & PostList>;

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

export interface UpdatePost extends CreatePost {
    id: string;
}

export const createPostSchema = z.object({
    title: z.string().min(1, "Title is required"),
    content: z.string()
        .min(10, "Post content must be at least 10 characters")
        .max(10000, "Post content cannot exceed 10000 characters"),
    status: z.nativeEnum(PostStatus),
    category_id: z.string().uuid("Category ID must be a valid UUID"),
    tag_ids: z.array(z.string().uuid("Tag ID must be a valid UUID")).min(1, "At least one tag is required"),
});

export const validateCreatePost = (data: unknown) => {
    const result = createPostSchema.safeParse(data);

    if (!result.success) {
        const errors: Record<string, string> = {};
        result.error.errors.forEach((err) => {
            if (err.path.length > 0) {
                errors[err.path[0]] = err.message;
            }
        });
        return errors;
    }

    return null;
};

