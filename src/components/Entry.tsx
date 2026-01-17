import { useEffect, useRef } from "react"
import type { Entry } from "@/types/diary.types"
import { useDiaryStore } from "@/store/diary.store"
import { useDebouncedCallback } from "@/utils/actions.utils";
import { Trash } from "lucide-react"

export default function Entry({ entry }: { entry: Entry }) {
  const { updateEntry, deleteEntry } = useDiaryStore()
  const contentRef = useRef<HTMLDivElement>(null)

  // track last saved content
  const lastSavedRef = useRef(entry.content)

  // debounced save
  const debouncedSave = useDebouncedCallback((content: string) => {
    if (content !== lastSavedRef.current) {
      lastSavedRef.current = content
      updateEntry({ id: entry.id, content })
    }
  }, 2000)


  // keep DOM in sync if entry updates externally
  useEffect(() => {
    if (
      contentRef.current &&
      contentRef.current.textContent !== entry.content
    ) {
      contentRef.current.textContent = entry.content
      lastSavedRef.current = entry.content
    }
  }, [entry.content])

  return (
    <div className="group relative rounded-xl border border-transparent hover:border-border-subtle hover:bg-surface-subtle shadow-md shadow-surface-default/20 transition-all duration-200">
      <div
        ref={contentRef}
        contentEditable
        suppressContentEditableWarning
        className="
          min-h-[3rem]
          prose prose-sm max-w-none
          whitespace-pre-wrap
          bg-surface-default
          text-text-primary font-body
          outline-none
          focus:bg-surface-default focus:shadow-sm focus:ring-2 focus:ring-accent-primary/20
          rounded-lg p-4
          transition-all duration-200
        "onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault()
            document.execCommand("insertLineBreak")
          }
        }}
        onPaste={(e) => {
          e.preventDefault()
          const text = e.clipboardData.getData("text/plain")
          text.replace(/\r\n/g, "\n").split("\n").forEach((line, i) => {
            if (i > 0) document.execCommand("insertLineBreak")
            document.execCommand("insertText", false, line)
          })
        }}
        onInput={(e) => {
          const text = e.currentTarget.textContent ?? ""
          debouncedSave(text)
        }}
        onBlur={(e) => {
          const text = e.currentTarget.textContent ?? ""
          if (text !== lastSavedRef.current) {
            lastSavedRef.current = text
            updateEntry({ id: entry.id, content: text })
          }
        }}

      />

      <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <button
          onClick={() => deleteEntry(entry.entry_date, entry.id)}
          className="text-xs font-medium text-red-500 hover:text-red-600 px-2 py-1 rounded transition-colors"
        >
          <Trash className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
