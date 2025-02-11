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
import {Tag} from "@/types/dashboard/tag";
import {useTagContext} from "@/context/TagContext";
import {isErrorResponse} from "@/types/error/error-response";

type TagActionProps = {
    tag: Tag;
};

export const TagActions = ({tag}: TagActionProps) => {
    const {deleteTag} = useTagContext();

    const router = useRouter();

    const handleDelete = async (tagId: string) => {
        const response = await deleteTag(tagId);

        if (isErrorResponse(response)) {
            toast({
                title: "Error",
                description: response.message || "An error occurred while deleting the tag.",
                variant: "destructive",
            });
            return;
        }

        toast({
            title: "Tag deleted successfully.",
            description: "The tag has been deleted successfully.",
        });
    };


    const handleEdit = (row: Tag) => {
        router.push(`/dashboard/tag/${row.slug}`);
    }

    return (
        <div className={"flex justify-end gap-2"}>
            <Button variant={"secondary"} onClick={() => handleEdit(tag)}>
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
                        <DialogTitle>Delete Tag</DialogTitle>
                        <DialogDescription>{`Are you sure you want to delete "${tag.name}"?`}</DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="flex justify-end">
                        <DialogClose asChild={true}>
                            <Button variant="secondary">Cancel</Button>
                        </DialogClose>
                        <DialogClose asChild={true}>
                            <Button
                                variant="destructive"
                                type="submit"
                                onClick={() => handleDelete(tag.id)}>
                                Confirm
                            </Button>
                        </DialogClose>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};
