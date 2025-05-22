import { useEffect, useState } from "react";
import Entry from "./Entry";
import AddEntry from "./AddEntry";
import { CalendarDays, Loader2, RefreshCw } from "lucide-react";

interface DayProps {
  date: string;
  userId: string;
}

const Day: React.FC<DayProps> = ({ date, userId }) => {
  const [day, setDay] = useState<any | null>(null);
  const [entries, setEntries] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [summarizing, setSummarizing] = useState<boolean>(false);

  const onDelete = (id: string) => {
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
        `${import.meta.env.VITE_API_URL}/users/${userId}/days/${
          day.id
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
      <div className="mb-6 mx-auto">
        {/* Header Skeleton */}
        <div className="animate-pulse border-b border-amber-200 pb-4">
          <div className="h-8 w-52 bg-amber-100 mb-2 rounded"></div>
          <div className="h-6 w-36 bg-amber-100 rounded"></div>
        </div>

        {/* Body Skeleton */}
        <div className="p-6 bg-amber-50 mt-6 rounded-xl shadow-md">
          <div className="h-10 w-32 bg-amber-100 mb-4 rounded-full"></div>

          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="mb-4 p-4 bg-white rounded-lg shadow-sm animate-pulse"
            >
              <div className="h-5 w-3/4 bg-amber-100 mb-2 rounded"></div>
              <div className="h-4 w-11/12 bg-amber-50 mb-1 rounded"></div>
              <div className="h-3 w-1/3 bg-amber-50 rounded"></div>
            </div>
          ))}

          <div className="mt-6 p-4 bg-white rounded-lg shadow-sm">
            <div className="h-6 w-32 bg-amber-100 mb-4 rounded"></div>
            <div className="h-14 w-full bg-amber-50 mb-3 rounded"></div>
            <div className="h-9 w-40 bg-amber-100 rounded-md"></div>
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
    <div className="overflow-auto scrollbar-hide mx-auto transition-all duration-300 ease-in-out">
      {/* Header */}
      <div className="mb-6 border-b border-amber-200 px-4 py-2 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-serif text-amber-900 mb-2 flex items-center gap-2">
            <CalendarDays className="h-6 w-6 text-amber-700" />
            {formattedDate}
          </h1>
          <span className="text-amber-700 font-medium">
            {entries.length} {entries.length === 1 ? "Entry" : "Entries"}
          </span>
        </div>
      </div>

      <div className="bg-gradient-to-br from-amber-50 to-amber-100/70 rounded-xl shadow-md overflow-auto flex flex-col gap-6 transition-all duration-300">
        <AddEntry
          date={date}
          onEntryAdded={(newEntry) => setEntries((prev) => [...prev, newEntry])}
        />

        <div className="bg-white rounded-lg shadow-sm p-5 border border-amber-100">
          <h2 className="text-xl font-serif font-semibold mb-4 text-amber-900 border-b border-amber-100 pb-2">
            Today's Highlights
          </h2>

          <div className="space-y-4">
            {entries.length > 0 ? (
              entries.map((entry) => (
                <Entry key={entry.id} entry={entry} onDelete={onDelete} />
              ))
            ) : (
              <div className="text-center py-8 text-amber-700 italic bg-amber-50/50 rounded-lg border border-dashed border-amber-200">
                No highlights found for this day
              </div>
            )}
          </div>

          {day && (
            <div className="mt-8 border-t border-dashed border-amber-200 pt-4">
              <h3 className="text-lg font-serif font-medium mb-3 text-amber-800">
                Day Summary
              </h3>
              <div className="bg-amber-50/70 p-4 rounded-lg border border-amber-100 mb-4">
                {day.latest_summary ? (
                  <p className="text-amber-900 leading-relaxed">
                    {day.latest_summary}
                  </p>
                ) : (
                  <p className="text-amber-700 italic">
                    No summary available yet. Generate one to reflect on your
                    day.
                  </p>
                )}
              </div>
              <button
                onClick={generateSummary}
                disabled={summarizing}
                className="px-4 py-2 bg-amber-600 text-white rounded-md shadow-sm hover:bg-amber-700 transition-colors duration-200 flex items-center gap-2 disabled:opacity-70"
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
    </div>
  );
};

export default Day;
