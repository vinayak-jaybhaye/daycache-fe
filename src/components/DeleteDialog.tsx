import { Trash2 } from "lucide-react";

type DeleteDialogProps = {
    toggleDialog: () => void;
    handleDelete: () => void;
    itemType: string
};


function DeleteDialog({ toggleDialog, handleDelete, itemType }: DeleteDialogProps) {
    return (
        <div className="fixed inset-0 bg-black/40 bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="theme-card rounded-lg p-6 theme-shadow-hover max-w-sm w-full theme-border border animate-fadeIn">
                <h3 className="text-lg font-semibold mb-4 text-center theme-text">
                    Please confirm
                </h3>
                <p className="text-sm theme-text-muted text-center mb-6">
                    Are you sure you want to delete this {itemType}
                </p>
                <div className="flex justify-center gap-4">
                    <button
                        onClick={toggleDialog}
                        className="px-4 py-2 theme-button-secondary rounded-lg hover:opacity-90 transition-colors font-medium"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleDelete}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2 font-medium"
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
