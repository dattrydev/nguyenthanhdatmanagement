"use client";

import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarRail,
} from "@/components/ui/sidebar"
import Image from "next/image";
import {sidebarItemList} from "@/config/sidebarItemList";

import {usePathname} from "next/navigation";
import {useAuthContext} from "@/context/AuthContext";

export function AppSidebar({...props}: React.ComponentProps<typeof Sidebar>) {
    const {user} = useAuthContext();
    const pathname = usePathname();

    return (
        <Sidebar {...props}>
            <SidebarHeader className={"flex flex-row items-center ml-1"}>
                <Image src={"/assets/images/sidebar/avatar_rounded.jpg"} alt={"logo"} width={40} height={40}
                       className={"rounded-full"}/>
                {user && (
                    <label className={"text-lg font-semibold"}>{`Hi, ${user.name}`}</label>
                )}
            </SidebarHeader>

            <SidebarContent>
                {sidebarItemList.map((item) => (
                    <SidebarGroup key={item.title}>
                        <SidebarGroupLabel>{item.title}</SidebarGroupLabel>
                        <SidebarGroupContent>
                            <SidebarMenu>
                                {item.items?.map((subItem) => {
                                    const isActive = pathname === subItem.url;
                                    return (
                                        <SidebarMenuItem key={subItem.title}>
                                            <SidebarMenuButton asChild isActive={isActive}>
                                                <a href={subItem.url}>{subItem.title}</a>
                                            </SidebarMenuButton>
                                        </SidebarMenuItem>
                                    );
                                })}
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>
                ))}
            </SidebarContent>
            <SidebarRail/>
        </Sidebar>
    );
}
