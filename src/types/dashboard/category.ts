import {PagingRequest, PagingResponse} from "@/types/paging";
import {z} from "zod";

export interface Category {
    id: string;
    name: string;
    slug: string;
}

export type CategoryList = Pick<Category, "id" | "name" | "slug">;

export interface CategoryListResponse extends PagingResponse {
    categories: Category[];
}

export type CategoryListPagingRequest = Partial<PagingRequest & CategoryList>;

export interface CreateCategory {
    name: string;
}

export interface UpdateCategory extends CreateCategory {
    id: string;
}

export const createCategorySchema = z.object({
    name: z.string().min(1, "Name is required"),
});

export const validateCreateCategory = (data: unknown) => {
    const result = createCategorySchema.safeParse(data);

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