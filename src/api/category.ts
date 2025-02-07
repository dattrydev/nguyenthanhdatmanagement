import axiosInstance from "@/config/axiosConfig";
import {ErrorResponse} from "@/types/error/error-response";
import {handleError} from "@/utils/handle-error";
import {Category, CategoryListResponse, CreateCategory} from "@/types/dashboard/category";

export const getCategoryListApi = async (): Promise<CategoryListResponse | ErrorResponse> => {
    try {
        const response = await axiosInstance.get<CategoryListResponse>("/categories");
        return response.data;
    } catch (error) {
        return handleError(error);
    }
};

export const createCategoryApi = async (createCategory: CreateCategory): Promise<Category | ErrorResponse> => {
    try {
        const response = await axiosInstance.post<Category>("/categories", createCategory);
        return response.data;
    } catch (error) {
        return handleError(error);
    }
};
