import { useState, useEffect, useRef, useCallback } from "react";
import type { ChangeEvent, KeyboardEvent } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../store/store";
import { PlusCircle, Loader2 } from "lucide-react";

import type { Entry } from '../types'

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
          credentials: 'include'
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
        `${import.meta.env.VITE_API_URL}/users/${user?.id
        }/days/${date}/entries/create`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ content: entryText }),
          credentials: "include",
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
    <div
      className="relative px-5 py-6 rounded-lg border"
      style={{
        backgroundColor: 'var(--color-surface-primary)',
        borderColor: 'var(--color-border-primary)',
        boxShadow: 'var(--shadow-base)'
      }}
    >
      <h3
        className="text-lg font-serif font-semibold mb-3"
        style={{ color: 'var(--color-text-primary)' }}
      >
        Add New Entry
      </h3>
      <div className="flex gap-3 items-start">
        <div className="flex-1 relative">
          <textarea
            value={entryText}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder="How was your day?"
            ref={inputRef}
            rows={1}
            className="text-base py-3 px-4 rounded-lg border transition-all duration-200 resize-none w-full overflow-y-auto leading-snug font-serif"
            style={{
              minHeight: "48px",
              maxHeight: "200px",
              boxSizing: "border-box",
              backgroundColor: 'var(--color-surface-secondary)',
              borderColor: 'var(--color-border-secondary)',
              color: 'var(--color-text-primary)'
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = 'var(--color-border-focus)';
              e.currentTarget.style.boxShadow = `0 0 0 2px var(--color-primary-200)`;
              e.currentTarget.style.backgroundColor = 'var(--color-surface-primary)';
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = 'var(--color-border-secondary)';
              e.currentTarget.style.boxShadow = 'none';
              e.currentTarget.style.backgroundColor = 'var(--color-surface-secondary)';
              setSuggestion("");
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
                <span
                  className="opacity-75"
                  style={{ color: 'var(--color-text-tertiary)' }}
                >
                  {suggestion}
                </span>
              </span>
            </div>
          )}
        </div>

        <button
          onClick={handleAddEntry}
          disabled={loading || !entryText.trim()}
          className="min-w-[44px] h-[44px] px-3 rounded-lg transition-all duration-200 font-medium flex items-center justify-center"
          style={{
            backgroundColor: loading || !entryText.trim()
              ? 'var(--color-surface-tertiary)'
              : 'var(--color-primary)',
            color: loading || !entryText.trim()
              ? 'var(--color-text-secondary)'
              : 'var(--color-primary-foreground)',
            boxShadow: 'var(--shadow-base)',
            opacity: loading || !entryText.trim() ? 0.5 : 1,
            cursor: loading || !entryText.trim() ? 'not-allowed' : 'pointer',
            border: '1px solid var(--color-border-primary)'
          }}
          onMouseEnter={(e) => {
            if (!loading && entryText.trim()) {
              e.currentTarget.style.transform = 'scale(1.05)';
              e.currentTarget.style.boxShadow = 'var(--shadow-md)';
            }
          }}
          onMouseLeave={(e) => {
            if (!loading && entryText.trim()) {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.boxShadow = 'var(--shadow-base)';
            }
          }}
        >
          {loading ? (
            <Loader2
              className="h-5 w-5 animate-spin"
              style={{ color: 'inherit' }}
            />
          ) : (
            <PlusCircle
              className="h-5 w-5"
              style={{ color: 'inherit' }}
            />
          )}
        </button>
      </div>
    </div>
  );
}

export default AddEntry;