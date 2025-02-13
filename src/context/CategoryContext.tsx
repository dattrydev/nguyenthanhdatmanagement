"use client";

import {createContext, ReactNode, useCallback, useContext, useEffect, useState} from "react";
import {ErrorResponse, isErrorResponse} from "@/types/error/error-response";
import {PagingResponse} from "@/types/paging";
import {
    Category,
    CategoryList,
    CategoryListPagingRequest,
    CreateCategory,
    UpdateCategory
} from "@/types/dashboard/category";
import {
    checkUniqueCategoryApi,
    createCategoryApi, deleteCategoriesApi, deleteCategoryApi,
    getCategoryBySlugApi,
    getCategoryListApi,
    updateCategoryApi
} from "@/api/category";
import {useDebounce} from "use-debounce";
import {handleError} from "@/utils/handle-error";

interface CategoryContextType {
    categoryList: CategoryList[];
    categoryListPagingRequest: CategoryListPagingRequest;
    updateCategoryListPagingRequest: (updates: Partial<CategoryListPagingRequest>) => void;
    paging: PagingResponse;

    getCategoryList: () => Promise<CategoryList[] | ErrorResponse>;
    getCategoryBySlug: (slug: string) => Promise<Category | ErrorResponse>;
    checkUniqueCategory: (field: string, value: string) => Promise<boolean | ErrorResponse>;

    createCategory: (categoryData: CreateCategory) => Promise<Category | ErrorResponse>;
    updateCategory: (id: string, categoryData: UpdateCategory) => Promise<Category | ErrorResponse>;
    deleteCategory: (id: string) => Promise<void | ErrorResponse>;
    deleteCategories: (ids: string[]) => Promise<void | ErrorResponse>;
}

export const CategoryContext = createContext<CategoryContextType | undefined>(undefined);

export const CategoryProvider = ({children}: { children: ReactNode }) => {
    const [categoryList, setCategoryList] = useState<CategoryList[]>([]);
    const [categoryListPagingRequest, setCategoryListPagingRequest] = useState<CategoryListPagingRequest>({});
    const [debouncedCategoryListPagingRequest] = useDebounce(categoryListPagingRequest, 500);

    const [paging, setPaging] = useState<PagingResponse>({
        totalPages: 0,
        currentPage: 0,
    });

    const updateCategoryListPagingRequest = useCallback((updates: Partial<CategoryListPagingRequest> & {
        [key: string]: any
    }) => {
        const formattedUpdates: Record<string, any> = {};

        Object.keys(updates).forEach((key) => {
            if (Array.isArray(updates[key])) {
                formattedUpdates[key] = updates[key].join(",");
            } else {
                formattedUpdates[key] = updates[key];
            }
        });

        setCategoryListPagingRequest(prev => ({
            ...prev,
            ...formattedUpdates,
        }));
    }, []);

    const getCategoryList = useCallback(async (): Promise<Category[] | ErrorResponse> => {
        try {
            const response = await getCategoryListApi(debouncedCategoryListPagingRequest);

            setCategoryList(response.categories);
            return response.categories;
        } catch (error) {
            console.log("Error getting category list:", error);
            return handleError(error);
        }
    }, [debouncedCategoryListPagingRequest]);

    const getCategoryBySlug = useCallback(async (slug: string): Promise<Category | ErrorResponse> => {
        try {
            const response = await getCategoryBySlugApi(slug);
            if (isErrorResponse(response)) {
                return handleError(response);
            }

            return response;
        } catch (error) {
            console.log("Error getting category by slug:", error);
            return handleError(error);
        }
    }, []);

    const checkUniqueCategory = useCallback(async (field: string, value: string): Promise<boolean | ErrorResponse> => {
        try {
            const response = await checkUniqueCategoryApi(field, value);
            if (isErrorResponse(response)) {
                return handleError(response);
            }

            return response;
        } catch (error) {
            console.log("Error checking unique category:", error);
            return handleError(error);
        }
    }, []);

    const createCategory = useCallback(async (categoryData: CreateCategory): Promise<Category | ErrorResponse> => {
        const response = await createCategoryApi(categoryData);
        if (isErrorResponse(response)) {
            return handleError(response);
        }
        setCategoryList((prev) => [response, ...prev]);
        return response;
    }, []);

    const updateCategory = useCallback(async (id: string, categoryData: UpdateCategory): Promise<Category | ErrorResponse> => {
        try {
            const response = await updateCategoryApi(id, categoryData);
            if (isErrorResponse(response)) {
                return handleError(response);
            }

            setCategoryList((prev) => prev.map((category) => category.id === id ? response : category));
            return response;
        } catch (error) {
            console.log("Error updating category:", error);
            return handleError(error);
        }
    }, []);

    const deleteCategory = useCallback(async (id: string): Promise<void | ErrorResponse> => {
        try {
            const response = await deleteCategoryApi(id);
            if (isErrorResponse(response)) {
                return handleError(response);
            }

            setCategoryList((prev) => prev.filter((category) => category.id !== id));
            return response;
        } catch (error) {
            console.log("Error deleting category:", error);
            return handleError(error);
        }
    }, []);

    const deleteCategories = useCallback(async (ids: string[]): Promise<void | ErrorResponse> => {
        try {
            const response = await deleteCategoriesApi(ids);
            if (isErrorResponse(response)) {
                return handleError(response);
            }

            setCategoryList((prev) => prev.filter((category) => !ids.includes(category.id)));
            return response;
        } catch (error) {
            console.log("Error deleting categories:", error);
            return handleError(error);
        }
    }, []);

    useEffect(() => {
        const fetchCategoryList = async () => {
            const categoryListPagingResponse = await getCategoryListApi(categoryListPagingRequest);
            if (isErrorResponse(categoryListPagingResponse)) {
                return handleError(categoryListPagingResponse);
            }

            setCategoryList(categoryListPagingResponse.categories);
            setPaging({
                totalPages: categoryListPagingResponse.totalPages,
                currentPage: categoryListPagingResponse.currentPage,
            });
        };

        fetchCategoryList();
    }, [categoryListPagingRequest, getCategoryList]);

    return (
        <CategoryContext.Provider value={{
            categoryList,
            categoryListPagingRequest,
            updateCategoryListPagingRequest,
            paging,

            getCategoryList,
            getCategoryBySlug,
            checkUniqueCategory,

            createCategory,
            updateCategory,
            deleteCategory,
            deleteCategories,
        }}>
            {children}
        </CategoryContext.Provider>
    );
};

export const useCategoryContext = () => {
    const context = useContext(CategoryContext);
    if (context === undefined) {
        throw new Error("useCategoryContext must be used within a PostProvider");
    }
    return context;
}