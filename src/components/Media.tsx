import type React from "react";

type MediaType = "image" | "video" | "audio" | "file";

type MediaData = {
  type: MediaType;
  url: string;
  description?: string;
  id: number;
};

type MediaProps = {
  media?: MediaData | null;
};

const Media: React.FC<MediaProps> = ({ media }) => {
  if (!media) return null;
  console.log("Media data:", media);

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
      console.log("Media deleted successfully");
    } catch (error) {
      console.error("Error deleting media:", error);
    }
  }

  return (
    <div className="mt-4">
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
      )}

      {media.type === "audio" && (
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

      {media.type === "file" && (
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
      {/* delete button */}
      <div>
        <button className="mt-2 bg-red-600 text-white font-medium px-4 py-2 rounded-lg shadow-md hover:bg-red-700 transition duration-300" onClick={handleDelete}>
          Delete
        </button>
      </div>
    </div>
  );
};

export default Media;
