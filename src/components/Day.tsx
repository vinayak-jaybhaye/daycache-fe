import DiaryView from "./DiaryView";

import { useEffect, useState } from "react";
import Entry from "./Entry";
import AddEntry from "./AddEntry";
import { CalendarDays, Loader2, NotebookIcon, RefreshCw, CircleChevronLeft } from "lucide-react";

interface DayProps {
  date: string;
  userId: string;
  setCurrentView: (() => void) | null;
}

const Day = ({ date, userId, setCurrentView = null }: DayProps) => {
  const [day, setDay] = useState<any | null>(null);
  const [entries, setEntries] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(true);
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
      <div className="mb-6 mx-auto w-[100vw]">
        {/* Header Skeleton */}
        <div className="animate-pulse theme-border border-b pb-4">
          <div className="h-8 w-52 theme-card mb-2 rounded"></div>
          <div className="h-6 w-36 theme-card rounded"></div>
        </div>

        {/* Body Skeleton */}
        <div className="p-6 theme-card mt-6 rounded-xl theme-shadow">
          <div className="h-10 w-32 theme-card mb-4 rounded-full"></div>

          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="mb-4 p-4 theme-entry rounded-lg theme-shadow animate-pulse"
            >
              <div className="h-5 w-3/4 theme-card mb-2 rounded"></div>
              <div className="h-4 w-11/12 theme-card mb-1 rounded"></div>
              <div className="h-3 w-1/3 theme-card rounded"></div>
            </div>
          ))}

          <div className="mt-6 p-4 theme-entry rounded-lg theme-shadow">
            <div className="h-6 w-32 theme-card mb-4 rounded"></div>
            <div className="h-14 w-full theme-card mb-3 rounded"></div>
            <div className="h-9 w-40 theme-card rounded-md"></div>
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
    <div className="theme-bg overflow-auto scrollbar-hide mx-auto transition-all duration-300 ease-in-out">
      {/* Header */}
      <div className="mb-6 theme-border border-b px-2 py-2 flex items-center justify-between">
        <div className="flex gap-4">
          {setCurrentView != null && (
            <button onClick={setCurrentView}>
              <CircleChevronLeft size={26} />
            </button>
          )}
          <div>
            <h1 className="md:text-3xl mb-2 flex items-center gap-2 theme-text font-serif">
              <CalendarDays className="h-6 w-6 theme-text-secondary" />
              {formattedDate}
            </h1>
            <span className="font-medium theme-text-muted">
              {entries.length} {entries.length === 1 ? "Entry" : "Entries"}
            </span>
          </div>
        </div>
        <button
          onClick={() => setShowDiaryView((prev) => !prev)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg theme-button-secondary hover:opacity-90 transition-all duration-200 theme-shadow font-medium"
        >
          {showDiaryView ? (
            <NotebookIcon className="h-5 w-5 theme-text-secondary" />
          ) : (
            <NotebookIcon className="h-5 w-5 theme-text-secondary" />
          )}
        </button>
      </div>

      <div
        className={`theme-card rounded-xl theme-shadow overflow-auto flex flex-col gap-6 transition-all duration-300 ${showDiaryView && "hidden"
          }`}
      >
        <AddEntry
          date={date}
          onEntryAdded={(newEntry) =>
            setEntries((prev: any) => [...prev, newEntry])
          }
        />

        <div className="theme-card rounded-lg theme-shadow p-2 theme-border border">
          <h2 className="text-xl font-semibold mb-4 theme-text theme-border border-b p-2 font-serif">
            Today's Highlights
          </h2>

          <div className="space-y-4">
            {entries.length > 0 ? (
              entries.map((entry: any) => (
                <Entry key={entry.id} entry={entry} onDelete={onDelete} />
              ))
            ) : (
              <div className="text-center py-8 theme-text-muted italic theme-card rounded-lg theme-border border border-dashed">
                No highlights found for this day
              </div>
            )}
          </div>

          {day && (
            <div className="mt-8 theme-border border-t pt-4">
              <h3 className="text-lg font-medium mb-3 theme-text font-serif">
                Day Summary
              </h3>
              <div className="theme-entry p-4 rounded-lg theme-border border mb-4">
                {day.latest_summary ? (
                  <p className="theme-text leading-relaxed">
                    {day.latest_summary}
                  </p>
                ) : (
                  <p className="theme-text-muted italic">
                    No summary available yet. Generate one to reflect on your
                    day.
                  </p>
                )}
              </div>
              <button
                onClick={generateSummary}
                disabled={summarizing}
                className="theme-button-primary px-4 py-2 rounded-lg theme-shadow hover:opacity-90 transition-all duration-200 flex items-center gap-2 disabled:opacity-50 font-medium"
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
      {/* diary view */}
      <div
        className={`theme-card rounded-xl theme-shadow overflow-auto flex flex-col gap-6 transition-all duration-300 ${!showDiaryView && "hidden"
          }`}
      >
        <DiaryView entries={entries} />
      </div>
    </div>
  );
};

export default Day;
