import type React from "react";
import { useState } from "react";
import Media from "./Media";
import { Trash2, Edit, Check, X, Paperclip } from "lucide-react";
import UploadMediaWindow from "./UploadMediaWindow";
import DeleteDialog from "./DeleteDialog";

import type { Entry as EntryData } from '../types'

interface EntryProps {
  entry: EntryData;
  onDelete: (id: number) => void;
}

const Entry: React.FC<EntryProps> = ({ entry, onDelete }) => {
  const [content, setContent] = useState(entry?.content || "");
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(content);
  const [visibleDialog, setVisibleDialog] = useState(false);
  const [visibleUploadWindow, setVisibleUploadWinodow] = useState(false)
  const [saving, setSaving] = useState(false);

  if (!entry) return null;

  const toggleDialog = () => {
    setIsEditing(false)
    setEditedContent("")
    setVisibleDialog(!visibleDialog);
  };

  const toggleUploadWindow = () => {
    setVisibleUploadWinodow(!visibleUploadWindow);
  }

  const handleEdit = () => {
    setEditedContent(content);
    setIsEditing(!isEditing);
  };

  const handleSave = async () => {
    if (content === editedContent) {
      setIsEditing(false);
      setEditedContent("");
      return;
    }
    try {
      setSaving(true);
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/entries/${entry.id}/update`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ content: editedContent }),
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update entry");
      }

      setContent(editedContent);
      setIsEditing(false);
      setEditedContent("");
    } catch (error) {
      console.error("Failed to update entry:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setIsEditing(false)
    setEditedContent("")
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/days/${entry.day_id}/entries/${entry.id
        }/delete`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete entry");
      }

      onDelete(entry.id);
    } catch (error) {
      console.error("Failed to delete entry:", error);
    }
    toggleDialog();
  };

  return (
    <div className="theme-entry theme-shadow rounded-xl p-6 mb-4 transition-all hover:theme-shadow-hover theme-border border">
      {/* Custom Confirm Dialog */}
      {visibleDialog && (
        <DeleteDialog handleDelete={handleDelete} itemType="Entry" toggleDialog={toggleDialog} />
      )}

      {
        visibleUploadWindow && (<UploadMediaWindow entry={entry} setVisibleUploadWindow={setVisibleUploadWinodow} />)
      }

      {/* Entry Content */}
      {isEditing ? (
        <textarea
          value={editedContent}
          onChange={(e) => setEditedContent(e.target.value)}
          rows={3}
          className="w-full theme-input theme-border border rounded-md p-3 outline-none resize-none transition-all duration-200 font-serif text-lg"
          placeholder="Write something..."
          style={{ lineHeight: "1.6" }}
        />
      ) : (
        <p
          className="theme-text mb-3 font-serif text-sm md:text-md leading-relaxed"
          style={{ whiteSpace: "pre-wrap" }}
        >
          {content || "Write something..."}
        </p>
      )}

      {/* Media */}
      {(entry.media?.length ?? 0) > 0 &&
        entry.media!.map((item: any) => <Media key={item.id} media={item} />)}

      {/* Actions */}
      <div className="flex items-center justify-between mt-3 pt-2 theme-border border-t">
        <p className="text-xs theme-text-muted font-medium">
          {new Date(entry.created_at).toLocaleString("en-US", {
            weekday: "short",
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          })}
        </p>

        <div className="flex gap-2">
          {isEditing ? (
            <div className="flex gap-2">
              <button
                disabled={saving}
                onClick={() => {
                  setIsEditing(false);
                  setEditedContent("")
                }}
                className="px-3 py-1.5 bg-red-800 rounded-lg hover:opacity-90 disabled:opacity-50 transition-colors flex items-center gap-1 font-medium cursor-pointer"
                title="Cancel"
              >
                <X size={16} />
              </button>
              <button
                disabled={saving}
                onClick={handleSave}
                className="px-3 py-1.5 bg-green-800 rounded-lg hover:opacity-90 disabled:opacity-50 transition-colors flex items-center gap-1 font-medium cursor-pointer"
                title="Save"
              >
                {" "}
                <Check size={16} />
              </button></div>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={toggleUploadWindow}
                className="px-3 py-1.5 theme-button-secondary rounded-lg hover:opacity-90 transition-colors flex items-center gap-1 font-medium cursor-pointer"
                title="Attach Media"
              >
                <Paperclip size={16} />
              </button>
              <button
                onClick={handleEdit}
                className="px-3 py-1.5 theme-button-secondary rounded-lg hover:opacity-90 transition-colors flex items-center gap-1 font-medium cursor-pointer"
                title="Edit"
              >
                <Edit size={16} />
              </button>
            </div>
          )}

          <button
            onClick={toggleDialog}
            className="px-3 py-1.5 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors flex items-center gap-1 font-medium cursor-pointer"
            title="Delete"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Entry;
