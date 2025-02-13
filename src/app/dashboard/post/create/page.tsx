"use client";
import {useState} from "react";
import {Input} from "@/components/ui/input";
import {validateCreatePost, CreatePost, PostStatus, PostStatusOptions} from "@/types/dashboard/post";
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
    const {createPost, checkUniquePost} = usePostContext();
    const {uploadImage} = useImageContext();

    const {toast} = useToast();
    const router = useRouter();

    const [formData, setFormData] = useState<CreatePost>({
        title: "",
        description: "",
        content: "",
        status: PostStatus.DRAFT,
        categoryId: "",
        tagsId: [],
    });
    const [errors, setErrors] = useState<Record<string, string>>({});

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        const validationErrors = validateCreatePost(formData) || {};

        const isPostTitleUnique = await checkUniquePost("title", formData.title);
        if (!isPostTitleUnique) {
            validationErrors.title = "Title already exists";
        }

        if (!formData.description) {
            validationErrors.description = "Description is required";
        }

        if (!formData.categoryId) {
            validationErrors.category = "Category is required";
        }

        if (formData.tagsId.length === 0) {
            validationErrors.tags = "At least one tag is required";
        }

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        try {
            const newContent = await uploadImageAndReplaceUrls(formData.content, uploadImage);
            const createPostData = {...formData, content: newContent};
            setFormData(createPostData);

            const response = await createPost(createPostData);
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
            content: newContent
        });
    };

    return (
        <main className="flex flex-col gap-2">
            <label className="text-2xl font-bold">Create Post</label>
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
                    </div>
                    <div className={"flex flex-col"}>
                        <label>Description</label>
                        <Input
                            value={formData.description}
                            onChange={(e) =>
                                setFormData({...formData, description: e.target.value})
                            }
                        />
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
                                value={formData.categoryId}
                                onValueChange={(value) =>
                                    setFormData({
                                        ...formData,
                                        categoryId: value,
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
                        </div>

                        <div className={"flex flex-col"}>
                            <label>Tags</label>
                            <MultiSelect
                                options={tagList.map((tag) => ({value: tag.id, label: tag.name}))}
                                onValueChange={(selectedTags) =>
                                    setFormData({
                                        ...formData,
                                        tagsId: selectedTags.map((tag) => tag)
                                    })
                                }
                                defaultValue={formData.tagsId}
                                placeholder="Select tags"
                                variant="inverted"
                                animation={2}
                            />
                        </div>
                    </div>

                    <label>Content</label>
                    <Editor content={formData.content} onChange={handleContentChange}/>

                    <Button type="submit" className="px-4 py-2 bg-green-500 text-white rounded">
                        Submit
                    </Button>
                </div>

                {/* Display all error messages below the form */}
                <div className="mt-4">
                    {Object.keys(errors).length > 0 && (
                        <div className="bg-red-100 text-red-700 p-4 rounded">
                            {Object.values(errors).map((error, index) => (
                                <p key={index}>{error}</p>
                            ))}
                        </div>
                    )}
                </div>
            </form>
        </main>
    );
}
