import { useEffect, useRef } from "react";
import type { Entry } from "@/types/diary.types";
import { useDiaryStore } from "@/store/diary.store";
import { useDebouncedCallback } from "@/utils/actions.utils";
import { Trash } from "lucide-react";

export default function DiaryViewEntry({ entry }: { entry: Entry }) {
    const { updateEntry, deleteEntry } = useDiaryStore();
    const contentRef = useRef<HTMLDivElement>(null);
    const lastSavedRef = useRef(entry.content);

    const debouncedSave = useDebouncedCallback((content: string) => {
        if (content !== lastSavedRef.current) {
            lastSavedRef.current = content;
            updateEntry({ id: entry.id, content });
        }
    }, 2000);

    useEffect(() => {
        if (
            contentRef.current &&
            contentRef.current.textContent !== entry.content
        ) {
            contentRef.current.textContent = entry.content;
            lastSavedRef.current = entry.content;
        }
    }, [entry.content]);

    return (
        <div
            className="rounded-sm duration-200 text-[#2c1810] group relative hover:bg-black/5 p-2 -mx-2 transition-colors"
            style={{
                fontFamily: "'Caveat', cursive",
                fontSize: "18px",
                fontWeight: "400",
            }}
        >
            <div className="flex justify-between items-center mb-1">
                <span className="text-xs font-semibold mr-2 text-primary/70">
                    {new Date(entry.updated_at || entry.created_at).toLocaleTimeString(
                        "en-US",
                        {
                            hour: "numeric",
                            minute: "2-digit",
                            hour12: true,
                        },
                    )}
                </span>

                <button
                    onClick={() => deleteEntry(entry.entry_date, entry.id)}
                    className="md:opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-red-800/60 hover:text-red-800 p-1"
                    title="Delete entry"
                >
                    <Trash className="w-3.5 h-3.5" />
                </button>
            </div>

            <div
                ref={contentRef}
                contentEditable
                suppressContentEditableWarning
                className="outline-none leading-relaxed tracking-wide min-h-[1.5em] whitespace-pre-wrap"
                onKeyDown={(e) => {
                    if (e.key === "Enter") {
                        e.preventDefault();
                        document.execCommand("insertLineBreak");
                    }
                }}
                onPaste={(e) => {
                    e.preventDefault();
                    const text = e.clipboardData.getData("text/plain");
                    text
                        .replace(/\r\n/g, "\n")
                        .split("\n")
                        .forEach((line, i) => {
                            if (i > 0) document.execCommand("insertLineBreak");
                            document.execCommand("insertText", false, line);
                        });
                }}
                onInput={(e) => {
                    const text = e.currentTarget.textContent ?? "";
                    debouncedSave(text);
                }}
                onBlur={(e) => {
                    const text = e.currentTarget.textContent ?? "";
                    if (text !== lastSavedRef.current) {
                        lastSavedRef.current = text;
                        updateEntry({ id: entry.id, content: text });
                    }
                }}
            >
                {entry.content}
            </div>
        </div>
    );
}
