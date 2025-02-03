import axiosInstance from "@/config/axiosConfig";
import {ErrorResponse} from "@/types/error/error-response";
import {PostListResponse} from "@/types/dashboard/post";
import {handleError} from "@/utils/handle-error";

export const getPostListApi = async (): Promise<PostListResponse | ErrorResponse> => {
    try {
        const response = await axiosInstance.get<PostListResponse>("/posts");
        return response.data;
    } catch (error) {
        const handledError = handleError(error);
        console.log(handledError);
        return handledError;
    }
};
