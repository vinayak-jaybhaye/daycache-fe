"use client"

import type React from "react"
import { useState } from "react"
import Media from "./Media"
import { Trash2, Edit, Save } from "lucide-react"

interface MediaItem {
  id: number
  url: string
  type: string
}

interface EntryData {
  id: number
  day_id: number
  content: string
  created_at: string
  media?: MediaItem[]
}

interface EntryProps {
  entry: EntryData
  onDelete: (id: number) => void
}

const Entry: React.FC<EntryProps> = ({ entry, onDelete }) => {
  const [content, setContent] = useState(entry?.content || "")
  const [isEditing, setIsEditing] = useState(false)
  const [editedContent, setEditedContent] = useState(content)
  const [visibleDialog, setVisibleDialog] = useState(false)
  const [saving, setSaving] = useState(false)

  if (!entry) return null

  const toggleDialog = () => {
    setVisibleDialog(!visibleDialog)
  }

  const handleEdit = () => {
    setEditedContent(content)
    setIsEditing(!isEditing)
  }

  const handleSave = async () => {
    if (content === editedContent) {
      setIsEditing(false)
      setEditedContent("")
      return
    }
    try {
      setSaving(true)
      const response = await fetch(`${import.meta.env.VITE_API_URL}/entries/${entry.id}/update`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content: editedContent }),
        credentials: "include",
      })

      if (!response.ok) {
        throw new Error("Failed to update entry")
      }

      setContent(editedContent)
      setIsEditing(false)
      setEditedContent("")
    } catch (error) {
      console.error("Failed to update entry:", error)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/days/${entry.day_id}/entries/${entry.id}/delete`, {
        method: "DELETE",
        credentials: "include",
      })

      if (!response.ok) {
        throw new Error("Failed to delete entry")
      }

      onDelete(entry.id)
    } catch (error) {
      console.error("Failed to delete entry:", error)
    }
    toggleDialog()
  }

  return (
    <div className="bg-amber-50 shadow-md rounded-xl p-6 mb-4 transition-all hover:shadow-lg border border-amber-200 hover:border-amber-300">
      {/* Custom Confirm Dialog */}
      {visibleDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 shadow-xl max-w-sm w-full border border-amber-100 animate-fadeIn">
            <h3 className="text-lg font-semibold mb-4 text-center text-amber-900">Please confirm</h3>
            <p className="text-sm text-amber-700 text-center mb-6">Are you sure you want to delete this entry?</p>
            <div className="flex justify-center gap-4">
              <button
                onClick={toggleDialog}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center gap-2"
              >
                <Trash2 size={16} />
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Entry Content */}
      {isEditing ? (
        <textarea
          value={editedContent}
          onChange={(e) => setEditedContent(e.target.value)}
          rows={3}
          className="w-full bg-white text-amber-900 border border-amber-300 focus:ring-2 focus:ring-amber-400 rounded-md p-3 outline-none resize-none transition-all duration-200 font-serif text-lg shadow-inner"
          placeholder="Write something..."
          style={{ lineHeight: "1.6" }}
        />
      ) : (
        <p className="text-amber-900 mb-3 font-serif text-lg leading-relaxed" style={{ whiteSpace: "pre-wrap" }}>
          {content || "Write something..."}
        </p>
      )}

      {/* Media */}
      {entry.media?.length > 0 && entry.media.map((item) => <Media key={item.id} media={item} />)}

      {/* Actions */}
      <div className="flex items-center justify-between mt-3 pt-2 border-t border-amber-100">
        <p className="text-xs text-amber-700/70 font-medium">
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
            <button
              disabled={saving}
              onClick={handleSave}
              className="px-3 py-1.5 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 transition-colors flex items-center gap-1"
              title="Save"
            >
              <Save size={16} />
              Save
            </button>
          ) : (
            <button
              onClick={handleEdit}
              className="px-3 py-1.5 bg-amber-200 text-amber-800 rounded-lg hover:bg-amber-300 transition-colors flex items-center gap-1"
              title="Edit"
            >
              <Edit size={16} />
              Edit
            </button>
          )}

          <button
            onClick={toggleDialog}
            className="px-3 py-1.5 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors flex items-center gap-1"
            title="Delete"
          >
            <Trash2 size={16} />
            Delete
          </button>
        </div>
      </div>
    </div>
  )
}

export default Entry
