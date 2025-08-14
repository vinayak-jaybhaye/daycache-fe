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
    <div
      className="flex justify-center gap-4 h-full overflow-auto"
      style={{ backgroundColor: 'var(--color-bg-primary)' }}
    >
      <div
        className="flex flex-col transition-all duration-300 border w-full"
        style={{
          backgroundColor: 'var(--color-surface-primary)',
          borderColor: 'var(--color-border-primary)',
          boxShadow: 'var(--shadow-base)'
        }}
      >
        {/* List of days */}
        <ul className="flex-1 p-2 overflow-y-auto scrollbar-hide">
          {(!days || days[0]?.date != todayDate) && (
            <li
              key={todayDate}
              onClick={() => {
                setSelectedDay(todayDate);
                setCurrentView("content");
              }}
              className="p-3 rounded-lg my-1 cursor-pointer border transition-all duration-200 font-medium"
              style={{
                backgroundColor: todayDate === selectedDay
                  ? 'var(--color-primary)'
                  : 'var(--color-surface-secondary)',
                borderColor: 'var(--color-border-primary)',
                color: todayDate === selectedDay
                  ? 'var(--color-primary-foreground)'
                  : 'var(--color-text-primary)',
                boxShadow: todayDate === selectedDay
                  ? 'var(--shadow-md)'
                  : 'var(--shadow-sm)'
              }}
              onMouseEnter={(e) => {
                if (todayDate !== selectedDay) {
                  e.currentTarget.style.backgroundColor = 'var(--color-surface-tertiary)';
                  e.currentTarget.style.boxShadow = 'var(--shadow-base)';
                  e.currentTarget.style.transform = 'translateX(2px)';
                }
              }}
              onMouseLeave={(e) => {
                if (todayDate !== selectedDay) {
                  e.currentTarget.style.backgroundColor = 'var(--color-surface-secondary)';
                  e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
                  e.currentTarget.style.transform = 'translateX(0)';
                }
              }}
              title={todayDate}
            >
              <div>
                <span
                  className={sidebarHidden ? "text-sm" : "text-md"}
                  style={{
                    color: todayDate === selectedDay
                      ? 'var(--color-primary-foreground)'
                      : 'var(--color-text-primary)'
                  }}
                >
                  {new Date(todayDate).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
              </div>
            </li>
          )}

          {days.map((item) => (
            <li
              key={item.date}
              onClick={() => {
                setSelectedDay(item.date);
                setCurrentView("content");
              }}
              className="p-3 rounded-lg my-1 cursor-pointer border transition-all duration-200 font-medium"
              style={{
                backgroundColor: item.date === selectedDay
                  ? 'var(--color-primary)'
                  : 'var(--color-surface-secondary)',
                borderColor: 'var(--color-border-primary)',
                color: item.date === selectedDay
                  ? 'var(--color-primary-foreground)'
                  : 'var(--color-text-primary)',
                boxShadow: item.date === selectedDay
                  ? 'var(--shadow-md)'
                  : 'var(--shadow-sm)'
              }}
              onMouseEnter={(e) => {
                if (item.date !== selectedDay) {
                  e.currentTarget.style.backgroundColor = 'var(--color-surface-tertiary)';
                  e.currentTarget.style.boxShadow = 'var(--shadow-base)';
                  e.currentTarget.style.transform = 'translateX(2px)';
                }
              }}
              onMouseLeave={(e) => {
                if (item.date !== selectedDay) {
                  e.currentTarget.style.backgroundColor = 'var(--color-surface-secondary)';
                  e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
                  e.currentTarget.style.transform = 'translateX(0)';
                }
              }}
              title={item.date}
            >
              <div>
                <span
                  className={sidebarHidden ? "text-sm" : "text-md"}
                  style={{
                    color: item.date === selectedDay
                      ? 'var(--color-primary-foreground)'
                      : 'var(--color-text-primary)'
                  }}
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
                      className="text-xs line-clamp-2"
                      style={{
                        color: item.date === selectedDay
                          ? 'var(--color-primary-foreground)'
                          : 'var(--color-text-secondary)',
                        opacity: item.date === selectedDay ? 0.9 : 1
                      }}
                    >
                      {item.latest_summary}
                    </span>
                  </div>
                )}
              </div>
            </li>
          ))}

          {days.length === 0 && !isLoading && (
            <li
              className="p-4 text-center italic"
              style={{ color: 'var(--color-text-tertiary)' }}
            >
              No entries found. Start writing today!
            </li>
          )}
        </ul>

        {/* Load more button */}
        <div
          className="p-2 border-t text-center rounded-b-2xl"
          style={{
            backgroundColor: 'var(--color-surface-primary)',
            borderColor: 'var(--color-border-primary)'
          }}
        >
          {hasMore ? (
            <button
              onClick={fetchDays}
              className="text-sm font-medium flex items-center justify-center w-full gap-2 py-2 rounded-lg transition-all duration-200"
              style={{
                color: 'var(--color-text-primary)',
                backgroundColor: 'transparent'
              }}
              onMouseEnter={(e) => {
                if (!isLoading) {
                  e.currentTarget.style.backgroundColor = 'var(--color-surface-secondary)';
                  e.currentTarget.style.color = 'var(--color-text-secondary)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isLoading) {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = 'var(--color-text-primary)';
                }
              }}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2
                    className="h-4 w-4 animate-spin"
                    style={{ color: 'inherit' }}
                  />
                </>
              ) : (
                <>
                  <ChevronDown
                    className="h-4 w-4"
                    style={{ color: 'inherit' }}
                  />
                  Load More
                </>
              )}
            </button>
          ) : (
            <span
              className="text-xs py-2 block"
              style={{ color: 'var(--color-text-tertiary)' }}
            >
              End of the list !
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ListDays;