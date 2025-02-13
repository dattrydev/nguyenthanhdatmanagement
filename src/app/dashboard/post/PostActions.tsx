import {Button} from "@/components/ui/button";
import {usePostContext} from "@/context/PostContext";
import {PostList} from "@/types/dashboard/post";
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
import {isErrorResponse} from "@/types/error/error-response";

type PostActionsProps = {
    post: PostList;
};

export const PostActions = ({post}: PostActionsProps) => {
    const {deletePost} = usePostContext();

    const router = useRouter();

    const handleDelete = async (postId: string) => {
        try {
            const response = await deletePost(postId);

            if (isErrorResponse(response)) {
                throw new Error(response.message || "An error occurred while deleting the post.");
            }

            toast({
                title: "Post deleted successfully.",
                description: "The post has been deleted successfully.",
            });
        } catch (error: any) {
            toast({
                title: "Error",
                description: error?.message || "Error deleting the post.",
                variant: "destructive",
            });
        }
    };


    const handleEdit = (row: PostList) => {
        router.push(`/dashboard/post/${row.slug}`);
    }

    return (
        <div className={"flex justify-center gap-2"}>
            <Button variant={"secondary"} onClick={() => handleEdit(post)}>
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
                        <DialogTitle>Delete Post</DialogTitle>
                        <DialogDescription>{`Are you sure you want to delete "${post.title}"?`}</DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="flex justify-end">
                        <DialogClose asChild={true}>
                            <Button variant="secondary">Cancel</Button>
                        </DialogClose>
                        <DialogClose asChild={true}>
                            <Button
                                variant="destructive"
                                type="submit"
                                onClick={() => handleDelete(post.id)}>
                                Confirm
                            </Button>
                        </DialogClose>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};
