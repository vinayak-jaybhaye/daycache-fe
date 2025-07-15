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
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="w-[90%] max-w-md bg-white rounded-2xl shadow-2xl p-6 relative">
                {/* Close Icon */}
                <button
                    onClick={handleCancel}
                    className="absolute top-3 right-3 text-gray-500 hover:text-red-500"
                >
                    <X className="w-5 h-5" />
                </button>

                {/* Title */}
                <h2 className="text-xl font-semibold mb-4 text-gray-800">
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
                    className="w-full mb-4 border rounded px-3 py-2 text-sm text-gray-700"
                />


                {/* Buttons */}
                <div className="flex justify-end space-x-3">
                    <button
                        onClick={handleCancel}
                        className="px-4 py-2 rounded text-sm bg-gray-100 text-gray-700 hover:bg-gray-200"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleUpload}
                        className="px-4 py-2 rounded text-sm bg-blue-600 text-white hover:bg-blue-700 disabled:bg-blue-300"
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
