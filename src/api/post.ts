import axiosInstance from "@/config/axiosConfig";
import {ErrorResponse} from "@/types/error/error-response";
import {CreatePost, Post, PostListPagingRequest, PostListResponse} from "@/types/dashboard/post";
import {handleError} from "@/utils/handle-error";

export const getPostListApi = async (postRequest: PostListPagingRequest): Promise<PostListResponse | ErrorResponse> => {
    try {
        const response = await axiosInstance.get<PostListResponse>("/posts", {params: postRequest});
        return response.data;
    } catch (error) {
        return handleError(error);
    }
};

export const checkUniquePostApi = async (field: string, value: string): Promise<boolean> => {
    try {
        const response = await axiosInstance.get<boolean>(`/posts/check-unique?field=${field}&value=${value}`);
        return response.data;
    } catch (error) {
        console.error("Error in checkUniquePostApi:", handleError(error));
        return false;
    }
}

export const createPostApi = async (createPost: CreatePost): Promise<Post | ErrorResponse> => {
    try {
        const response = await axiosInstance.post<Post>("/posts", createPost);
        return response.data;
    } catch (error) {
        console.error("Error in createPostApi:", handleError(error));
        return handleError(error);
    }
};
