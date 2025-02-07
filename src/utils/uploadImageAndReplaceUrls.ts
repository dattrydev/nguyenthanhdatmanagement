import {ImageRequest, ImageResponse} from "@/types/image";
import {ErrorResponse} from "@/types/error/error-response";

export const uploadImageAndReplaceUrls = async (
    content: string,
    uploadImage: (imageRequest: ImageRequest) => Promise<ImageResponse | ErrorResponse>
): Promise<string> => {
    const imgRegex = /<img[^>]+src="([^">]+)"/g;
    let match;
    const uploadPromises: Promise<{ oldSrc: string; newSrc: string }>[] = [];

    while ((match = imgRegex.exec(content)) !== null) {
        const imgSrc = match[1];

        // Kiểm tra nếu imgSrc là đường dẫn cục bộ (file:// hoặc đường dẫn không phải HTTP)
        if (!imgSrc.startsWith("http") || imgSrc.startsWith("file://")) {
            try {
                // Tạo File từ đường dẫn ảnh cục bộ
                const response = await fetch(imgSrc);
                const blob = await response.blob();
                const file = new File([blob], `image_${Date.now()}.jpg`, {type: blob.type});

                // Gửi file lên server để lấy URL mới
                const uploadResponse = await uploadImage({image: file});

                if ("url" in uploadResponse) {
                    uploadPromises.push(Promise.resolve({oldSrc: imgSrc, newSrc: uploadResponse.url}));
                }
            } catch (error) {
                console.error("Lỗi khi tải ảnh từ local:", error);
            }
        }
    }

    const uploadedImages = await Promise.all(uploadPromises);

    // Thay thế URL cũ bằng URL mới trong content
    let newContent = content;
    uploadedImages.forEach(({oldSrc, newSrc}) => {
        newContent = newContent.replace(oldSrc, newSrc);
    });

    return newContent;
};
