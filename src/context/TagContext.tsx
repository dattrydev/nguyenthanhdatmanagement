"use client";

import {createContext, ReactNode, useCallback, useContext, useEffect, useState} from "react";
import {ErrorResponse} from "@/types/error/error-response";
import {PagingResponse} from "@/types/api-response";
import {Tag} from "@/types/dashboard/tag";
import {createTagApi, getTagListApi} from "@/api/tag";

interface TagContextType {
    tagList: Tag[];
    paging: PagingResponse;

    getTagList: () => Promise<Tag[] | ErrorResponse>;
    createTag: (tagData: Tag) => Promise<Tag | ErrorResponse>;
}

export const TagContext = createContext<TagContextType | undefined>(undefined);

export const TagProvider = ({children}: { children: ReactNode }) => {
    const [tagList, setTagList] = useState<Tag[]>([]);
    const [paging, setPaging] = useState<PagingResponse>({
        totalPages: 0,
        totalRecords: 0,
        currentPage: 0,
    });

    const getTagList = useCallback(async () => {
        const response = await getTagListApi();
        if ("status" in response) {
            console.error("Error fetching categories:", response.message);
            return response;
        }
        setTagList(response.tags);
        return response.tags;
    }, []);

    const createTag = useCallback(async (tagData: Tag) => {
        const response = await createTagApi(tagData);
        if ("status" in response) {
            console.error("Error creating tag:", response);
            return response;
        }
        setTagList((prev) => [response, ...prev]);
        return response;
    }, []);

    useEffect(() => {
        const fetchTagList = async () => {
            const tagListPagingResponse = await getTagListApi();
            if ("status" in tagListPagingResponse) {
                return;
            }
            setTagList(tagListPagingResponse.tags);
            setPaging({
                totalPages: tagListPagingResponse.totalPages,
                totalRecords: tagListPagingResponse.totalRecords,
                currentPage: tagListPagingResponse.currentPage,
            });
        };

        fetchTagList();
    }, [getTagList]);

    return (
        <TagContext.Provider value={{tagList, paging, getTagList, createTag}}>
            {children}
        </TagContext.Provider>
    );
};

export const useTagContext = () => {
    const context = useContext(TagContext);
    if (context === undefined) {
        throw new Error("useTagContext must be used within a TagProvider");
    }
    return context;
}