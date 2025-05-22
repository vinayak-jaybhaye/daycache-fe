"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import type { ChangeEvent, KeyboardEvent } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../store/store";
import { PlusCircle, Loader2 } from "lucide-react";

type Entry = {
  id: string;
  content: string;
  created_at: string;
};

type AddEntryProps = {
  onEntryAdded: (entry: Entry) => void;
  date: string;
};

const debounce = <T extends (...args: any[]) => void>(
  func: T,
  delay: number
): T => {
  let timeoutId: number;
  return ((...args: any[]) => {
    clearTimeout(timeoutId);
    timeoutId = window.setTimeout(() => func(...args), delay);
  }) as T;
};

function AddEntry({ onEntryAdded, date }: AddEntryProps) {
  const user = useSelector((state: RootState) => state.user.user);
  const [entryText, setEntryText] = useState<string>("");
  const [suggestion, setSuggestion] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const inputRef = useRef<HTMLTextAreaElement | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  const fetchSuggestions = async (text: string) => {
    if (!text.trim()) {
      setSuggestion("");
      return;
    }

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/autocomplete`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ content: text }),
          signal: abortController.signal,
        }
      );

      if (!response.ok) throw new Error("Failed to fetch suggestions");

      const data = await response.json();
      const suggestionSuffix = data.suggestions?.[0] || "";
      setSuggestion(suggestionSuffix);
    } catch (error: any) {
      if (error.name !== "AbortError") {
        console.error("Error fetching suggestions:", error);
        setSuggestion("");
      }
    } finally {
      if (abortControllerRef.current === abortController) {
        abortControllerRef.current = null;
      }
    }
  };

  const debouncedFetchSuggestions = useCallback(
    debounce(fetchSuggestions, 2000),
    []
  );

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setEntryText(value);
    debouncedFetchSuggestions(value);
    setSuggestion("");
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.key === "Tab" || e.key === "Enter") && suggestion) {
      e.preventDefault();
      setEntryText(entryText + suggestion);
      setSuggestion("");
    }
  };

  const handleAddEntry = async () => {
    if (!entryText.trim()) return;

    try {
      setLoading(true);

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/users/${
          user?.id
        }/days/${date}/entries/create`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ content: entryText }),
        }
      );

      if (!response.ok) throw new Error("Failed to add entry");

      const data = await response.json();
      onEntryAdded(data.entry);

      setEntryText("");
      setSuggestion("");
    } catch (error) {
      console.error("Error adding entry:", error);
      alert("Failed to add entry. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative px-5 py-6 bg-white rounded-lg border border-amber-200 shadow-sm">
      <h3 className="text-lg font-serif font-semibold mb-3 text-amber-900">
        Add New Entry
      </h3>
      <div className="flex gap-3 items-start">
        <div className="flex-1 relative">
          <textarea
            value={entryText}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            onBlur={() => setSuggestion("")}
            placeholder="How was your day?"
            ref={inputRef}
            rows={1}
            className="text-base py-3 px-4 rounded-lg border border-amber-200 hover:border-amber-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 resize-none w-full overflow-y-auto leading-snug bg-amber-50/50"
            style={{
              minHeight: "48px",
              maxHeight: "200px",
              boxSizing: "border-box",
            }}
            onInput={(e) => {
              const target = e.target as HTMLTextAreaElement;
              target.style.height = "auto";
              target.style.height = `${Math.min(target.scrollHeight, 200)}px`;
            }}
          />

          {suggestion && entryText && (
            <div
              className="absolute left-0 top-0 pointer-events-none w-full"
              style={{
                padding: "12px 16px",
                font: "inherit",
                whiteSpace: "pre-wrap",
                wordBreak: "break-word",
              }}
            >
              <span className="text-transparent">
                {entryText}
                <span className="text-amber-400 opacity-75">{suggestion}</span>
              </span>
            </div>
          )}
        </div>

        <button
          onClick={handleAddEntry}
          disabled={loading || !entryText.trim()}
          className={`min-w-[44px] h-[44px] px-3 rounded-lg transition-all text-white font-medium flex items-center justify-center ${
            loading || !entryText.trim()
              ? "bg-amber-300 cursor-not-allowed"
              : "bg-amber-600 hover:bg-amber-700"
          }`}
        >
          {loading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <PlusCircle className="h-5 w-5" />
          )}
        </button>
      </div>
    </div>
  );
}

export default AddEntry;
