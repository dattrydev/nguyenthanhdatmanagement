type SidebarItem = {
    title: string;
    url: string;
    items?: SidebarItem[];
}

export const sidebarItemList: SidebarItem[] = [
    {
        title: "Post",
        url: "#",
        items: [
            {
                title: "Post List",
                url: "/dashboard/post/list",
            }
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