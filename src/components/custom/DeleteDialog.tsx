import {Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose} from "@/components/ui/dialog";
import {Button} from "@/components/ui/button";

type DeleteDialogProps = {
    open: boolean;
    onClose: () => void;  // Không cần event ở đây nữa
    onConfirm: () => void;
    title?: string;
};

export default function DeleteDialog({open, onClose, onConfirm, title}: DeleteDialogProps) {
    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Delete item</DialogTitle>
                    <div className="text-lg font-semibold">
                        {title ?? "Are you sure you want to delete this item?"}
                    </div>
                </DialogHeader>
                <DialogFooter className="flex justify-end">
                    <DialogClose asChild>
                        <Button variant="secondary">
                            Cancel
                        </Button>
                    </DialogClose>
                    <DialogClose asChild>
                        <Button variant="destructive" onClick={(e) => {
                            e.stopPropagation();
                            onConfirm();
                        }}>
                            Confirm
                        </Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
