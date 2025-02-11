"use client";

import {createContext, ReactNode, useCallback, useContext, useEffect, useState} from "react";
import {CreatePost, Post, CategoryList, PostListPagingRequest, UpdatePost} from "@/types/dashboard/post";
import {
    checkUniquePostApi,
    createPostApi,
    deletePostApi, deletePostsApi,
    getPostBySlugApi,
    getPostListApi,
    updatePostApi
} from "@/api/post";
import {PagingResponse} from "@/types/paging";
import {ErrorResponse, isErrorResponse} from "@/types/error/error-response";
import {handleError} from "@/utils/handle-error";
import {useDebounce} from "use-debounce";

interface PostContextType {
    postList: CategoryList[];
    postListPagingRequest: PostListPagingRequest;
    updatePostListPagingRequest: (updates: Partial<PostListPagingRequest>) => void;
    paging: PagingResponse;

    getPostList: () => Promise<CategoryList[] | ErrorResponse>;
    getPostBySlug: (slug: string) => Promise<Post | ErrorResponse>;
    checkUniquePost: (field: string, value: string) => Promise<boolean | ErrorResponse>;

    createPost: (createPost: CreatePost) => Promise<Post | ErrorResponse>;
    updatePost: (id: string, updatePost: UpdatePost) => Promise<Post | ErrorResponse>;
    deletePost: (id: string) => Promise<void | ErrorResponse>;
    deletePosts: (ids: string[]) => Promise<void | ErrorResponse>;
}

export const PostContext = createContext<PostContextType | undefined>(undefined);

export const PostProvider = ({children}: { children: ReactNode }) => {
    const [postList, setPostList] = useState<CategoryList[]>([]);
    const [postListPagingRequest, setPostListPagingRequest] = useState<PostListPagingRequest>({});
    const [debouncedPostListPagingRequest] = useDebounce(postListPagingRequest, 500);

    const [paging, setPaging] = useState<PagingResponse>({
        totalPages: 0,
        currentPage: 0,
    });

    const updatePostListPagingRequest = useCallback((updates: Partial<PostListPagingRequest> & {
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

        setPostListPagingRequest(prev => ({
            ...prev,
            ...formattedUpdates
        }));
    }, []);

    const getPostList = useCallback(async (): Promise<CategoryList[] | ErrorResponse> => {
        try {
            const response = await getPostListApi(debouncedPostListPagingRequest);
            if (isErrorResponse(response)) {
                return handleError(response);
            }

            setPostList(response.posts);
            return response.posts;
        } catch (error) {
            console.log("Error in getPostListApi:", error);
            return handleError(error);
        }
    }, [debouncedPostListPagingRequest]);

    const getPostBySlug = useCallback(async (slug: string): Promise<Post | ErrorResponse> => {
        try {
            const response = await getPostBySlugApi(slug);
            if (isErrorResponse(response)) {
                return handleError(response);
            }

            return response;
        } catch (error) {
            console.log("Error in getPostBySlugApi:", error);
            return handleError(error);
        }
    }, []);

    const checkUniquePost = useCallback(async (field: string, value: string): Promise<boolean | ErrorResponse> => {
        try {
            const response = await checkUniquePostApi(field, value);
            if (isErrorResponse(response)) {
                return handleError(response);
            }

            return response;
        } catch (error) {
            console.log("Error in checkUniquePostApi:", error);
            return handleError(error);
        }
    }, []);

    const createPost = useCallback(async (createPost: CreatePost): Promise<Post | ErrorResponse> => {
        try {
            const response = await createPostApi(createPost);
            if (isErrorResponse(response)) {
                return handleError(response);
            }

            const newPost: CategoryList = {
                ...response,
                category_name: response.category.name,
                tags_name: response.tags.map(tag => tag.name).join(", "),
            };

            setPostList((prev) => [newPost, ...prev]);

            return response;
        } catch (error) {
            console.log("Error creating post:", error);
            return handleError(error);
        }
    }, []);

    const updatePost = useCallback(async (id: string, updatePost: UpdatePost): Promise<Post | ErrorResponse> => {
        try {
            const response = await updatePostApi(id, updatePost);
            if (isErrorResponse(response)) {
                return handleError(response);
            }

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

            return response;
        } catch (error) {
            console.log("Error in updatePostApi:", error);
            return handleError(error);
        }
    }, [postList]);

    const deletePost = useCallback(async (id: string): Promise<void | ErrorResponse> => {
        try {
            const response = await deletePostApi(id);
            if (isErrorResponse(response)) {
                return handleError(response);
            }

            setPostList((prev) => prev.filter(post => post.id !== id));
        } catch (error) {
            console.log("Error in deletePostApi:", error);
            return handleError(error);
        }
    }, []);

    const deletePosts = useCallback(async (ids: string[]): Promise<void | ErrorResponse> => {
        try {
            const response = await Promise.all(ids.map(id => deletePostsApi([id])));
            if (response.some(isErrorResponse)) {
                return handleError(response.find(isErrorResponse));
            }

            setPostList((prev) => prev.filter(post => !ids.includes(post.id)));
        } catch (error) {
            console.log("Error in deletePosts:", error);
            return handleError(error);
        }
    }, []);

    useEffect(() => {
        const fetchPostList = async () => {
            const postListPagingResponse = await getPostListApi(postListPagingRequest);
            if (isErrorResponse(postListPagingResponse)) {
                return handleError(postListPagingResponse);
            }

            setPostList(postListPagingResponse.posts);
            setPaging({
                totalPages: postListPagingResponse.totalPages,
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
                updatePostListPagingRequest,
                paging,

                getPostList,
                getPostBySlug,
                checkUniquePost,

                createPost,
                updatePost,
                deletePost,
                deletePosts,
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