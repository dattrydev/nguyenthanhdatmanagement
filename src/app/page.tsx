"use client";

import {useEffect} from "react";
import {useRouter} from "next/navigation";
import {navigateToSidebarItem} from "@/utils/navigateToSidebarItem";

export default function Home() {
    const router = useRouter();
    useEffect(() => {
        router.push(navigateToSidebarItem("Post List"));
    }, [router])
    return null;
}
