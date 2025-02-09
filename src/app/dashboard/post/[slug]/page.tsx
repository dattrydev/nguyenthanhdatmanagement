"use client";
import React, {useEffect, useState} from "react";
import {Input} from "@/components/ui/input";
import {validateCreatePost, PostStatus, PostStatusOptions, UpdatePost} from "@/types/dashboard/post";
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
import {usePathname} from "next/navigation";
import {isErrorResponse} from "@/types/error/error-response";

export default function Page() {
    const {categoryList} = useCategoryContext();
    const {tagList} = useTagContext();
    const {getPostBySlug, updatePost, checkUniquePost} = usePostContext();
    const {uploadImage} = useImageContext();
    const [defaultTags, setDefaultTags] = useState<string[]>([]);

    const {toast} = useToast();
    const router = useRouter();
    const pathname = usePathname();

    const [formData, setFormData] = useState<UpdatePost>({
        id: "",
        title: "",
        content: "",
        status: PostStatus.DRAFT,
        category_id: "",
        tags_id: [],
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(true);
    const [currentTitle, setCurrentTitle] = useState<string>("");

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        const validationErrors = validateCreatePost(formData) || {};

        if (formData.title !== currentTitle) {
            const isPostTitleUnique = await checkUniquePost("title", formData.title);
            if (!isPostTitleUnique) {
                validationErrors.title = "Title already exists";
            }
        }

        if (!formData.category_id) {
            validationErrors.category = "Category is required";
        }

        if (formData.tags_id.length === 0) {
            validationErrors.tags = "At least one tag is required";
        }

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        try {
            const newContent = await uploadImageAndReplaceUrls(formData.content, uploadImage);
            const updatedPostData = {...formData, content: newContent};
            setFormData(updatedPostData);

            const response = await updatePost(updatedPostData.id, updatedPostData);
            if (response) {
                toast({title: "Success", description: "Post updated successfully"});
                router.push(navigateToSidebarItem("Post List"));
            }
        } catch (error: any) {
            toast({
                title: "Error",
                description: "An error occurred while updating the post: " + error.message,
                variant: "destructive",
            });
        }
    };

    const handleContentChange = (newContent: string) => {
        setFormData({
            ...formData,
            content: newContent,
        });
    };

    useEffect(() => {
        const slug = pathname.split("/").pop();
        console.log("slug", slug);
        if (!slug) return;

        const fetchPostData = async () => {
            try {
                const data = await getPostBySlug(slug);
                console.log("data", data);

                if (isErrorResponse(data)) {
                    toast({
                        title: "Error",
                        description: "Failed to fetch post data: " + data.message,
                        variant: "destructive",
                    });
                    setLoading(false);
                    return;
                }

                const postData = {
                    ...data,
                    tags_id: data.tags.map((tag) => tag.id),
                    category_id: data.category.id,
                };
                setFormData(postData);
                setCurrentTitle(data.title);

                const defaultTags = data.tags.map((tag) => (tag.id));
                console.log("defaultTags", defaultTags);
                setDefaultTags(defaultTags);

                setLoading(false);
            } catch (error) {
                toast({
                    title: "Error",
                    description: "Failed to fetch post data: " + error,
                    variant: "destructive",
                });
                setLoading(false);
            }
        };

        fetchPostData();
    }, [pathname, getPostBySlug, toast]);

    return (
        <main className="flex flex-col gap-2">
            <label className="text-2xl font-bold">Update Post</label>
            <form onSubmit={handleSubmit}>
                <div className="flex flex-col gap-4">
                    <div className={"flex flex-col"}>
                        <label>Title</label>
                        <Input
                            value={formData.title}
                            onChange={(e) =>
                                setFormData({...formData, title: e.target.value})
                            }
                        />
                        {errors.title && <p className="text-red-500">{errors.title}</p>}
                    </div>

                    <div className={"flex items-center gap-4"}>
                        <div className={"flex flex-col"}>
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
                        </div>

                        <div className={"flex flex-col"}>
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
                            {errors.category && <p className="text-red-500">{errors.category}</p>}
                        </div>

                        <div className={"flex flex-col"}>
                            <label>Tags</label>
                            {
                                defaultTags.length > 0 &&
                                <MultiSelect
                                    options={tagList.map((tag) => ({value: tag.id, label: tag.name}))}
                                    onValueChange={(selectedTags) =>
                                        setFormData({
                                            ...formData,
                                            tags_id: selectedTags.map((tag) => tag),
                                        })
                                    }
                                    defaultValue={defaultTags}
                                    placeholder="Select tags"
                                    variant="inverted"
                                    animation={2}
                                />
                            }

                            {errors.tags && <p className="text-red-500">{errors.tags}</p>}
                        </div>
                    </div>

                    <label>Content</label>
                    {loading ? (
                        <p>Loading...</p>
                    ) : (
                        <Editor content={formData.content} onChange={handleContentChange}/>
                    )}

                    <Button type="submit" className="px-4 py-2 bg-green-500 text-white rounded">
                        Submit
                    </Button>
                </div>
            </form>

            <div className="mt-4">
                {Object.keys(errors).length > 0 && (
                    <div className="bg-red-100 text-red-700 p-4 rounded">
                        {Object.values(errors).map((error, index) => (
                            <p key={index}>{error}</p>
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
}
