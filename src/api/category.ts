import {Category, CategoryListResponse, CreateCategory} from "@/types/dashboard/category";
import {apiGet, apiPost} from "@/utils/api-request";

export const getCategoryListApi = async (): Promise<CategoryListResponse> => {
    return await apiGet("categories");
};

export const createCategoryApi = async (createCategory: CreateCategory): Promise<Category> => {
    return await apiPost("categories", createCategory);
};
