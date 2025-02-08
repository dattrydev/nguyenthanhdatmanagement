"use client";

import {createContext, ReactNode, useCallback, useContext, useEffect, useState} from "react";
import {CreatePost, Post, PostList, PostListPagingRequest} from "@/types/dashboard/post";
import {checkUniquePostApi, createPostApi, getPostListApi} from "@/api/post";
import {ErrorResponse} from "@/types/error/error-response";
import {PagingResponse} from "@/types/api";
import {handleError} from "@/utils/handle-error";

interface PostContextType {
    postList: PostList[];
    postListPagingRequest: PostListPagingRequest;
    setPostListPagingRequest: (postListPagingRequest: PostListPagingRequest) => void;
    paging: PagingResponse;

    getPostList: () => Promise<PostList[] | ErrorResponse>;
    checkUniquePost: (field: string, value: string) => Promise<boolean>;
    createPost: (createPost: CreatePost) => Promise<Post | ErrorResponse>;
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

    const getPostList = useCallback(async () => {
        const response = await getPostListApi(postListPagingRequest);
        if ("status" in response) {
            console.error("Error fetching posts:", response.message);
            return response;
        }
        setPostList(response.posts);
        return response.posts;
    }, []);

    const checkUniquePost = useCallback(async (field: string, value: string): Promise<boolean> => {
        try {
            return await checkUniquePostApi(field, value);
        } catch (error) {
            console.error("Error in checkUniquePostApi:", error);
            return false;
        }
    }, []);

    const createPost = useCallback(async (createPost: CreatePost) => {
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
                checkUniquePost,
                createPost
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