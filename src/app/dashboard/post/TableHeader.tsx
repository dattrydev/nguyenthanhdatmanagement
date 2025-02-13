import * as React from "react";
import {Button} from "@/components/ui/button";
import {
    Dialog, DialogClose,
    DialogContent,
    DialogDescription, DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog";

type TableHeaderProps = {
    rowSelection: Record<string, boolean>;
    handleCreatePost: () => void;
    handleDeletePosts: () => void;
}

export const TableHeader = ({rowSelection, handleCreatePost, handleDeletePosts}: TableHeaderProps) => {
    return (
        <div className="flex items-center justify-end gap-2">
            <Button onClick={handleCreatePost}>Create Post</Button>
            <Dialog>
                <DialogTrigger asChild={true}>
                    <Button
                        variant="destructive"
                        disabled={Object.keys(rowSelection).length === 0}
                        className={Object.keys(rowSelection).length === 0 ? "opacity-50 cursor-not-allowed" : ""}
                    >
                        Delete Post
                    </Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete Post</DialogTitle>
                        <DialogDescription>{`Are you sure you want to delete ${Object.keys(rowSelection).length} posts?`}</DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="flex justify-end">
                        <DialogClose asChild={true}>
                            <Button variant="secondary">Cancel</Button>
                        </DialogClose>
                        <DialogClose asChild={true}>
                            <Button
                                variant="destructive"
                                type="submit"
                                onClick={handleDeletePosts}>
                                Confirm
                            </Button>
                        </DialogClose>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}