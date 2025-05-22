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

const ListDays: React.FC<ListDaysProps> = ({ setSelectedDay, selectedDay, userData }) => {
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
    <div className="flex justify-center gap-4 h-[89vh] rounded-2xl overflow-auto bg-gradient-to-br from-amber-50 to-amber-100/50">
      {/* Sidebar */}

      <div
        className={`${
          sidebarHidden ? "w-fit" : "w-[20rem]"
        } bg-white rounded-2xl shadow-md flex flex-col transition-all duration-300 border border-amber-200`}
      >
        {/* List of days */}
        <ul className="flex-1 p-2 overflow-y-auto scrollbar-hide">
          {days.map((item) => (
            <li
              key={item.date}
              onClick={() => setSelectedDay(item.date)}
              className={`p-3 rounded-lg my-1 cursor-pointer border transition-all ${
                item.date === selectedDay
                  ? "bg-amber-100 border-amber-300 font-semibold shadow-sm"
                  : "bg-white hover:bg-amber-50 border-transparent hover:border-amber-200"
              }`}
              title={item.date}
            >
              <div>
                <span
                  className={`${
                    sidebarHidden ? "text-sm" : "text-md"
                  } text-amber-900`}
                >
                  {new Date(item.date).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
                {!sidebarHidden && item.latest_summary && (
                  <div className="mt-1">
                    <span className="text-xs text-amber-700 line-clamp-2">
                      {item.latest_summary}
                    </span>
                  </div>
                )}
              </div>
            </li>
          ))}

          {days.length === 0 && !isLoading && (
            <li className="p-4 text-center text-amber-700 italic">
              No entries found. Start writing today!
            </li>
          )}
        </ul>

        {/* Load more button */}
        <div className="p-2 border-t border-amber-200 text-center bg-amber-50 rounded-b-2xl">
          {hasMore ? (
            <button
              onClick={fetchDays}
              className="text-sm text-amber-700 hover:text-amber-900 font-medium flex items-center justify-center w-full gap-2 py-1"
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
            <span className="text-xs text-amber-600">No more days</span>
          )}
        </div>

        {/* Sidebar toggle */}
        <div className="p-2 text-right border-t border-amber-200">
          <button
            onClick={() => setSidebarHidden(!sidebarHidden)}
            className="text-xs text-amber-600 hover:text-amber-800 transition-colors"
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
