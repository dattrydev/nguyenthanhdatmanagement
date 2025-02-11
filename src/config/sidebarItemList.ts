"use client";

import {Signpost, Tag, List, PlusCircle} from "lucide-react";

export type SidebarItem = {
    title: string;
    url: string;
    icon?: React.ComponentType<any>;
    items?: SidebarItem[];
}

export const sidebarItemList: SidebarItem[] = [
    {
        title: "Post",
        url: "/dashboard",
        icon: Signpost,
        items: [
            {
                title: "Post List",
                url: "/dashboard/post",
                icon: List,
            },
            {
                title: "Create Post",
                url: "/dashboard/post/create",
                icon: PlusCircle,
            },
        ]
    },
    {
        title: "Category",
        url: "#",
        icon: Tag,
        items: [
            {
                title: "Category List",
                url: "/dashboard/category",
                icon: List,
            },
            {
                title: "Create Category",
                url: "/dashboard/category/create",
                icon: PlusCircle,
            }
        ]
    },
    {
        title: "Tag",
        url: "#",
        icon: Tag,
        items: [
            {
                title: "Tag List",
                url: "/dashboard/tag",
                icon: List,
            },
            {
                title: "Create Tag",
                url: "/dashboard/tag/create",
                icon: PlusCircle,
            }
        ]
    },
];
