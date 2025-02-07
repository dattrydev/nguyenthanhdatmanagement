"use client";

import {createContext, ReactNode, useCallback, useContext, useEffect, useState} from "react";
import {ErrorResponse} from "@/types/error/error-response";
import {PagingResponse} from "@/types/api-response";
import {Category} from "@/types/dashboard/category";
import {createCategoryApi, getCategoryListApi} from "@/api/category";

interface CategoryContextType {
    categoryList: Category[];
    paging: PagingResponse;

    getCategoryList: () => Promise<Category[] | ErrorResponse>;
    createCategory: (categoryData: Category) => Promise<Category | ErrorResponse>;
}

export const CategoryContext = createContext<CategoryContextType | undefined>(undefined);

export const CategoryProvider = ({children}: { children: ReactNode }) => {
    const [categoryList, setCategoryList] = useState<Category[]>([]);
    const [paging, setPaging] = useState<PagingResponse>({
        totalPages: 0,
        totalRecords: 0,
        currentPage: 0,
    });

    const getCategoryList = useCallback(async () => {
        const response = await getCategoryListApi();
        if ("status" in response) {
            console.error("Error fetching categories:", response.message);
            return response;
        }
        setCategoryList(response.categories);
        return response.categories;
    }, []);

    const createCategory = useCallback(async (categoryData: Category) => {
        const response = await createCategoryApi(categoryData);
        if ("status" in response) {
            console.error("Error creating category:", response);
            return response;
        }
        setCategoryList((prev) => [response, ...prev]);
        return response;
    }, []);

    useEffect(() => {
        const fetchCategoryList = async () => {
            const categoryListPagingResponse = await getCategoryListApi();
            if ("status" in categoryListPagingResponse) {
                return;
            }
            setCategoryList(categoryListPagingResponse.categories);
            setPaging({
                totalPages: categoryListPagingResponse.totalPages,
                totalRecords: categoryListPagingResponse.totalRecords,
                currentPage: categoryListPagingResponse.currentPage,
            });
        };

        fetchCategoryList();
    }, [getCategoryList]);

    return (
        <CategoryContext.Provider value={{categoryList, paging, getCategoryList, createCategory}}>
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