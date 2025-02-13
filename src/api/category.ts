import {Category, CategoryListPagingRequest, CategoryListResponse, CreateCategory} from "@/types/dashboard/category";
import {apiDelete, apiGet, apiPatch, apiPost} from "@/utils/api-request";

export const getCategoryListApi = async (categoryListPagingRequest: CategoryListPagingRequest): Promise<CategoryListResponse> => {
    return await apiGet("categories", categoryListPagingRequest);
};

export const getCategoryBySlugApi = async (request: string): Promise<Category> => {
    return await apiGet("categories/" + request);
}

export const checkUniqueCategoryApi = async (field: string, value: string): Promise<boolean> => {
    return await apiGet(`categories/check-unique?field=${field}&value=${value}`);
};

export const createCategoryApi = async (createCategory: CreateCategory): Promise<Category> => {
    return await apiPost("categories", createCategory);
};

export const updateCategoryApi = async (id: string, updateCategory: CreateCategory): Promise<Category> => {
    return await apiPatch(`categories/${id}`, updateCategory);
};

export const deleteCategoryApi = async (id: string): Promise<void> => {
    return await apiDelete(`categories/${id}`);
};

export const deleteCategoriesApi = async (ids: string[]): Promise<void> => {
    return await apiDelete(`categories`, ids);
}
