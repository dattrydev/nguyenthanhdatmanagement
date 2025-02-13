import {ImageRequest, ImageResponse} from "@/types/image";
import {ErrorResponse} from "@/types/error/error-response";
import {toast} from "@/hooks/use-toast";

export const uploadImageAndReplaceUrls = async (
    content: string,
    uploadImage: (imageRequest: ImageRequest) => Promise<ImageResponse | ErrorResponse>
): Promise<string> => {
    const imgRegex = /<img[^>]+src="([^">]+)"/g;
    let match;
    const uploadPromises: Promise<{ oldSrc: string; newSrc: string }>[] = [];

    while ((match = imgRegex.exec(content)) !== null) {
        const imgSrc = match[1];

        if (!imgSrc.startsWith("http") || imgSrc.startsWith("file://")) {
            try {
                const response = await fetch(imgSrc);
                const blob = await response.blob();
                const file = new File([blob], `image_${Date.now()}.jpg`, {type: blob.type});

                const uploadResponse = await uploadImage({image: file});

                if ("url" in uploadResponse) {
                    uploadPromises.push(Promise.resolve({oldSrc: imgSrc, newSrc: uploadResponse.url}));
                } else {
                    console.log("Error while uploading image:", uploadResponse);
                    toast({
                        title: "Error",
                        description: "Error while uploading image",
                        variant: "destructive",
                    })
                }
            } catch (error) {
                console.log("Lỗi khi tải ảnh từ local:", error);
                toast({
                    title: "Error",
                    description: "Error while uploading image",
                    variant: "destructive",
                })
            }
        }
    }

    const uploadedImages = await Promise.all(uploadPromises);

    let newContent = content;
    uploadedImages.forEach(({oldSrc, newSrc}) => {
        newContent = newContent.replace(oldSrc, newSrc);
    });

    return newContent;
};
