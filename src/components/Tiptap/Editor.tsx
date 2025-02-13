"use client";
import {useEditor, EditorContent, ReactNodeViewRenderer} from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import TextAlign from "@tiptap/extension-text-align";
import Link from "@tiptap/extension-link";
import {BulletList, OrderedList} from "@tiptap/extension-list";
import Menubar from "./Menubar";
import CustomImage from "@/components/custom/CustomImage";

type EditorProps = {
    content: string;
    onChange: (newContent: string) => void;
};

export default function Editor({content, onChange}: EditorProps) {
    const editor = useEditor({
        extensions: [
            StarterKit,
            TextAlign.configure({types: ["heading", "paragraph"]}),
            Link,
            BulletList,
            OrderedList,
            Image.extend({
                addNodeView() {
                    return ReactNodeViewRenderer(CustomImage);
                },
            }),
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
            <EditorContent
                editor={editor}
                className="min-h-96 max-h-96 overflow-auto p-1 outline-none relative z-10"
            />
        </div>
    );
}
