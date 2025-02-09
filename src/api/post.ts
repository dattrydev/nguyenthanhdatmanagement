import {CreatePost, Post, PostListPagingRequest, PostListResponse, UpdatePost} from "@/types/dashboard/post";
import {apiDelete, apiGet, apiPatch, apiPost} from "@/utils/api-request";

export const getPostListApi = async (postRequest: PostListPagingRequest): Promise<PostListResponse> => {
    return await apiGet("posts", postRequest);
}

export const getPostBySlugApi = async (request: string): Promise<Post> => {
    return await apiGet("posts/" + request);
}

export const checkUniquePostApi = async (field: string, value: string): Promise<boolean> => {
    return await apiGet(`posts/check-unique?field=${field}&value=${value}`);
}

export const createPostApi = async (createPost: CreatePost): Promise<Post> => {
    return await apiPost("posts", createPost);
}

export const updatePostApi = async (id: string, updatePost: UpdatePost): Promise<Post> => {
    return await apiPatch(`posts/${id}`, updatePost);
}

export const deletePostApi = async (id: string): Promise<void> => {
    return await apiDelete(`posts/${id}/delete`);
}