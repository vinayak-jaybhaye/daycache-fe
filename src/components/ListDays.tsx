import type React from "react";
import {
  ArrowBigRightDashIcon,
  ArrowBigLeftDashIcon,
  Loader2,
  ChevronDown,
} from "lucide-react";
import { useState, useEffect } from "react";

interface DayData {
  id: string;
  user_id: string;
  date: string;
  latest_summary: string;
  created_at: string;
}

interface ListDaysProps {
  setSelectedDay: (date: string) => void;
  selectedDay: string;
  userData: { id: string };
}

const ListDays: React.FC<ListDaysProps> = ({
  setSelectedDay,
  selectedDay,
  userData,
}) => {
  const [sidebarHidden, setSidebarHidden] = useState(window.innerWidth < 768);
  const [days, setDays] = useState<DayData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true); // controls pagination

  const fetchDays = async () => {
    if (!userData?.id || isLoading || !hasMore) return;
    setIsLoading(true);
    try {
      let url = `${import.meta.env.VITE_API_URL}/users/${
        userData.id
      }/days?limit=10`;
      const lastDate = days[days.length - 1]?.date;
      if (lastDate) {
        url += `&last_date=${encodeURIComponent(lastDate)}`;
      }

      const response = await fetch(url, {
        method: "GET",
        credentials: "include",
      });
      if (!response.ok) throw new Error("Failed to fetch days");

      const data: DayData[] = await response.json();
      setDays((prev) => [...prev, ...data]);

      if (data.length < 10) {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Failed to fetch days:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    if (userData) {
      fetchDays();
    }
  }, [userData]);

  return (
    <div className="flex justify-center gap-4 h-[89vh] rounded-2xl overflow-auto bg-background text-text">
      {/* Sidebar */}

      <div
        className={`${
          sidebarHidden ? "w-fit" : "w-[20rem]"
        } rounded-2xl shadow-md flex flex-col transition-all duration-300 border bg-background text-text`}
      >
        {/* List of days */}
        <ul className="flex-1 p-2 overflow-y-auto scrollbar-hide">
          {days.map((item) => (
            <li
              key={item.date}
              onClick={() => setSelectedDay(item.date)}
              className={`p-3 rounded-lg my-1 cursor-pointer border transition-all ${
                item.date === selectedDay
                  ? "bg-background text-text border-border font-semibold shadow-sm"
                  : "bg-background text-text hover:bg-background border-border hover:border-border"
              }`}
              title={item.date}
            >
              <div>
                <span
                  className={`${
                    sidebarHidden ? "text-sm" : "text-md"
                  } text-text`}
                >
                  {new Date(item.date).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
                {!sidebarHidden && item.latest_summary && (
                  <div className="mt-1">
                    <span className="text-xs text-text line-clamp-2">
                      {item.latest_summary}
                    </span>
                  </div>
                )}
              </div>
            </li>
          ))}

          {days.length === 0 && !isLoading && (
            <li className="p-4 text-center text-text italic">
              No entries found. Start writing today!
            </li>
          )}
        </ul>

        {/* Load more button */}
        <div className="p-2 border-t border-border text-center bg-background rounded-b-2xl">
          {hasMore ? (
            <button
              onClick={fetchDays}
              className="text-sm text-text hover:text-text font-medium flex items-center justify-center w-full gap-2 py-1"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                </>
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </button>
          ) : (
            <span className="text-xs text-text">No more days</span>
          )}
        </div>

        {/* Sidebar toggle */}
        <div className="p-2 text-right border-t border-border">
          <button
            onClick={() => setSidebarHidden(!sidebarHidden)}
            className="text-xs text-text hover:text-amber-800 transition-colors"
          >
            {sidebarHidden ? (
              <ArrowBigRightDashIcon />
            ) : (
              <ArrowBigLeftDashIcon />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ListDays;
