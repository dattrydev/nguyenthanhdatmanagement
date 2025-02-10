import * as React from "react";
import {Button} from "@/components/ui/button";

type TableHeaderProps = {
    handleCreatePost: () => void;
}

export const TableHeader = ({handleCreatePost}: TableHeaderProps) => {
    return (
        <div className="flex items-center justify-end gap-2">
            <Button onClick={handleCreatePost}>Create Post</Button>
            <Button variant="destructive">Delete Post</Button>
        </div>
    )
}