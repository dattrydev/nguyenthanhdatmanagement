import {ImageRequest, ImageResponse} from "@/types/image";
import {apiPost, getFormData} from "@/utils/api-request";

export const imageUpload = async (request: ImageRequest): Promise<ImageResponse> => {
    return await apiPost("uploads/image", getFormData(request));
};
