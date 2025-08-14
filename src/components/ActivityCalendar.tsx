import type React from "react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface ActivityCalendarProps {
  date: string;
}

const ActivityCalendar: React.FC<ActivityCalendarProps> = ({ date }) => {
  const [activeDays, setActiveDays] = useState<Record<string, boolean>>({});
  const currentDate = new Date().toISOString().slice(0, 10);

  const navigate = useNavigate()

  useEffect(() => {
    async function fetchActiveDays() {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/days/get-active-days/${date}`,
          {
            method: "GET",
            credentials: "include",
          }
        );

        if (!res.ok) throw new Error("Failed to fetch active days");

        const days: string[] = await res.json();

        const daysMap: Record<string, boolean> = {};
        days.forEach((day) => (daysMap[day] = true));
        setActiveDays(daysMap);
      } catch (err) {
        console.error(err);
      }
    }

    fetchActiveDays();
  }, [date]);


  const year = new Date(date).getFullYear();
  const month = new Date(date).getMonth();
  const firstDayIndex = new Date(year, month, 1).getDay();
  const totalDays = new Date(year, month + 1, 0).getDate();

  const calendarDays = [];

  // Empty placeholders before first day of month
  for (let i = 0; i < firstDayIndex; i++) {
    calendarDays.push(
      <div
        key={`empty-${i}`}
        className="w-9 h-9 md:w-11 md:h-11 rounded-full"
      />
    );
  }

  // Actual days
  for (let day = 1; day <= totalDays; day++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(
      day
    ).padStart(2, "0")}`;
    const isActive = !!activeDays[dateStr];
    const isToday = dateStr === currentDate;
    const isPast = dateStr < currentDate;
    const isFuture = dateStr > currentDate;

    calendarDays.push(
      <div
        key={dateStr}
        className={`w-9 h-9 flex items-center justify-center rounded-xl text-sm font-semibold transition-all duration-200 select-none relative overflow-hidden group ${dateStr <= currentDate ? "cursor-pointer" : "cursor-default"
          }`}
        style={{
          backgroundColor: isActive
            ? "var(--color-primary)"
            : isFuture
              ? "var(--color-surface-tertiary)"
              : "var(--color-surface-secondary)",
          color: isActive
            ? "var(--color-text-inverse)"
            : isFuture
              ? "var(--color-text-quaternary)"
              : "var(--color-text-primary)",
          boxShadow: isActive
            ? "var(--shadow-md)"
            : isToday
              ? `0 0 0 2px var(--color-primary), 0 0 0 4px var(--color-surface-primary)`
              : "var(--shadow-sm)",
          border: isToday
            ? "2px solid var(--color-primary)"
            : isPast && !isActive
              ? "1px solid var(--color-border-secondary)"
              : "1px solid var(--color-border-primary)",
          transform: isActive ? "scale(1.05)" : "scale(1)",
        }}
        title={
          isActive
            ? "Active Day - Click to view"
            : isFuture
              ? "Future date"
              : "No activity recorded"
        }
        onClick={() => {
          if (dateStr <= currentDate) navigate(`/day/${dateStr}`)
        }}
        onMouseEnter={(e) => {
          if (dateStr <= currentDate && !isActive) {
            e.currentTarget.style.backgroundColor = "var(--color-primary-100)";
            e.currentTarget.style.color = "var(--color-primary-700)";
            e.currentTarget.style.transform = "scale(1.1)";
            e.currentTarget.style.boxShadow = "var(--shadow-lg)";
          } else if (isActive) {
            e.currentTarget.style.transform = "scale(1.15)";
            e.currentTarget.style.boxShadow = "var(--shadow-xl)";
          }
        }}
        onMouseLeave={(e) => {
          if (dateStr <= currentDate && !isActive) {
            e.currentTarget.style.backgroundColor = "var(--color-surface-secondary)";
            e.currentTarget.style.color = "var(--color-text-primary)";
            e.currentTarget.style.transform = "scale(1)";
            e.currentTarget.style.boxShadow = "var(--shadow-sm)";
          } else if (isActive) {
            e.currentTarget.style.transform = "scale(1.05)";
            e.currentTarget.style.boxShadow = "var(--shadow-md)";
          }
        }}
      >
        {/* Background pattern for active days */}
        {isActive && (
          <div
            className="absolute inset-0 rounded-full opacity-20"
            style={{
              background: `radial-gradient(circle at 30% 30%, var(--color-accent), transparent 70%)`,
            }}
          />
        )}

        {/* Shimmer effect for today */}
        {isToday && (
          <div
            className="absolute inset-0 rounded-full animate-pulse"
            style={{
              background: `linear-gradient(45deg, transparent 30%, var(--color-primary-200) 50%, transparent 70%)`,
              opacity: 0.3,
            }}
          />
        )}

        <span className="relative z-10">{day}</span>

        {/* Active indicator dot */}
        {isActive && (
          <div
            className="absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full animate-pulse"
            style={{
              backgroundColor: "var(--color-success)",
              boxShadow: "0 0 6px var(--color-success)",
            }}
          />
        )}
      </div>
    );
  }

  const monthYear = new Date(date).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric'
  });

  return (
    <div
      className="p-2 rounded-xl border transition-all duration-300 hover:scale-[1.01] backdrop-blur-sm"
      style={{
        backgroundColor: "var(--color-surface-primary)",
        borderColor: "var(--color-border-primary)",
        boxShadow: "var(--shadow-lg)",
      }}
    >
      {/* Header */}
      <div className="flex justify-end items-center mb-2">

        <div
          className="px-3 py-1 rounded-full text-sm font-medium"
          style={{
            backgroundColor: "var(--color-primary-100)",
            color: "var(--color-primary-700)",
            border: "1px solid var(--color-primary-200)",
          }}
        >
          {monthYear}
        </div>
      </div>

      {/* Day labels */}
      <div className="grid grid-cols-7 gap-1 mb-4">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div
            key={day}
            className="text-center text-xs font-bold py-2 rounded-md"
            style={{
              color: "var(--color-text-secondary)",
              backgroundColor: "var(--color-surface-secondary)",
            }}
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div
        className="grid grid-cols-7 gap-2 p-2 rounded-lg"
        style={{
          backgroundColor: "var(--color-bg-secondary)",
          border: "1px solid var(--color-border-secondary)",
        }}
      >
        {calendarDays}
      </div>

      {/* Legend */}
      <div className="flex justify-center items-center gap-6 mt-4 pt-4 border-t" style={{ borderColor: "var(--color-border-primary)" }}>
        <div className="flex items-center gap-2 text-xs">
          <div
            className="w-4 h-4 rounded-full"
            style={{
              backgroundColor: "var(--color-primary)",
              boxShadow: "var(--shadow-sm)",
            }}
          />
          <span style={{ color: "var(--color-text-secondary)" }}>Active</span>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <div
            className="w-4 h-4 rounded-full border-2"
            style={{
              borderColor: "var(--color-primary)",
              backgroundColor: "var(--color-surface-primary)",
            }}
          />
          <span style={{ color: "var(--color-text-secondary)" }}>Today</span>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <div
            className="w-4 h-4 rounded-full"
            style={{
              backgroundColor: "var(--color-surface-tertiary)",
              border: "1px solid var(--color-border-primary)",
            }}
          />
          <span style={{ color: "var(--color-text-secondary)" }}>Future</span>
        </div>
      </div>
    </div>
  );
};

export default ActivityCalendar;