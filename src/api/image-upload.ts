import axiosInstance from "@/config/axiosConfig";
import {ImageRequest, ImageResponse} from "@/types/image";

export const imageUpload = async (request: ImageRequest): Promise<ImageResponse> => {
    const formData = new FormData();
    formData.append("image", request.image);

    try {
        const response = await axiosInstance.post<ImageResponse>("/uploads/image", formData, {
            headers: {"Content-Type": "multipart/form-data"},
        });

        return response.data;
    } catch (error) {
        console.error("Image upload failed", error);
        throw new Error("Failed to upload image");
    }
};
