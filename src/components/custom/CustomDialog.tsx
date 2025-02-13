import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogDescription
} from "@/components/ui/dialog";
import {Button} from "@/components/ui/button";

type DeleteDialogProps = {
    open: boolean;
    setOpen: (open: boolean) => void;
    title: string;
    description: string;
    onConfirm: () => void;
};

export default function CustomDialog({
                                         open,
                                         setOpen,
                                         title,
                                         description,
                                         onConfirm
                                     }: DeleteDialogProps) {
    const handleClose = () => {
        setOpen(false);  // Close the dialog when Cancel is clicked or after confirmation
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription>{description}</DialogDescription>
                </DialogHeader>
                <DialogFooter className="flex justify-end">
                    <Button
                        type="button"
                        variant="secondary"
                        onClick={handleClose}  // Ensure it properly closes the dialog
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="destructive"
                        type="submit"
                        onClick={() => {
                            onConfirm();
                            handleClose();  // Close dialog after confirming
                        }}
                    >
                        Confirm
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
