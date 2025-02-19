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

    // Hàm để xử lý sự kiện click vào ảnh để thay đổi kích thước
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const addImage = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
        event.preventDefault();
        if (!event.target.files) return;

        const file = event.target.files[0];
        if (!file) return;

        const imageUrl = URL.createObjectURL(file);

        editor.chain().focus().setImage({src: imageUrl}).run();
    }, [editor]);

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const addLink = useCallback((event: React.MouseEvent) => {
        event.preventDefault();
        const url = prompt("Nhập URL:");
        if (url) {
            editor.chain().focus().extendMarkRange("link").setLink({href: url}).run();
        }
    }, [editor]);

    // Hàm xử lý các công cụ như bold, italic, heading, v.v.
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const toggleBold = useCallback((event: React.MouseEvent) => {
        event.preventDefault();
        editor.chain().focus().toggleBold().run();
    }, [editor]);

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const toggleItalic = useCallback((event: React.MouseEvent) => {
        event.preventDefault();
        editor.chain().focus().toggleItalic().run();
    }, [editor]);

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const toggleStrike = useCallback((event: React.MouseEvent) => {
        event.preventDefault();
        editor.chain().focus().toggleStrike().run();
    }, [editor]);

    // Các công cụ khác (Heading, List, Align, Undo, Redo, v.v.)
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const toggleHeading1 = useCallback((event: React.MouseEvent) => {
        event.preventDefault();
        editor.chain().focus().toggleHeading({level: 1}).run();
    }, [editor]);

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const toggleHeading2 = useCallback((event: React.MouseEvent) => {
        event.preventDefault();
        editor.chain().focus().toggleHeading({level: 2}).run();
    }, [editor]);

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const toggleHeading3 = useCallback((event: React.MouseEvent) => {
        event.preventDefault();
        editor.chain().focus().toggleHeading({level: 3}).run();
    }, [editor]);

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const toggleBulletList = useCallback((event: React.MouseEvent) => {
        event.preventDefault();
        editor.chain().focus().toggleBulletList().run();
    }, [editor]);

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const toggleOrderedList = useCallback((event: React.MouseEvent) => {
        event.preventDefault();
        editor.chain().focus().toggleOrderedList().run();
    }, [editor]);

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const setTextAlignLeft = useCallback((event: React.MouseEvent) => {
        event.preventDefault();
        editor.chain().focus().setTextAlign("left").run();
    }, [editor]);

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const setTextAlignCenter = useCallback((event: React.MouseEvent) => {
        event.preventDefault();
        editor.chain().focus().setTextAlign("center").run();
    }, [editor]);

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const setTextAlignRight = useCallback((event: React.MouseEvent) => {
        event.preventDefault();
        editor.chain().focus().setTextAlign("right").run();
    }, [editor]);

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const undo = useCallback((event: React.MouseEvent) => {
        event.preventDefault();
        editor.chain().focus().undo().run();
    }, [editor]);

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const redo = useCallback((event: React.MouseEvent) => {
        event.preventDefault();
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
            <button
                onClick={toggleHeading1}
                className={`p-2 rounded ${editor.isActive("heading", {level: 1}) ? "text-blue-500 dark:text-blue-400" : "text-gray-700 dark:text-gray-300"}`}
            >
                <Heading1 size={20}/>
            </button>

            <button
                onClick={toggleHeading2}
                className={`p-2 rounded ${editor.isActive("heading", {level: 2}) ? "text-blue-500 dark:text-blue-400" : "text-gray-700 dark:text-gray-300"}`}
            >
                <Heading2 size={20}/>
            </button>

            <button
                onClick={toggleHeading3}
                className={`p-2 rounded ${editor.isActive("heading", {level: 3}) ? "text-blue-500 dark:text-blue-400" : "text-gray-700 dark:text-gray-300"}`}
            >
                <Heading3 size={20}/>
            </button>
            <input type="file" accept="image/*" onChange={addImage} className="hidden" id="imageUpload"/>
            <label htmlFor="imageUpload" className="cursor-pointer">
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
