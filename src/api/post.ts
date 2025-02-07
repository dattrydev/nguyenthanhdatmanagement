import axiosInstance from "@/config/axiosConfig";
import {ErrorResponse} from "@/types/error/error-response";
import {CreatePost, Post, PostListResponse} from "@/types/dashboard/post";
import {handleError} from "@/utils/handle-error";

export const getCategoryListApi = async (): Promise<PostListResponse | ErrorResponse> => {
    try {
        const response = await axiosInstance.get<PostListResponse>("/posts");
        return response.data;
    } catch (error) {
        return handleError(error);
    }
};

export const createPostApi = async (createPost: CreatePost): Promise<Post | ErrorResponse> => {
    try {
        const response = await axiosInstance.post<Post>("/posts", createPost);
        return response.data;
    } catch (error) {
        console.error("Error in createPostApi:", handleError(error));
        return handleError(error);
    }
};
