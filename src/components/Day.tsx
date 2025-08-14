import DiaryView from "./DiaryView";

import { useEffect, useState } from "react";
import Entry from "./Entry";
import AddEntry from "./AddEntry";
import { Loader2, NotebookIcon, RefreshCw, CircleChevronLeft } from "lucide-react";

interface DayProps {
  date: string;
  userId: string;
  setCurrentView: (() => void) | null;
}

const Day = ({ date, userId, setCurrentView = null }: DayProps) => {
  const [day, setDay] = useState<any | null>(null);
  const [entries, setEntries] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [summarizing, setSummarizing] = useState<boolean>(false);
  const [showDiaryView, setShowDiaryView] = useState<boolean>(false);

  const onDelete = (id: number) => {
    setEntries((prev: [any]) => prev.filter((entry: any) => entry.id !== id));
  };

  const fetchDayData = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/users/${userId}/days/${date}`,
        {
          cache: "no-store",
        }
      );

      if (response.status === 404) {
        setDay(null);
        setEntries([]);
        return;
      }

      if (!response.ok) throw new Error("Failed to fetch entries");

      const data = await response.json();
      setDay(data);
      setEntries(data?.entries || []);
    } catch (err) {
      console.error("Error fetching entries:", err);
    } finally {
      setLoading(false);
    }
  };

  const generateSummary = async () => {
    if (!day) return;

    try {
      setSummarizing(true);
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/users/${userId}/days/${day.id
        }/summarize`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        }
      );

      if (!response.ok) throw new Error("Failed to generate summary");

      const data = await response.json();
      setDay((prev: any) => ({ ...prev, latest_summary: data }));
    } catch (err) {
      console.error("Error generating summary:", err);
    } finally {
      setSummarizing(false);
    }
  };

  useEffect(() => {
    fetchDayData();
  }, [date, userId]);

  if (loading) {
    return (
      <div
        className="overflow-auto scrollbar-hide mx-auto transition-all duration-300 ease-in-out"
        style={{ backgroundColor: 'var(--color-bg-primary)' }}
      >
        {/* Header Skeleton */}
        <div
          className="mb-6 border-b px-2 md:px-4 py-2 flex items-center justify-between animate-pulse"
          style={{ borderColor: 'var(--color-border-primary)' }}
        >
          <div className="flex gap-4">
            <div className="h-7 w-7 rounded-full"
              style={{ backgroundColor: 'var(--color-surface-secondary)' }}
            />
            <div>
              <div className="h-7 w-56 mb-2 rounded"
                style={{ backgroundColor: 'var(--color-surface-secondary)' }}
              />
              <div className="h-5 w-32 rounded"
                style={{ backgroundColor: 'var(--color-surface-secondary)' }}
              />
            </div>
          </div>
          <div className="h-10 w-10 rounded-lg"
            style={{ backgroundColor: 'var(--color-surface-secondary)' }}
          />
        </div>

        {/* Main Content Skeleton */}
        <div
          className="rounded-xl overflow-auto flex flex-col gap-6 p-4 md:p-6 animate-pulse"
          style={{
            backgroundColor: 'var(--color-surface-primary)',
            boxShadow: 'var(--shadow-base)'
          }}
        >
          {/* AddEntry skeleton */}
          <div className="rounded-lg border p-4"
            style={{ borderColor: 'var(--color-border-primary)' }}
          >
            <div className="h-6 w-36 mb-4 rounded"
              style={{ backgroundColor: 'var(--color-surface-secondary)' }}
            />
            <div className="h-12 w-full mb-3 rounded"
              style={{ backgroundColor: 'var(--color-surface-secondary)' }}
            />
            <div className="h-9 w-40 rounded"
              style={{ backgroundColor: 'var(--color-surface-secondary)' }}
            />
          </div>

          {/* Highlights skeleton list */}
          <div className="rounded-lg border p-4"
            style={{ borderColor: 'var(--color-border-primary)' }}
          >
            <div className="h-6 w-44 mb-6 rounded"
              style={{ backgroundColor: 'var(--color-surface-secondary)' }}
            />
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="mb-4 p-4 rounded-lg"
                style={{
                  backgroundColor: 'var(--color-surface-secondary)',
                  boxShadow: 'var(--shadow-sm)'
                }}
              >
                <div className="h-5 w-3/4 mb-2 rounded"
                  style={{ backgroundColor: 'var(--color-surface-tertiary)' }}
                />
                <div className="h-4 w-11/12 mb-1 rounded"
                  style={{ backgroundColor: 'var(--color-surface-tertiary)' }}
                />
                <div className="h-3 w-1/3 rounded"
                  style={{ backgroundColor: 'var(--color-surface-tertiary)' }}
                />
              </div>
            ))}

            {/* Summary skeleton */}
            <div className="mt-8 border-t pt-4"
              style={{ borderColor: 'var(--color-border-primary)' }}
            >
              <div className="h-5 w-32 mb-3 rounded"
                style={{ backgroundColor: 'var(--color-surface-secondary)' }}
              />
              <div className="h-20 w-full mb-4 rounded"
                style={{ backgroundColor: 'var(--color-surface-secondary)' }}
              />
              <div className="h-9 w-44 rounded"
                style={{ backgroundColor: 'var(--color-surface-secondary)' }}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }


  const formattedDate = new Date(date).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div
      className="overflow-auto scrollbar-hide mx-auto transition-all duration-300 ease-in-out"
      style={{ backgroundColor: 'var(--color-bg-primary)' }}
    >
      {/* Header */}
      <div
        className="mb-6 border-b px-2 md:px-4 py-2 flex items-center justify-between"
        style={{ borderColor: 'var(--color-border-primary)' }}
      >
        <div className="flex gap-4">
          {setCurrentView != null && (
            <button
              onClick={setCurrentView}
              className="transition-all duration-200 hover:scale-105"
              style={{ color: 'var(--color-text-secondary)' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = 'var(--color-primary)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = 'var(--color-text-secondary)';
              }}
            >
              <CircleChevronLeft size={26} />
            </button>
          )}
          <div>
            <h1
              className="md:text-3xl mb-2 flex items-center gap-2 font-serif"
              style={{ color: 'var(--color-text-primary)' }}
            >
              {formattedDate}
            </h1>
            <span
              className="font-medium"
              style={{ color: 'var(--color-text-tertiary)' }}
            >
              {entries.length} {entries.length === 1 ? "Entry" : "Entries"}
            </span>
          </div>
        </div>
        <button
          onClick={() => setShowDiaryView((prev) => !prev)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 font-medium"
          style={{
            backgroundColor: 'var(--color-surface-secondary)',
            color: 'var(--color-text-primary)',
            boxShadow: 'var(--shadow-base)',
            border: '1px solid var(--color-border-primary)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--color-surface-tertiary)';
            e.currentTarget.style.boxShadow = 'var(--shadow-md)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--color-surface-secondary)';
            e.currentTarget.style.boxShadow = 'var(--shadow-base)';
          }}
        >
          <NotebookIcon
            className="h-5 w-5"
            style={{ color: 'var(--color-text-secondary)' }}
          />
        </button>
      </div>

      {/* Main Content View */}
      <div
        className={`rounded-xl overflow-auto flex flex-col gap-6 transition-all duration-300 ${showDiaryView && "hidden"}`}
        style={{
          backgroundColor: 'var(--color-surface-primary)',
          boxShadow: 'var(--shadow-base)'
        }}
      >
        <AddEntry
          date={date}
          onEntryAdded={(newEntry) =>
            setEntries((prev: any) => [...prev, newEntry])
          }
        />

        <div
          className="rounded-lg p-2 border"
          style={{
            backgroundColor: 'var(--color-surface-primary)',
            boxShadow: 'var(--shadow-sm)',
            borderColor: 'var(--color-border-primary)'
          }}
        >
          <h2
            className="text-xl font-semibold mb-4 border-b p-2 font-serif"
            style={{
              color: 'var(--color-text-primary)',
              borderColor: 'var(--color-border-primary)'
            }}
          >
            Today's Highlights
          </h2>

          <div className="space-y-4">
            {entries.length > 0 ? (
              entries.map((entry: any) => (
                <Entry key={entry.id} entry={entry} onDelete={onDelete} />
              ))
            ) : (
              <div
                className="text-center py-8 italic rounded-lg border border-dashed"
                style={{
                  color: 'var(--color-text-tertiary)',
                  backgroundColor: 'var(--color-surface-secondary)',
                  borderColor: 'var(--color-border-secondary)'
                }}
              >
                No highlights found for this day
              </div>
            )}
          </div>

          {day && (
            <div
              className="mt-8 border-t pt-4"
              style={{ borderColor: 'var(--color-border-primary)' }}
            >
              <h3
                className="text-lg font-medium mb-3 font-serif"
                style={{ color: 'var(--color-text-primary)' }}
              >
                Day Summary
              </h3>
              <div
                className="p-4 rounded-lg border mb-4"
                style={{
                  backgroundColor: 'var(--color-surface-secondary)',
                  borderColor: 'var(--color-border-primary)'
                }}
              >
                {day.latest_summary ? (
                  <p
                    className="leading-relaxed"
                    style={{ color: 'var(--color-text-primary)' }}
                  >
                    {day.latest_summary}
                  </p>
                ) : (
                  <p
                    className="italic"
                    style={{ color: 'var(--color-text-tertiary)' }}
                  >
                    No summary available yet. Generate one to reflect on your
                    day.
                  </p>
                )}
              </div>
              <button
                onClick={generateSummary}
                disabled={summarizing}
                className="px-4 py-2 rounded-lg transition-all duration-200 flex items-center gap-2 disabled:opacity-50 font-medium"
                style={{
                  backgroundColor: 'var(--color-primary)',
                  color: 'var(--color-primary-foreground)',
                  boxShadow: 'var(--shadow-base)'
                }}
                onMouseEnter={(e) => {
                  if (!summarizing) {
                    e.currentTarget.style.boxShadow = 'var(--shadow-md)';
                    e.currentTarget.style.transform = 'translateY(-1px)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!summarizing) {
                    e.currentTarget.style.boxShadow = 'var(--shadow-base)';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }
                }}
              >
                {summarizing ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <RefreshCw className="h-4 w-4" />
                    {day.latest_summary
                      ? "Regenerate Summary"
                      : "Generate Summary"}
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Diary View */}
      <div
        className={`rounded-xl overflow-auto flex flex-col gap-6 transition-all duration-300 ${!showDiaryView && "hidden"}`}
        style={{
          backgroundColor: 'var(--color-surface-primary)',
          boxShadow: 'var(--shadow-base)'
        }}
      >
        <DiaryView entries={entries} />
      </div>
    </div>
  );
};

export default Day;