import {PagingRequest, PagingResponse} from "@/types/paging";
import {z} from "zod";

export interface Tag {
    id: string;
    name: string;
    slug: string;
}

export type TagList = Pick<Tag, "id" | "name" | "slug">;

export interface TagListResponse extends PagingResponse {
    tags: Tag[];
}

export type TagListPagingRequest = Partial<PagingRequest & TagList>;

export interface CreateTag {
    name: string;
}

export interface UpdateTag extends CreateTag {
    id: string;
}

export const createTagSchema = z.object({
    name: z.string().min(1, "Name is required"),
});

export const validateCreateTag = (data: unknown) => {
    const result = createTagSchema.safeParse(data);

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