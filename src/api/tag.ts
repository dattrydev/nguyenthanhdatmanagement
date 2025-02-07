import axiosInstance from "@/config/axiosConfig";
import {ErrorResponse} from "@/types/error/error-response";
import {handleError} from "@/utils/handle-error";
import {CreateTag, Tag, TagListResponse} from "@/types/dashboard/tag";

export const getTagListApi = async (): Promise<TagListResponse | ErrorResponse> => {
    try {
        const response = await axiosInstance.get<TagListResponse>("/tags");
        return response.data;
    } catch (error) {
        return handleError(error);
    }
};

export const createTagApi = async (createTag: CreateTag): Promise<Tag | ErrorResponse> => {
    try {
        const response = await axiosInstance.post<Tag>("/tags", createTag);
        return response.data;
    } catch (error) {
        return handleError(error);
    }
};
