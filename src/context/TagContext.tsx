"use client";

import {createContext, ReactNode, useCallback, useContext, useEffect, useState} from "react";
import {ErrorResponse, isErrorResponse} from "@/types/error/error-response";
import {PagingResponse} from "@/types/paging";
import {CreateTag, Tag, TagList, TagListPagingRequest, UpdateTag} from "@/types/dashboard/tag";
import {
    checkUniqueTagApi,
    createTagApi,
    deleteTagApi,
    deleteTagsApi,
    getTagBySlugApi,
    getTagListApi,
    updateTagApi
} from "@/api/tag";
import {useDebounce} from "use-debounce";
import {handleError} from "@/utils/handle-error";

interface TagContextType {
    tagList: TagList[];
    tagListPagingRequest: TagListPagingRequest;
    updateTagListPagingRequest: (updates: Partial<TagListPagingRequest>) => void;
    paging: PagingResponse;

    getTagList: () => Promise<TagList[] | ErrorResponse>;
    getTagBySlug: (slug: string) => Promise<Tag | ErrorResponse>;
    checkUniqueTag: (field: string, value: string) => Promise<boolean | ErrorResponse>;

    createTag: (createTag: CreateTag) => Promise<Tag | ErrorResponse>;
    updateTag: (id: string, updateTag: UpdateTag) => Promise<Tag | ErrorResponse>;
    deleteTag: (id: string) => Promise<void | ErrorResponse>;
    deleteTags: (ids: string[]) => Promise<void | ErrorResponse>;
}

export const TagContext = createContext<TagContextType | undefined>(undefined);

export const TagProvider = ({children}: { children: ReactNode }) => {
    const [tagList, setTagList] = useState<TagList[]>([]);
    const [tagListPagingRequest, setTagListPagingRequest] = useState<TagListPagingRequest>({});
    const [debouncedTagListPagingRequest] = useDebounce(tagListPagingRequest, 500);

    const [paging, setPaging] = useState<PagingResponse>({
        totalPages: 0,
        currentPage: 0,
    });

    const updateTagListPagingRequest = useCallback((updates: Partial<TagListPagingRequest> & {
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

        setTagListPagingRequest((prev) => ({
            ...prev,
            ...formattedUpdates,
        }));
    }, []);

    const getTagList = useCallback(async () => {
        try {
            const response = await getTagListApi(debouncedTagListPagingRequest);
            if (isErrorResponse(response)) {
                return handleError(response);
            }

            setTagList(response.tags);
            return response.tags;
        } catch (error) {
            console.log("Error getting tag list:", error);
            return handleError(error);
        }
    }, [debouncedTagListPagingRequest]);

    const getTagBySlug = useCallback(async (slug: string) => {
        try {
            const response = await getTagBySlugApi(slug);
            if (isErrorResponse(response)) {
                return handleError(response);
            }

            return response;
        } catch (error) {
            console.log("Error getting tag by slug:", error);
            return handleError(error);
        }
    }, []);

    const checkUniqueTag = useCallback(async (field: string, value: string) => {
        try {
            const response = await checkUniqueTagApi(field, value);
            if (isErrorResponse(response)) {
                return handleError(response);
            }

            return response;
        } catch (error) {
            console.log("Error checking unique tag:", error);
            return handleError(error);
        }
    }, []);

    const createTag = useCallback(async (tagData: CreateTag) => {
        try {
            const response = await createTagApi(tagData);
            if (isErrorResponse(response)) {
                return handleError(response);
            }

            setTagList((prev) => [response, ...prev]);
            return response;
        } catch (error) {
            console.log("Error creating tag:", error);
            return handleError(error);
        }
    }, []);

    const updateTag = useCallback(async (id: string, updateTag: UpdateTag) => {
        try {
            const response = await updateTagApi(id, updateTag);
            if (isErrorResponse(response)) {
                return handleError(response);
            }

            setTagList((prev) => prev.map((tag) => tag.id === id ? response : tag));
            return response;
        } catch (error) {
            console.log("Error updating tag:", error);
            return handleError(error);
        }
    }, []);

    const deleteTag = useCallback(async (id: string) => {
        try {
            const response = await deleteTagApi(id);
            if (isErrorResponse(response)) {
                return handleError(response);
            }

            setTagList((prev) => prev.filter((tag) => tag.id !== id));
            return response;
        } catch (error) {
            console.log("Error deleting tag:", error);
            return handleError(error);
        }
    }, []);

    const deleteTags = useCallback(async (ids: string[]) => {
        try {
            const response = await deleteTagsApi(ids);
            if (isErrorResponse(response)) {
                return handleError(response);
            }

            setTagList((prev) => prev.filter((tag) => !ids.includes(tag.id)));
            return response;
        } catch (error) {
            console.log("Error deleting tags:", error);
            return handleError(error);
        }
    }, []);

    useEffect(() => {
        const fetchTagList = async () => {
            const tagListPagingResponse = await getTagListApi(debouncedTagListPagingRequest);
            if (isErrorResponse(tagListPagingResponse)) {
                return handleError(tagListPagingResponse);
            }
            setTagList(tagListPagingResponse.tags);
            setPaging({
                totalPages: tagListPagingResponse.totalPages,
                currentPage: tagListPagingResponse.currentPage,
            });
        };

        fetchTagList();
    }, [debouncedTagListPagingRequest, getTagList]);

    return (
        <TagContext.Provider value={{
            tagList,
            tagListPagingRequest,
            updateTagListPagingRequest,
            paging,
            getTagList,
            getTagBySlug,
            checkUniqueTag,
            createTag,
            updateTag,
            deleteTag,
            deleteTags
        }}>
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