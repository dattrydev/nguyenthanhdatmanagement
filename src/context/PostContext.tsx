"use client";

import {createContext, ReactNode, useCallback, useContext, useEffect, useState} from "react";
import {CreatePost, Post, PostList, PostListPagingRequest, UpdatePost} from "@/types/dashboard/post";
import {checkUniquePostApi, createPostApi, getPostBySlugApi, getPostListApi, updatePostApi} from "@/api/post";
import {PagingResponse} from "@/types/api";
import {ErrorResponse} from "@/types/error/error-response";
import {handleError} from "@/utils/handle-error";

interface PostContextType {
    postList: PostList[];
    postListPagingRequest: PostListPagingRequest;
    setPostListPagingRequest: (postListPagingRequest: PostListPagingRequest) => void;
    paging: PagingResponse;

    getPostList: () => Promise<PostList[] | ErrorResponse>;
    getPostBySlug: (slug: string) => Promise<Post | ErrorResponse>;
    checkUniquePost: (field: string, value: string) => Promise<boolean | ErrorResponse>;
    createPost: (createPost: CreatePost) => Promise<Post | ErrorResponse>;
    updatePost: (id: string, updatePost: UpdatePost) => Promise<Post | ErrorResponse>;
}

export const PostContext = createContext<PostContextType | undefined>(undefined);

export const PostProvider = ({children}: { children: ReactNode }) => {
    const [postList, setPostList] = useState<PostList[]>([]);
    const [postListPagingRequest, setPostListPagingRequest] = useState<PostListPagingRequest>({});
    const [paging, setPaging] = useState<PagingResponse>({
        totalPages: 0,
        totalRecords: 0,
        currentPage: 0,
    });

    const getPostList = useCallback(async (): Promise<PostList[] | ErrorResponse> => {
        try {
            const response = await getPostListApi(postListPagingRequest);
            setPostList(response.posts);
            return response.posts;
        } catch (error) {
            console.error("Error in getPostListApi:", error);
            return handleError(error);
        }
    }, [postListPagingRequest]);

    const getPostBySlug = useCallback(async (slug: string): Promise<Post | ErrorResponse> => {
        try {
            return await getPostBySlugApi(slug);
        } catch (error) {
            console.error("Error in getPostBySlugApi:", error);
            return handleError(error);
        }
    }, []);

    const checkUniquePost = useCallback(async (field: string, value: string): Promise<boolean | ErrorResponse> => {
        try {
            return await checkUniquePostApi(field, value);
        } catch (error) {
            console.error("Error in checkUniquePostApi:", error);
            return handleError(error);
        }
    }, []);

    const createPost = useCallback(async (createPost: CreatePost): Promise<Post | ErrorResponse> => {
        try {
            const response = await createPostApi(createPost);

            if (response && "id" in response) {
                const newPost: PostList = {
                    ...response,
                    category_name: response.category.name,
                    tags_name: response.tags.map(tag => tag.name).join(", "),
                };

                setPostList((prev) => [newPost, ...prev]);
            }
            return response;
        } catch (error) {
            console.log("Error creating post:", error);
            return handleError(error);
        }
    }, []);

    const updatePost = useCallback(async (id: string, updatePost: UpdatePost): Promise<Post | ErrorResponse> => {
        try {
            console.log("updatePost", updatePost);
            const response = await updatePostApi(id, updatePost);
            if (response) {
                const updatedPostList = postList.map(post => {
                    if (post.id === id) {
                        return {
                            ...post,
                            ...response,
                            category_name: response.category.name,
                            tags_name: response.tags.map(tag => tag.name).join(", "),
                        };
                    }
                    return post;
                });
                setPostList(updatedPostList);
            }
            return response;
        } catch (error) {
            console.error("Error in updatePostApi:", error);
            return handleError(error);
        }
    }, []);

    useEffect(() => {
        const fetchPostList = async () => {
            const postListPagingResponse = await getPostListApi(postListPagingRequest);
            if ("status" in postListPagingResponse) {
                return;
            }
            setPostList(postListPagingResponse.posts);
            setPaging({
                totalPages: postListPagingResponse.totalPages,
                totalRecords: postListPagingResponse.totalRecords,
                currentPage: postListPagingResponse.currentPage,
            });
        };

        fetchPostList();
    }, [getPostList, postListPagingRequest]);

    return (
        <PostContext.Provider
            value={{
                postList,
                postListPagingRequest,
                setPostListPagingRequest,
                paging,
                getPostList,
                getPostBySlug,
                checkUniquePost,
                createPost,
                updatePost
            }}>
            {children}
        </PostContext.Provider>
    );
};

export const usePostContext = () => {
    const context = useContext(PostContext);
    if (context === undefined) {
        throw new Error("usePostContext must be used within a PostProvider");
    }
    return context;
}