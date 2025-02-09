// PostActions.tsx
import {useState} from "react";
import {Button} from "@/components/ui/button";
import {MoreHorizontal} from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import DeleteDialog from "@/components/custom/DeleteDialog";
import {usePostContext} from "@/context/PostContext";
import {PostList} from "@/types/dashboard/post";

type PostActionsProps = {
    post: PostList;
};

export const PostActions = ({post}: PostActionsProps) => {
    const {deletePost} = usePostContext();
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

    const handleDelete = () => {
        deletePost(post.id);
        setOpenDeleteDialog(false); // Close the dialog after confirming
    };

    return (
        <div className={""}>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal/>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem onClick={() => navigator.clipboard.writeText(post.slug)}>
                        Copy slug
                    </DropdownMenuItem>
                    <DropdownMenuSeparator/>
                    <DropdownMenuItem onClick={() => setOpenDeleteDialog(true)}>
                        Delete Post
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <DeleteDialog
                open={openDeleteDialog}
                onClose={() => setOpenDeleteDialog(false)}
                onConfirm={handleDelete}
                title={`Are you sure you want to delete the post: "${post.title}"?`}
            />
        </div>
    );
};
