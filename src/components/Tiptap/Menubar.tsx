"use client";

import {Editor} from "@tiptap/react";
import {
    Bold, Italic, Strikethrough, Heading1, Heading2, Heading3,
    Link, Image, List, ListOrdered, Undo, Redo, AlignLeft, AlignCenter, AlignRight
} from "lucide-react";
import {useCallback} from "react";

type Props = {
    editor: Editor | null;
};

export default function Menubar({editor}: Props) {
    if (!editor) return null;

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const addImage = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
        event.preventDefault(); // Ngừng submit form khi thêm hình ảnh
        if (!event.target.files) return;
        const file = event.target.files[0];

        if (file) {
            // Use the object URL for image preview before upload
            editor.chain().focus().setImage({src: URL.createObjectURL(file)}).run();
        }
    }, [editor]);

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const addLink = useCallback((event: React.MouseEvent) => {
        event.preventDefault(); // Ngừng submit form khi thêm liên kết
        const url = prompt("Nhập URL liên kết:");
        if (url) {
            editor.chain().focus().extendMarkRange("link").setLink({href: url}).run();
        }
    }, [editor]);

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const toggleBold = useCallback((event: React.MouseEvent) => {
        event.preventDefault(); // Ngừng submit form khi ấn nút Bold
        editor.chain().focus().toggleBold().run();
    }, [editor]);

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const toggleItalic = useCallback((event: React.MouseEvent) => {
        event.preventDefault(); // Ngừng submit form khi ấn nút Italic
        editor.chain().focus().toggleItalic().run();
    }, [editor]);

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const toggleStrike = useCallback((event: React.MouseEvent) => {
        event.preventDefault(); // Ngừng submit form khi ấn nút Strikethrough
        editor.chain().focus().toggleStrike().run();
    }, [editor]);

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const toggleHeading1 = useCallback((event: React.MouseEvent) => {
        event.preventDefault(); // Ngừng submit form khi ấn nút Heading1
        editor.chain().focus().toggleHeading({level: 1}).run();
    }, [editor]);

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const toggleHeading2 = useCallback((event: React.MouseEvent) => {
        event.preventDefault(); // Ngừng submit form khi ấn nút Heading2
        editor.chain().focus().toggleHeading({level: 2}).run();
    }, [editor]);

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const toggleHeading3 = useCallback((event: React.MouseEvent) => {
        event.preventDefault(); // Ngừng submit form khi ấn nút Heading3
        editor.chain().focus().toggleHeading({level: 3}).run();
    }, [editor]);

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const toggleBulletList = useCallback((event: React.MouseEvent) => {
        event.preventDefault(); // Ngừng submit form khi ấn nút Bullet List
        editor.chain().focus().toggleBulletList().run();
    }, [editor]);

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const toggleOrderedList = useCallback((event: React.MouseEvent) => {
        event.preventDefault(); // Ngừng submit form khi ấn nút Ordered List
        editor.chain().focus().toggleOrderedList().run();
    }, [editor]);

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const setTextAlignLeft = useCallback((event: React.MouseEvent) => {
        event.preventDefault(); // Ngừng submit form khi ấn nút Align Left
        editor.chain().focus().setTextAlign("left").run();
    }, [editor]);

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const setTextAlignCenter = useCallback((event: React.MouseEvent) => {
        event.preventDefault(); // Ngừng submit form khi ấn nút Align Center
        editor.chain().focus().setTextAlign("center").run();
    }, [editor]);

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const setTextAlignRight = useCallback((event: React.MouseEvent) => {
        event.preventDefault(); // Ngừng submit form khi ấn nút Align Right
        editor.chain().focus().setTextAlign("right").run();
    }, [editor]);

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const undo = useCallback((event: React.MouseEvent) => {
        event.preventDefault(); // Ngừng submit form khi ấn nút Undo
        editor.chain().focus().undo().run();
    }, [editor]);

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const redo = useCallback((event: React.MouseEvent) => {
        event.preventDefault(); // Ngừng submit form khi ấn nút Redo
        editor.chain().focus().redo().run();
    }, [editor]);

    return (
        <div className="flex space-x-2 border-b p-2 bg-gray-100">
            <button onClick={toggleBold} className={editor.isActive("bold") ? "text-blue-500" : ""}>
                <Bold size={20}/>
            </button>
            <button onClick={toggleItalic} className={editor.isActive("italic") ? "text-blue-500" : ""}>
                <Italic size={20}/>
            </button>
            <button onClick={toggleStrike} className={editor.isActive("strike") ? "text-blue-500" : ""}>
                <Strikethrough size={20}/>
            </button>
            <button onClick={toggleHeading1} className={editor.isActive("heading", {level: 1}) ? "text-blue-500" : ""}>
                <Heading1 size={20}/>
            </button>
            <button onClick={toggleHeading2} className={editor.isActive("heading", {level: 2}) ? "text-blue-500" : ""}>
                <Heading2 size={20}/>
            </button>
            <button onClick={toggleHeading3} className={editor.isActive("heading", {level: 3}) ? "text-blue-500" : ""}>
                <Heading3 size={20}/>
            </button>
            <input type="file" accept="image/*" onChange={addImage} className="hidden" id="imageUpload"/>
            <label htmlFor="imageUpload" className="cursor-pointer">
                {/* eslint-disable-next-line jsx-a11y/alt-text */}
                <Image size={20}/>
            </label>
            <button onClick={addLink}>
                <Link size={20}/>
            </button>
            <button onClick={toggleBulletList} className={editor.isActive("bulletList") ? "text-blue-500" : ""}>
                <List size={20}/>
            </button>
            <button onClick={toggleOrderedList} className={editor.isActive("orderedList") ? "text-blue-500" : ""}>
                <ListOrdered size={20}/>
            </button>
            <button onClick={setTextAlignLeft} className={editor.isActive({textAlign: "left"}) ? "text-blue-500" : ""}>
                <AlignLeft size={20}/>
            </button>
            <button onClick={setTextAlignCenter}
                    className={editor.isActive({textAlign: "center"}) ? "text-blue-500" : ""}>
                <AlignCenter size={20}/>
            </button>
            <button onClick={setTextAlignRight}
                    className={editor.isActive({textAlign: "right"}) ? "text-blue-500" : ""}>
                <AlignRight size={20}/>
            </button>
            <button onClick={undo}>
                <Undo size={20}/>
            </button>
            <button onClick={redo}>
                <Redo size={20}/>
            </button>
        </div>
    );
}
