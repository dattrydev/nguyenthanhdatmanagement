"use client";

import {AppSidebar} from "@/components/app-sidebar"
import {usePathname} from "next/navigation"
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import {Separator} from "@/components/ui/separator"
import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
} from "@/components/ui/sidebar"
import {sidebarItemList} from "@/config/sidebarItemList"
import React from "react";

export default function Layout({children}: { children: React.ReactNode }) {
    const pathname = usePathname();

    // Tìm đường dẫn phù hợp trong sidebarItemList
    let breadcrumbItems: { title: string; url: string }[] = [];
    sidebarItemList.forEach(group => {
        group.items?.forEach(item => {
            if (pathname.startsWith(item.url)) {
                breadcrumbItems = [
                    {title: group.title, url: "#"}, // Group level
                    {title: item.title, url: item.url} // Page level
                ];
            }
        });
    });

    return (
        <SidebarProvider>
            <AppSidebar/>
            <SidebarInset>
                <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
                    <SidebarTrigger className="-ml-1"/>
                    <Separator orientation="vertical" className="mr-2 h-4"/>
                    <Breadcrumb>
                        <BreadcrumbList>
                            {breadcrumbItems.map((item, index) => (
                                <React.Fragment key={index}>
                                    {index < breadcrumbItems.length - 1 ? (
                                        <>
                                            <BreadcrumbItem className="hidden md:block">
                                                <BreadcrumbLink href={item.url}>
                                                    {item.title}
                                                </BreadcrumbLink>
                                            </BreadcrumbItem>
                                            <BreadcrumbSeparator/>
                                        </>
                                    ) : (
                                        <BreadcrumbItem>
                                            <BreadcrumbPage>{item.title}</BreadcrumbPage>
                                        </BreadcrumbItem>
                                    )}
                                </React.Fragment>
                            ))}
                        </BreadcrumbList>
                    </Breadcrumb>
                </header>
                <div className="flex flex-1 flex-col gap-4 p-4">
                    {children}
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
}
