import type React from "react";
import {
  Loader2,
  ChevronDown,
} from "lucide-react";
import { useState, useEffect } from "react";

import type { Day, ListDaysProps } from '../types'


const ListDays: React.FC<ListDaysProps> = ({
  setSelectedDay,
  selectedDay,
  userData,
  setCurrentView = () => { },
}) => {
  const sidebarHidden = false;
  const [days, setDays] = useState<Day[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const fetchDays = async () => {
    if (!userData?.id || isLoading || !hasMore) return;
    setIsLoading(true);
    try {
      let url = `${import.meta.env.VITE_API_URL}/users/${userData.id
        }/days?limit=10`;
      const lastDate = days[days.length - 1]?.date;
      if (lastDate) {
        url += `&last_date=${lastDate}`;
      }

      const response = await fetch(url, {
        method: "GET",
        credentials: "include",
      });
      if (!response.ok) throw new Error("Failed to fetch days");

      const data: Day[] = await response.json();
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

  useEffect(() => {
    if (userData) {
      fetchDays();
    }
  }, [userData]);

  const todayDate = new Date().toISOString().slice(0, 10); // e.g., "2025-07-14"


  return (
    <div className="flex justify-center gap-4 h-full rounded-2xl overflow-auto theme-bg">
      <div
        className={`rounded-2xl theme-shadow flex flex-col transition-all duration-300 theme-border border theme-sidebar w-full`}
      >
        {/* List of days */}
        <ul className="flex-1 p-2 overflow-y-auto scrollbar-hide">
          {
            (!days || days[0]?.date != todayDate) && (
              <li
                key={todayDate}
                onClick={() => {
                  setSelectedDay(todayDate);
                  setCurrentView("content");
                }}
                className={`p-3 rounded-lg my-1 cursor-pointer theme-border border transition-all font-medium ${todayDate === selectedDay
                  ? "theme-button-primary theme-shadow"
                  : "theme-card hover:theme-sidebar-hover theme-text"
                  }`}
                title={todayDate}
              >
                <div>
                  <span
                    className={`${sidebarHidden ? "text-sm" : "text-md"} ${todayDate === selectedDay ? "text-white" : "theme-text"
                      }`}
                  >
                    {new Date(todayDate).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>

                </div>
              </li>
            )
          }
          {days.map((item) => (
            <li
              key={item.date}
              onClick={() => {
                setSelectedDay(item.date);
                setCurrentView("content");
              }}
              className={`p-3 rounded-lg my-1 cursor-pointer theme-border border transition-all font-medium ${item.date === selectedDay
                ? "theme-button-primary theme-shadow"
                : "theme-card hover:theme-sidebar-hover theme-text"
                }`}
              title={item.date}
            >
              <div>
                <span
                  className={`${sidebarHidden ? "text-sm" : "text-md"} ${item.date === selectedDay ? "text-white" : "theme-text"
                    }`}
                >
                  {new Date(item.date).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
                {!sidebarHidden && item.latest_summary && (
                  <div className="mt-1">
                    <span
                      className={`text-xs line-clamp-2 ${item.date === selectedDay
                        ? "text-white opacity-90"
                        : "theme-text-muted"
                        }`}
                    >
                      {item.latest_summary}
                    </span>
                  </div>
                )}
              </div>
            </li>
          ))}

          {days.length === 0 && !isLoading && (
            <li className="p-4 text-center theme-text-muted italic">
              No entries found. Start writing today!
            </li>
          )}
        </ul>

        {/* Load more button */}
        <div className="p-2 theme-border border-t text-center theme-card rounded-b-2xl ">
          {hasMore ? (
            <button
              onClick={fetchDays}
              className="text-sm theme-text hover:theme-text-secondary font-medium flex items-center justify-center w-full gap-2 py-2 rounded-lg hover:theme-sidebar-hover transition-colors"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Loading...
                </>
              ) : (
                <>
                  <ChevronDown className="h-4 w-4" />
                  Load More
                </>
              )}
            </button>
          ) : (
            <span className="text-xs theme-text-muted py-2 block">
              No more days
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ListDays;
