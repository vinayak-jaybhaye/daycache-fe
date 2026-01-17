import { Trash2 } from "lucide-react";

type DeleteDialogProps = {
    toggleDialog: () => void;
    handleDelete: () => void;
    itemType: string
};


function DeleteDialog({ toggleDialog, handleDelete, itemType }: DeleteDialogProps) {
    return (
        <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50 bg-black/50">
            <div className="rounded-lg p-6 max-w-sm w-full border animate-fadeIn bg-surface-primary border-border-primary shadow-lg">
                <h3 className="text-lg font-semibold mb-4 text-center text-text-primary">
                    Please confirm
                </h3>
                <p className="text-sm text-center mb-6 text-text-secondary">
                    Are you sure you want to delete this {itemType}
                </p>
                <div className="flex justify-center gap-4">
                    <button
                        onClick={toggleDialog}
                        className="px-4 py-2 rounded-lg hover:opacity-90 transition-colors font-medium bg-surface-secondary text-text-primary border border-border-secondary"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleDelete}
                        className="px-4 py-2 rounded-lg transition-colors flex items-center gap-2 font-medium bg-red-500 text-white hover:bg-red-600"
                    >
                        <Trash2 size={16} />
                        Delete
                    </button>
                </div>
            </div>
        </div>
    )
}

export default DeleteDialog;