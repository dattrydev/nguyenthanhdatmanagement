"use client";

import {createContext, ReactNode, useCallback, useContext, useEffect, useState} from "react";
import {CreatePost, Post, PostList} from "@/types/dashboard/post";
import {getCategoryListApi, createPostApi} from "@/api/post";
import {ErrorResponse} from "@/types/error/error-response";
import {PagingResponse} from "@/types/api-response";
import {handleError} from "@/utils/handle-error";

interface PostContextType {
    postList: PostList[];
    paging: PagingResponse;

    getPostList: () => Promise<PostList[] | ErrorResponse>;
    createPost: (createPost: CreatePost) => Promise<Post | ErrorResponse>;
}

export const PostContext = createContext<PostContextType | undefined>(undefined);

export const PostProvider = ({children}: { children: ReactNode }) => {
    const [postList, setPostList] = useState<PostList[]>([]);
    const [paging, setPaging] = useState<PagingResponse>({
        totalPages: 0,
        totalRecords: 0,
        currentPage: 0,
    });

    const getPostList = useCallback(async () => {
        const response = await getCategoryListApi();
        if ("status" in response) {
            console.error("Error fetching posts:", response.message);
            return response;
        }
        setPostList(response.posts);
        return response.posts;
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
            const postListPagingResponse = await getCategoryListApi();
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
    }, [getPostList]);

    return (
        <PostContext.Provider value={{postList, paging, getPostList, createPost}}>
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