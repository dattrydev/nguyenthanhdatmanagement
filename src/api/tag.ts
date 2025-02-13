import {CreateTag, Tag, TagListPagingRequest, TagListResponse, UpdateTag} from "@/types/dashboard/tag";
import {apiDelete, apiGet, apiPatch, apiPost} from "@/utils/api-request";

export const getTagListApi = async (tagListPagingRequest: TagListPagingRequest): Promise<TagListResponse> => {
    return await apiGet("tags", tagListPagingRequest);
};

export const getTagBySlugApi = async (request: string): Promise<Tag> => {
    return await apiGet("tags/" + request);
}

export const checkUniqueTagApi = async (field: string, value: string): Promise<boolean> => {
    return await apiGet(`tags/check-unique?field=${field}&value=${value}`);
};

export const createTagApi = async (createTag: CreateTag): Promise<Tag> => {
    return await apiPost("tags", createTag);
};

export const updateTagApi = async (id: string, updateTag: UpdateTag): Promise<Tag> => {
    return await apiPatch(`tags/${id}`, updateTag);
};

export const deleteTagApi = async (id: string): Promise<void> => {
    return await apiDelete(`tags/${id}`);
};

export const deleteTagsApi = async (ids: string[]): Promise<void> => {
    return await apiDelete(`tags`, ids);
}


