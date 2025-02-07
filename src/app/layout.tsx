import type {Metadata} from "next";
import {Inter} from "next/font/google";
import "./globals.css";
import {AuthProvider} from "@/context/AuthContext";
import {PostProvider} from "@/context/PostContext";
import {CategoryProvider} from "@/context/CategoryContext";
import {TagProvider} from "@/context/TagContext";
import {Toaster} from "@/components/ui/toaster";
import {ImageProvider} from "@/context/ImageContext";

const inter = Inter({subsets: ["latin"]});

export const metadata: Metadata = {
    title: "Nguyen Thanh Dat Dashboard",
    description: "Nguyen Thanh Dat Dashboard",
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
        <head>
            <title>Nguyen Thanh Dat</title>
            <link rel="icon" href="/favicon.ico"/>
            <link rel="apple-touch-icon" href="/apple-touch-icon.png"/>
            <meta name="theme-color" content="#ffffff"/>
        </head>
        <body className={inter.className}>
        <AuthProvider>
            <ImageProvider>
                <TagProvider>
                    <CategoryProvider>
                        <PostProvider>
                            {children}
                            <Toaster/>
                        </PostProvider>
                    </CategoryProvider>
                </TagProvider>
            </ImageProvider>
        </AuthProvider>
        </body>
        </html>
    );
}