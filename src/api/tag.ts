import {CreateTag, Tag, TagListResponse} from "@/types/dashboard/tag";
import {apiGet, apiPost} from "@/utils/api-request";

export const getTagListApi = async (): Promise<TagListResponse> => {
    return await apiGet("tags");
};

export const createTagApi = async (createTag: CreateTag): Promise<Tag> => {
    return await apiPost("tags", createTag);
};
