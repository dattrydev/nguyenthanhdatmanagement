import {Button} from "@/components/ui/button";
import {useRouter} from "next/navigation";
import {
    Dialog, DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle, DialogTrigger
} from "@/components/ui/dialog";
import {toast} from "@/hooks/use-toast";
import {useCategoryContext} from "@/context/CategoryContext";
import {Category} from "@/types/dashboard/category";
import {isErrorResponse} from "@/types/error/error-response";

type CategoryActionProps = {
    category: Category;
};

export const CategoryActions = ({category}: CategoryActionProps) => {
    const {deleteCategory} = useCategoryContext();

    const router = useRouter();

    const handleDelete = async (categoryId: string) => {
        try {
            const response = await deleteCategory(categoryId);

            if (isErrorResponse(response)) {
                throw new Error(response.message || "An error occurred while deleting the category.");
            }

            toast({
                title: "Category deleted successfully.",
                description: "The category has been deleted successfully.",
            });
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.message || "Error deleting the category",
                variant: "destructive",
            });
        }
    };


    const handleEdit = (row: Category) => {
        router.push(`/dashboard/category/${row.slug}`);
    }

    return (
        <div className={"flex justify-end gap-2"}>
            <Button variant={"secondary"} onClick={() => handleEdit(category)}>
                Edit
            </Button>
            <Dialog>
                <DialogTrigger asChild={true}>
                    <Button variant={"destructive"}>
                        Delete
                    </Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete Category</DialogTitle>
                        <DialogDescription>{`Are you sure you want to delete "${category.name}"?`}</DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="flex justify-end">
                        <DialogClose asChild={true}>
                            <Button variant="secondary">Cancel</Button>
                        </DialogClose>
                        <DialogClose asChild={true}>
                            <Button
                                variant="destructive"
                                type="submit"
                                onClick={() => handleDelete(category.id)}>
                                Confirm
                            </Button>
                        </DialogClose>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};
