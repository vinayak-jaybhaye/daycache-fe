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
    <div
      className="rounded-xl p-6 mb-4 transition-all duration-200"
      style={{
        backgroundColor: 'var(--color-bg-primary)',
        boxShadow: 'var(--shadow-base)',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = 'var(--shadow-md)';
        e.currentTarget.style.transform = 'translateY(-1px)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = 'var(--shadow-base)';
        e.currentTarget.style.transform = 'translateY(0)';
      }}
    >
      {/* Custom Confirm Dialog */}
      {visibleDialog && (
        <DeleteDialog handleDelete={handleDelete} itemType="Entry" toggleDialog={toggleDialog} />
      )}

      {visibleUploadWindow && (
        <UploadMediaWindow entry={entry} setVisibleUploadWindow={setVisibleUploadWinodow} />
      )}

      {/* Entry Content */}
      {isEditing ? (
        <textarea
          value={editedContent}
          onChange={(e) => setEditedContent(e.target.value)}
          rows={3}
          className="w-full border rounded-md p-3 outline-none resize-none transition-all duration-200 font-serif text-lg"
          placeholder="Write something..."
          style={{
            lineHeight: "1.6",
            backgroundColor: 'var(--color-surface-primary)',
            borderColor: 'var(--color-border-secondary)',
            color: 'var(--color-text-primary)'
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = 'var(--color-border-focus)';
            e.currentTarget.style.boxShadow = `0 0 0 2px var(--color-primary-200)`;
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = 'var(--color-border-secondary)';
            e.currentTarget.style.boxShadow = 'none';
          }}
        />
      ) : (
        <p
          className="mb-3 font-serif text-sm md:text-md leading-relaxed"
          style={{
            whiteSpace: "pre-wrap",
            color: 'var(--color-text-primary)'
          }}
        >
          {content || "Write something..."}
        </p>
      )}

      {/* Media */}
      {(entry.media?.length ?? 0) > 0 &&
        entry.media!.map((item: any) => <Media key={item.id} media={item} />)}

      {/* Actions */}
      <div
        className="flex items-center justify-between mt-3 pt-2 border-t"
        style={{ borderColor: 'var(--color-border-primary)' }}
      >
        <p
          className="text-xs font-medium"
          style={{ color: 'var(--color-text-tertiary)' }}
        >
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
                className="px-3 py-1.5 rounded-lg disabled:opacity-50 transition-all duration-200 flex items-center gap-1 font-medium cursor-pointer"
                style={{
                  color: 'var(--color-text-secondary)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.05)';
                  e.currentTarget.style.color = 'var(--color-primary)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.color = 'var(--color-secondary)'
                }}
                title="Cancel"
              >
                <X size={16} />
              </button>
              <button
                disabled={saving}
                onClick={handleSave}
                className="px-3 py-1.5 rounded-lg disabled:opacity-50 transition-all duration-200 flex items-center gap-1 font-medium cursor-pointer"
                style={{
                  color: 'var(--color-text-secondary)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.05)';
                  e.currentTarget.style.color = 'var(--color-primary)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.color = 'var(--color-secondary)'
                }}
                title="Save"
              >
                <Check size={16} />
              </button>
            </div>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={toggleUploadWindow}
                className="px-3 py-1.5 rounded-lg transition-all duration-200 flex items-center gap-1 font-medium cursor-pointer"
                style={{
                  color: 'var(--color-text-secondary)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.05)';
                  e.currentTarget.style.color = 'var(--color-primary)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.color = 'var(--color-secondary)'
                }}
                title="Attach Media"
              >
                <Paperclip size={16} />
              </button>
              <button
                onClick={handleEdit}
                className="px-3 py-1.5 rounded-lg transition-all duration-200 flex items-center gap-1 font-medium cursor-pointer"
                style={{
                  color: 'var(--color-text-secondary)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.05)';
                  e.currentTarget.style.color = 'var(--color-primary)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.color = 'var(--color-secondary)'
                }}
                title="Edit"
              >
                <Edit size={16} />
              </button>
            </div>
          )}

          <button
            onClick={toggleDialog}
            className="px-3 py-1.5 rounded-lg transition-all duration-200 flex items-center gap-1 font-medium cursor-pointer"
            style={{
              color: 'var(--color-text-secondary)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.05)';
              e.currentTarget.style.color = 'var(--color-primary)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.color = 'var(--color-secondary)'
            }}
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