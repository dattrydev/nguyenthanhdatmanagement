"use client";

export type SidebarItem = {
    title: string;
    url: string;
    items?: SidebarItem[];
}

export const sidebarItemList: SidebarItem[] = [
    {
        title: "Post",
        url: "/dashboard",
        items: [
            {
                title: "Post List",
                url: "/dashboard/post",
            },
            {
                title: "Create Post",
                url: "/dashboard/post/create",
            },
        ]
    },
    {
        title: "Category",
        url: "#",
        items: [
            {
                title: "Category List",
                url: "/dashboard/category/list",
            }
        ]
    },
    {
        title: "Tag",
        url: "#",
        items: [
            {
                title: "Tag List",
                url: "/dashboard/tag/list",
            }
        ]
    },
]