import { useState } from "react";
import type { Entry } from "../types";
import { X } from "lucide-react";

export type UploadMediaWindowProps = {
    entry: Entry;
    setVisibleUploadWindow: (visible: boolean) => void;
};

function UploadMediaWindow({ entry, setVisibleUploadWindow }: UploadMediaWindowProps) {
    const [media, setMedia] = useState<File | null>(null);
    const [loading, setLoading] = useState(false)

    const handleUpload = async () => {
        if (loading) return;
        if (!media) return;
        setLoading(true)
        try {
            const formData = new FormData();
            formData.append("file", media);

            // TODO : fix route
            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/users/1/days/1/entries/${entry.id}/media/add`,
                {
                    method: 'PUT',
                    body: formData, // no need to set Content-Type
                }
            );

            if (!response.ok) {
                throw new Error("Failed to update entry");
            }
            setMedia(null);
            setVisibleUploadWindow(false);
            setLoading(false)

            console.log("file uploaded")
        } catch (error) {
            console.log(error)
            setLoading(false)
        }

    };

    const handleCancel = () => {
        setMedia(null);
        console.log("cancelled");
        setVisibleUploadWindow(false);
    };

    return (
        <div
            className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50"
            style={{ backgroundColor: 'var(--color-bg-overlay)' }}
        >
            <div
                className="w-[90%] max-w-md rounded-2xl p-6 relative"
                style={{
                    backgroundColor: 'var(--color-surface-primary)',
                    boxShadow: 'var(--shadow-2xl)'
                }}
            >
                {/* Close Icon */}
                <button
                    onClick={handleCancel}
                    className="absolute top-3 right-3 transition-colors"
                    style={{ color: 'var(--color-text-tertiary)' }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.color = 'var(--color-error)';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.color = 'var(--color-text-tertiary)';
                    }}
                >
                    <X className="w-5 h-5" />
                </button>

                {/* Title */}
                <h2
                    className="text-xl font-semibold mb-4"
                    style={{ color: 'var(--color-text-primary)' }}
                >
                    Upload Media
                </h2>

                {/* File Input */}
                <input
                    type="file"
                    accept="audio/*,image/*"
                    onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                            const fileSizeMB = file.size / (1024 * 1024); // bytes → MB
                            if (fileSizeMB > 5) {
                                alert(`File is too large. Max allowed size is 5 MB.`);
                                e.target.value = "";
                                return;
                            }
                            setMedia(file);
                        }
                    }}
                    className="w-full mb-4 border rounded px-3 py-2 text-sm"
                    style={{
                        backgroundColor: 'var(--color-surface-secondary)',
                        borderColor: 'var(--color-border-primary)',
                        color: 'var(--color-text-primary)'
                    }}
                />


                {/* Buttons */}
                <div className="flex justify-end space-x-3">
                    <button
                        onClick={handleCancel}
                        className="px-4 py-2 rounded text-sm transition-colors"
                        style={{
                            backgroundColor: 'var(--color-surface-secondary)',
                            color: 'var(--color-text-primary)',
                            border: `1px solid var(--color-border-secondary)`
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = 'var(--color-surface-tertiary)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'var(--color-surface-secondary)';
                        }}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleUpload}
                        className="px-4 py-2 rounded text-sm transition-colors disabled:opacity-50"
                        style={{
                            backgroundColor: !media ? 'var(--color-primary-300)' : 'var(--color-primary)',
                            color: 'var(--color-text-inverse)'
                        }}
                        onMouseEnter={(e) => {
                            if (media) {
                                e.currentTarget.style.backgroundColor = 'var(--color-primary-700)';
                            }
                        }}
                        onMouseLeave={(e) => {
                            if (media) {
                                e.currentTarget.style.backgroundColor = 'var(--color-primary)';
                            }
                        }}
                        disabled={!media}
                    >
                        Upload
                    </button>
                </div>
            </div>
            {/* {media && (
                <div className="mb-4">
                    {media.type.startsWith("image/") && (
                        <img
                            src={URL.createObjectURL(media)}
                            alt="preview"
                            className="max-w-full h-auto rounded-md"
                        />
                    )}
                    {media.type.startsWith("audio/") && (
                        <audio
                            controls
                            src={URL.createObjectURL(media)}
                            className="w-full mt-2"
                        />
                    )}
                </div>
            )} */}
        </div>
    );
}

export default UploadMediaWindow;