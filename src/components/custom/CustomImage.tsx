import {NodeViewWrapper} from "@tiptap/react";
import {X, Edit} from "lucide-react";
import {useState} from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {Button} from "../ui/button";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";

type CustomImageProps = {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    node: any;
    deleteNode: () => void;
};

export default function CustomImage({node, deleteNode}: CustomImageProps) {
    const [width, setWidth] = useState<string | undefined>(node.attrs.width);
    const [height, setHeight] = useState<string | undefined>(node.attrs.height);
    const [isOpen, setIsOpen] = useState(false); // Để điều khiển trạng thái mở/đóng dialog

    const handleResize = (e: React.MouseEvent) => {
        e.preventDefault();

        if (node && node.attrs) {
            const imageElement = document.querySelector(
                `img[src="${node.attrs.src}"]`
            ) as HTMLImageElement;

            if (imageElement) {
                if (width) {
                    imageElement.style.width = width + "px";
                } else {
                    imageElement.style.width = "auto";
                }

                if (height) {
                    imageElement.style.height = height + "px";
                } else {
                    imageElement.style.height = "auto";
                }
            }
        }
        setIsOpen(false);
    };

    return (
        <NodeViewWrapper className="relative inline-block">
            <img
                src={node.attrs.src}
                alt="uploaded"
                className="max-w-full h-auto rounded-lg"
                style={{width: width || "auto", height: height || "auto"}}
            />
            <button
                className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
                onClick={deleteNode}
            >
                <X size={14}/>
            </button>

            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogTrigger asChild>
                    <button
                        className="absolute top-0 left-0 bg-yellow-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
                        onClick={() => setIsOpen(true)}
                    >
                        <Edit size={14}/>
                    </button>
                </DialogTrigger>

                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Edit Image Size</DialogTitle>
                        <DialogDescription>
                            {"Change the width and height of the image."}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="width" className="text-right">
                                Width (px):
                            </Label>
                            <Input
                                id="width"
                                type="number"
                                value={width || ""}
                                onChange={(e) => setWidth(e.target.value)}
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="height" className="text-right">
                                Height (px):
                            </Label>
                            <Input
                                id="height"
                                type="number"
                                value={height || ""}
                                onChange={(e) => setHeight(e.target.value)}
                                className="col-span-3"
                            />
                        </div>
                    </div>

                    <DialogFooter>
                        <Button
                            type="button"
                            onClick={handleResize}
                            className="bg-green-500 text-white"
                        >
                            Save Changes
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </NodeViewWrapper>
    );
}
