"use client";

import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarRail,
} from "@/components/ui/sidebar"
import Image from "next/image";
import {sidebarItemList} from "@/config/sidebarItemList";
import {useAuthContext} from "@/context/AuthContext";
import {useRouter} from "next/navigation";

export function AppSidebar({...props}: React.ComponentProps<typeof Sidebar>) {
    const {user} = useAuthContext();
    const router = useRouter();

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
                        <SidebarMenu>
                            {item.items?.map((subItem) => (
                                <SidebarMenuItem key={subItem.title}>
                                    <SidebarMenuButton tooltip={subItem.title} onClick={() => router.push(subItem.url)}>
                                        {subItem.icon && <subItem.icon/>}
                                        <span>{subItem.title}</span>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroup>
                ))}
            </SidebarContent>
            <SidebarRail/>
        </Sidebar>
    );
}
