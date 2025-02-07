"use client";
import {useState} from "react";
import {Input} from "@/components/ui/input";
import {validateCreatePost, CreatePost, PostStatus, PostStatusOptions} from "@/types/dashboard/post";
import {z} from "zod";
import Editor from "@/components/Tiptap/Editor";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {useCategoryContext} from "@/context/CategoryContext";
import {useTagContext} from "@/context/TagContext";
import {MultiSelect} from "@/components/custom/MultiSelect";
import {Button} from "@/components/ui/button";
import {usePostContext} from "@/context/PostContext";
import {useToast} from "@/hooks/use-toast";
import {useRouter} from "next/navigation";
import {navigateToSidebarItem} from "@/utils/navigateToSidebarItem";
import {uploadImageAndReplaceUrls} from "@/utils/uploadImageAndReplaceUrls";
import {useImageContext} from "@/context/ImageContext";

export default function Page() {
    const {categoryList} = useCategoryContext();
    const {tagList} = useTagContext();
    const {createPost} = usePostContext();
    const {uploadImage} = useImageContext();

    const {toast} = useToast()
    const router = useRouter();

    const [formData, setFormData] = useState<CreatePost>({
        title: "",
        content: "",
        status: PostStatus.DRAFT,
        category_id: "",
        tag_ids: [],
    });
    const [errors, setErrors] = useState<Record<string, string>>({});

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        try {
            validateCreatePost(formData);
            console.log("formData", formData);

            // Chờ content được cập nhật với URL mới
            const newContent = await uploadImageAndReplaceUrls(formData.content, uploadImage);
            console.log("newContent", newContent);

            // Cập nhật lại formData với content mới
            const updatedFormData = {...formData, content: newContent};
            setFormData(updatedFormData);

            // Gửi bài viết sau khi content đã được cập nhật
            const response = await createPost(updatedFormData);
            if (response) {
                toast({
                    title: "Success",
                    description: "Post created successfully",
                });

                router.push(navigateToSidebarItem("Post List"));
            }
            setErrors({});
        } catch (error) {
            if (error instanceof z.ZodError) {
                const fieldErrors: Record<string, string> = {};
                error.errors.forEach((err) => {
                    if (err.path) {
                        fieldErrors[err.path.join(".")] = err.message;
                    }
                });
                setErrors(fieldErrors);
            } else {
                console.error("Unexpected error:", error);
            }
            toast({
                title: "Error",
                description: "Error creating post",
            });
        }
    };

    const handleContentChange = (newContent: string) => {
        setFormData({
            ...formData,
            content: newContent
        });
    };

    return (
        <main className="flex flex-col gap-2">
            <label className="text-2xl font-bold">Create Post</label>
            <form onSubmit={handleSubmit}>
                <div className="flex flex-col gap-4">
                    <label>Title</label>
                    <Input
                        value={formData.title}
                        onChange={(e) =>
                            setFormData({...formData, title: e.target.value})
                        }
                    />
                    {errors.title && <p className="text-red-500">{errors.title}</p>}
                    <div className={"flex items-center gap-4"}>
                        <label>Status</label>
                        <Select
                            value={formData.status}
                            onValueChange={(value) =>
                                setFormData({...formData, status: value as PostStatus})
                            }
                        >
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Select status"/>
                            </SelectTrigger>
                            <SelectContent>
                                {PostStatusOptions.map((option) => (
                                    <SelectItem key={option.value} value={option.value}>
                                        {option.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {errors.status && <p className="text-red-500">{errors.status}</p>}

                        <label>Category</label>
                        <Select
                            value={formData.category_id}
                            onValueChange={(value) =>
                                setFormData({
                                    ...formData,
                                    category_id: value,
                                })
                            }
                        >
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Select category"/>
                            </SelectTrigger>
                            <SelectContent>
                                {categoryList.map((option) => (
                                    <SelectItem key={option.id} value={option.id}>
                                        {option.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {errors.category &&
                            <p className="text-red-500">{errors.category}</p>}

                        <label>Tags</label>
                        <div className={"w-1/5"}>
                            <MultiSelect
                                options={tagList.map((tag) => ({value: tag.id, label: tag.name}))}
                                onValueChange={(selectedTags) =>
                                    setFormData({
                                        ...formData,
                                        tag_ids: selectedTags.map((tag) => tag)
                                    })
                                }
                                defaultValue={formData.tag_ids}
                                placeholder="Select tags"
                                variant="inverted"
                                animation={2}
                            />
                            {errors.tags && <p className="text-red-500">{errors.tags}</p>}
                        </div>

                    </div>
                    <label>Content</label>
                    <Editor content={formData.content} onChange={handleContentChange}/>
                    <Button type="submit" className="px-4 py-2 bg-green-500 text-white rounded">
                        Submit
                    </Button>
                </div>
            </form>
        </main>
    );
}
