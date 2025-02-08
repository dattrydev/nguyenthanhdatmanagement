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
    const {createPost, checkUniquePost} = usePostContext();
    const {uploadImage} = useImageContext();

    const {toast} = useToast();
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

        // Initialize an object to collect all the errors
        const newErrors: Record<string, string> = {};

        // Step 1: Validate the form data using Zod schema
        try {
            validateCreatePost(formData); // This will throw if the schema is not valid
        } catch (error) {
            if (error instanceof z.ZodError) {
                error.errors.forEach((err) => {
                    if (err.path) {
                        newErrors[err.path.join(".")] = err.message;
                    }
                });
            }
        }

        // Step 2: Check if the post title is unique
        const isPostTitleUnique = await checkUniquePost("title", formData.title);
        if (!isPostTitleUnique) {
            newErrors.title = "Already exists with this title";
        }

        // Step 3: Manually validate Category and Tags fields
        if (!formData.category_id) {
            newErrors.category = "Category is required";
        }

        if (formData.tag_ids.length === 0) {
            newErrors.tags = "At least one tag is required";
        }

        // Step 4: If there are errors, update the error state
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return; // Stop here if there are errors
        }

        // If no errors, continue to process content and create post
        const newContent = await uploadImageAndReplaceUrls(formData.content, uploadImage);
        const updatedFormData = {...formData, content: newContent};
        setFormData(updatedFormData);

        const response = await createPost(updatedFormData);
        if (response) {
            toast({
                title: "Success",
                description: "Post created successfully",
            });
            router.push(navigateToSidebarItem("Post List"));
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
                        </div>

                        <div className={"flex flex-col"}>
                            <label>Tags</label>
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
