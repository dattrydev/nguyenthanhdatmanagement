import {Dialog, DialogContent, DialogTitle} from "@/components/ui/dialog";

type DeleteDialogProps = {
    open: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title?: string;
}

export default function DeleteDialog({open, onClose, onConfirm, title}: DeleteDialogProps) {
    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogTitle className="">Delete Item</DialogTitle>
            <DialogContent>
                <div className="text-lg font-semibold">{title ?? "Are you sure you want to delete this item?"}</div>
                <div className="flex justify-end mt-4">
                    <button className="bg-gray-300 text-gray-800 rounded-md px-4 py-2 mr-4" onClick={onClose}>
                        Cancel
                    </button>
                    <button className="bg-red-500 text-white rounded-md px-4 py-2" onClick={onConfirm}>
                        Confirm
                    </button>
                </div>
            </DialogContent>
        </Dialog>
    );
}