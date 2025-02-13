"use client";
import {useState} from "react";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {useToast} from "@/hooks/use-toast";
import {useRouter} from "next/navigation";
import {navigateToSidebarItem} from "@/utils/navigateToSidebarItem";
import {useTagContext} from "@/context/TagContext";
import {CreateTag, validateCreateTag} from "@/types/dashboard/tag";

export default function Page() {
    const {createTag, checkUniqueTag} = useTagContext();
    const {toast} = useToast();
    const router = useRouter();

    const [formData, setFormData] = useState<CreateTag>({
        name: "",
    });
    const [errors, setErrors] = useState<Record<string, string>>({});

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        const validationErrors = validateCreateTag(formData) || {};

        const isPostTagUnique = await checkUniqueTag("name", formData.name);
        if (!isPostTagUnique) {
            validationErrors.name = "Tag already exists";
        }

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        try {
            const response = await createTag(formData);
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
    };

    return (
        <main className="flex flex-col gap-2">
            <label className="text-2xl font-bold">Create Tag</label>
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
