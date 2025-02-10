import * as React from "react";
import {Button} from "@/components/ui/button";
import {useCallback} from "react";
import {useRouter} from "next/navigation";

export const TableHeader = () => {
    const router = useRouter();

    const handleCreatePost = useCallback(() => {
        router.push("/dashboard/post/create");
    }, [router]);

    return (
        <div className="flex items-center justify-end">
            <Button onClick={handleCreatePost}>Create Post</Button>
        </div>
    )
}