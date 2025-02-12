"use client";
import {useState} from "react";
import {Input} from "@/components/ui/input";
import {useCategoryContext} from "@/context/CategoryContext";
import {Button} from "@/components/ui/button";
import {useToast} from "@/hooks/use-toast";
import {useRouter} from "next/navigation";
import {navigateToSidebarItem} from "@/utils/navigateToSidebarItem";
import {CreateCategory, validateCreateCategory} from "@/types/dashboard/category";

export default function Page() {
    const {createCategory, checkUniqueCategory} = useCategoryContext();
    const {toast} = useToast();
    const router = useRouter();

    const [formData, setFormData] = useState<CreateCategory>({
        name: "",
    });
    const [errors, setErrors] = useState<Record<string, string>>({});

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        const validationErrors = validateCreateCategory(formData) || {};

        const isPostTitleUnique = await checkUniqueCategory("name", formData.name);
        if (!isPostTitleUnique) {
            validationErrors.name = "Category already exists";
        }

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        try {
            const response = await createCategory(formData);
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
    };

    return (
        <main className="flex flex-col gap-2">
            <label className="text-2xl font-bold">Create Category</label>
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
                    </div>

                    <Button type="submit" className="px-4 py-2 bg-green-500 text-white rounded">
                        Submit
                    </Button>
                </div>

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
