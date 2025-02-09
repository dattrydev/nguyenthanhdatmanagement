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

    const {toast} = useToast();
    const router = useRouter();
    const pathname = usePathname();

    const [formData, setFormData] = useState<UpdatePost>({
        id: "",
        title: "",
        content: "",
        status: PostStatus.DRAFT,
        category_id: "",
        tag_ids: [],
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(true);
    const [currentTitle, setCurrentTitle] = useState("");

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        const newErrors = validateCreatePost(formData) || {};

        const validationResult = validateCreatePost(formData);

        for (const key in validationResult) {
            if (validationResult.hasOwnProperty(key)) {
                newErrors[key] = validationResult[key];
            }
        }

        if (formData.title !== currentTitle) {
            const isPostTitleUnique = await checkUniquePost("title", formData.title);
            if (!isPostTitleUnique) {
                newErrors.title = "Already exists with this title";
            }
        }

        if (!formData.category_id) {
            newErrors.category_id = "Category is required";
        }

        if (formData.tag_ids.length === 0) {
            newErrors.tag_ids = "At least one tag is required";
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        try {
            const newContent = await uploadImageAndReplaceUrls(formData.content, uploadImage);
            const updatedFormData = {...formData, content: newContent};

            setFormData(updatedFormData);

            const response = await updatePost(updatedFormData.id, updatedFormData);
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
                    tag_ids: data.tags.map((tag) => tag.id),
                    category_id: data.category.id,
                };
                setFormData(postData);
                setCurrentTitle(data.title);

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
                            <MultiSelect
                                options={tagList.map((tag) => ({value: tag.id, label: tag.name}))}
                                onValueChange={(selectedTags) =>
                                    setFormData({
                                        ...formData,
                                        tag_ids: selectedTags.map((tag) => tag),
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
