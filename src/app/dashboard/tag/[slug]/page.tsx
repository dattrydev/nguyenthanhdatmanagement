"use client";
import React, {useEffect, useState} from "react";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {useToast} from "@/hooks/use-toast";
import {useRouter} from "next/navigation";
import {navigateToSidebarItem} from "@/utils/navigateToSidebarItem";
import {usePathname} from "next/navigation";
import {isErrorResponse} from "@/types/error/error-response";
import {UpdateTag, validateCreateTag} from "@/types/dashboard/tag";
import {useTagContext} from "@/context/TagContext";

export default function Page() {
    const {getTagBySlug, updateTag, checkUniqueTag} = useTagContext();

    const {toast} = useToast();
    const router = useRouter();
    const pathname = usePathname();

    const [formData, setFormData] = useState<UpdateTag>({
        id: "",
        name: "",
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [currentName, setCurrentName] = useState<string>("");

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        const validationErrors = validateCreateTag(formData) || {};

        if (formData.name !== currentName) {
            const isTagTitleUnique = await checkUniqueTag("name", formData.name);
            if (!isTagTitleUnique) {
                validationErrors.title = "Tag already exists";
            }
        }

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        try {
            const response = await updateTag(formData.id, formData);
            if (response) {
                toast({title: "Success", description: "Tag updated successfully"});
                router.push(navigateToSidebarItem("Tag List"));
            }
        } catch (error: any) {
            toast({
                title: "Error",
                description: "An error occurred while updating the tag: " + error.message,
                variant: "destructive",
            });
        }
    }

    useEffect(() => {
        const slug = pathname.split("/").pop();
        console.log("slug", slug);
        if (!slug) return;

        const fetchTagData = async () => {
            try {
                const data = await getTagBySlug(slug);

                if (isErrorResponse(data)) {
                    toast({
                        title: "Error",
                        description: "Failed to fetch tag data: " + data.message,
                        variant: "destructive",
                    });
                    return;
                }

                setCurrentName(data.name);

                setFormData(data);

            } catch (error) {
                toast({
                    title: "Error",
                    description: "Failed to fetch tag data: " + error,
                    variant: "destructive",
                });
            }
        };

        fetchTagData();
    }, [pathname, getTagBySlug, toast]);

    return (
        <main className="flex flex-col gap-2">
            <label className="text-2xl font-bold">Update Tag</label>
            <form onSubmit={handleSubmit}>
                <div className="flex flex-col gap-4">
                    <div className={"flex flex-col"}>
                        <label>Name</label>
                        <Input
                            value={formData.name}
                            onChange={(e) =>
                                setFormData({...formData, name: e.target.value})
                            }
                        />
                        {errors.title && <p className="text-red-500">{errors.title}</p>}
                    </div>

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
