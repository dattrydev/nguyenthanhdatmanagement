"use client";
import {useEditor, EditorContent} from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import TextAlign from "@tiptap/extension-text-align";
import Link from "@tiptap/extension-link";
import {BulletList, OrderedList} from "@tiptap/extension-list";
import Menubar from "./Menubar";

type EditorProps = {
    content: string;
    onChange: (newContent: string) => void;
};

export default function Editor({content, onChange}: EditorProps) {
    const editor = useEditor({
        extensions: [
            StarterKit,
            Image,
            TextAlign.configure({types: ["heading", "paragraph"]}),
            Link,
            BulletList,
            OrderedList
        ],
        content: content,
        injectCSS: true,
        onUpdate: ({editor}) => {
            onChange(editor.getHTML());
        }
    });

    return (
        <div className="border rounded-lg w-full bg-white min-h-96 max-h-[80vh]">
            <Menubar editor={editor}/>
            <EditorContent editor={editor} className="p-4 min-h-96 max-h-96 overflow-scroll"/>
        </div>
    );
}
