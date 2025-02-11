"use client";
import React, {useEffect, useState} from "react";
import {Input} from "@/components/ui/input";
import {useCategoryContext} from "@/context/CategoryContext";
import {Button} from "@/components/ui/button";
import {useToast} from "@/hooks/use-toast";
import {useRouter} from "next/navigation";
import {navigateToSidebarItem} from "@/utils/navigateToSidebarItem";
import {usePathname} from "next/navigation";
import {isErrorResponse} from "@/types/error/error-response";
import {UpdateCategory, validateCreateCategory} from "@/types/dashboard/category";

export default function Page() {
    const {getCategoryBySlug, updateCategory, checkUniqueCategory} = useCategoryContext();

    const {toast} = useToast();
    const router = useRouter();
    const pathname = usePathname();

    const [formData, setFormData] = useState<UpdateCategory>({
        id: "",
        name: "",
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [currentName, setCurrentName] = useState<string>("");

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        const validationErrors = validateCreateCategory(formData) || {};

        if (formData.name !== currentName) {
            const isCategoryTitleUnique = await checkUniqueCategory("name", formData.name);
            if (!isCategoryTitleUnique) {
                validationErrors.title = "Category already exists";
            }
        }

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        try {
            const response = await updateCategory(formData.id, formData);
            if (response) {
                toast({title: "Success", description: "Category updated successfully"});
                router.push(navigateToSidebarItem("Category List"));
            }
        } catch (error: any) {
            toast({
                title: "Error",
                description: "An error occurred while updating the category: " + error.message,
                variant: "destructive",
            });
        }
    }

    useEffect(() => {
        const slug = pathname.split("/").pop();
        console.log("slug", slug);
        if (!slug) return;

        const fetchCategoryData = async () => {
            try {
                const data = await getCategoryBySlug(slug);

                if (isErrorResponse(data)) {
                    toast({
                        title: "Error",
                        description: "Failed to fetch category data: " + data.message,
                        variant: "destructive",
                    });
                    return;
                }

                setCurrentName(data.name);

                setFormData(data);

            } catch (error) {
                toast({
                    title: "Error",
                    description: "Failed to fetch category data: " + error,
                    variant: "destructive",
                });
            }
        };

        fetchCategoryData();
    }, [pathname, getCategoryBySlug, toast]);

    return (
        <main className="flex flex-col gap-2">
            <label className="text-2xl font-bold">Update Category</label>
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
