"use client";

import {ErrorResponse, isErrorResponse} from "@/types/error/error-response";
import {ImageRequest, ImageResponse} from "@/types/image";
import {createContext, ReactNode, useCallback, useContext} from "react";
import {imageUpload} from "@/api/image-upload";
import {handleError} from "@/utils/handle-error";

interface ImageContextType {
    uploadImage: (imageRequest: ImageRequest) => Promise<ImageResponse | ErrorResponse>;
}

export const ImageContext = createContext<ImageContextType | undefined>(undefined);

export const ImageProvider = ({children}: { children: ReactNode }) => {
    const uploadImage = useCallback(async (imageRequest: ImageRequest): Promise<ImageResponse | ErrorResponse> => {
        try {
            const response = await imageUpload(imageRequest);
            if (isErrorResponse(response)) {
                return handleError(response);
            }

            return response;
        } catch (error) {
            console.log("Error uploading image:", error);
            return handleError(error);
        }
    }, []);

    return (
        <ImageContext.Provider value={{uploadImage}}>
            {children}
        </ImageContext.Provider>
    );
};

export const useImageContext = () => {
    const context = useContext(ImageContext);
    if (context === undefined) {
        throw new Error("useImageContext must be used within a ImageProvider");
    }
    return context;
}
