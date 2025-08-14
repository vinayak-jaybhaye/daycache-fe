import { Trash2 } from "lucide-react";

type DeleteDialogProps = {
    toggleDialog: () => void;
    handleDelete: () => void;
    itemType: string
};


function DeleteDialog({ toggleDialog, handleDelete, itemType }: DeleteDialogProps) {
    return (
        <div
            className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50"
            style={{ backgroundColor: 'var(--color-bg-overlay)' }}
        >
            <div
                className="rounded-lg p-6 max-w-sm w-full border animate-fadeIn"
                style={{
                    backgroundColor: 'var(--color-surface-primary)',
                    borderColor: 'var(--color-border-primary)',
                    boxShadow: 'var(--shadow-lg)'
                }}
            >
                <h3
                    className="text-lg font-semibold mb-4 text-center"
                    style={{ color: 'var(--color-text-primary)' }}
                >
                    Please confirm
                </h3>
                <p
                    className="text-sm text-center mb-6"
                    style={{ color: 'var(--color-text-secondary)' }}
                >
                    Are you sure you want to delete this {itemType}
                </p>
                <div className="flex justify-center gap-4">
                    <button
                        onClick={toggleDialog}
                        className="px-4 py-2 rounded-lg hover:opacity-90 transition-colors font-medium"
                        style={{
                            backgroundColor: 'var(--color-surface-secondary)',
                            color: 'var(--color-text-primary)',
                            border: `1px solid var(--color-border-secondary)`
                        }}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleDelete}
                        className="px-4 py-2 rounded-lg transition-colors flex items-center gap-2 font-medium"
                        style={{
                            backgroundColor: 'var(--color-error)',
                            color: 'var(--color-text-inverse)'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = 'var(--color-error-700)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'var(--color-error)';
                        }}
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