import {SidebarItem, sidebarItemList} from "@/config/sidebarItemList";

export const navigateToSidebarItem = (itemTitle: string): string => {
    const findItem = (items: SidebarItem[]): string | null => {
        for (const item of items) {
            if (item.title === itemTitle) {
                return item.url;
            }
            if (item.items) {
                const nestedUrl = findItem(item.items);
                if (nestedUrl) {
                    return nestedUrl;
                }
            }
        }
        return null;
    };

    const url = findItem(sidebarItemList);
    return url ?? "";
};
