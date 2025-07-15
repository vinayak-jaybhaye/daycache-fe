import type React from "react";
import type { Media as MediaType } from "../types";
import { useState } from "react";
import DeleteDialog from "./DeleteDialog";

import { X } from 'lucide-react'

type MediaProps = {
  media?: MediaType | null;
};

const Media: React.FC<MediaProps> = ({ media }) => {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  if (!media) return null;

  const toggleDeleteDialog = () => {
    setShowDeleteDialog(!showDeleteDialog)
  }

  const handleDelete = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/media/${media.id}/delete`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );
      if (!response.ok) throw new Error("Failed to delete media");
      toggleDeleteDialog()
    } catch (error) {
      console.error("Error deleting media:", error);
    }
  };

  return (
    <div className="mt-4 w-full flex justify-between items-center">
      {
        showDeleteDialog && (
          <DeleteDialog handleDelete={handleDelete} toggleDialog={toggleDeleteDialog} itemType="media" />
        )
      }
      <div className="w-full">

        {media.type === "image" && (
          <div className="overflow-hidden rounded-lg shadow-md border border-amber-200 group">
            <img
              src={media.url || "/placeholder.svg"}
              alt={media.description || "media"}
              className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105"
            />
            {media.description && (
              <div className="p-2 bg-amber-50 text-amber-800 text-sm font-medium">
                {media.description}
              </div>
            )}
          </div>
        )}
        {/* 
      {media.type === "video" && (
        <div className="overflow-hidden rounded-lg shadow-md border border-amber-200">
          <video controls className="w-full h-64 object-cover">
            <source src={media.url} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          {media.description && (
            <div className="p-2 bg-amber-50 text-amber-800 text-sm font-medium">
              {media.description}
            </div>
          )}
        </div>
      )} */}

        {media.type === "video" && (
          <div className="mt-2 p-3 border border-amber-200 rounded-lg shadow-md bg-amber-50">
            <audio controls className="w-full">
              <source src={media.url} type="audio/mpeg" />
              Your browser does not support the audio element.
            </audio>
            {media.description && (
              <div className="mt-2 text-amber-800 text-sm font-medium">
                {media.description}
              </div>
            )}
          </div>
        )}

        {(media && media.type != 'image' && media.type != 'video') && (
          <div className="mt-2">
            <a
              href={media.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-amber-600 text-white font-medium px-4 py-2 rounded-lg shadow-md hover:bg-amber-700 transition duration-300"
            >
              {media.description || "Download File"}
            </a>
          </div>
        )}
      </div>
      {/* delete button */}
      <div>
        <button
          className="mt-2 text-red-500 font-medium px-4 py-2 rounded-lg shadow-md hover:bg-red-700 transition duration-300"
          onClick={toggleDeleteDialog}
        >
          <X size={20} />
        </button>
      </div>
    </div>
  );
};

export default Media;
