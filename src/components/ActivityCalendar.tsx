import type React from "react";
import Day from "./Day";
import { useEffect, useState } from "react";
import DraggableDialog from "./DraggableDialog";
import { useSelector } from "react-redux";

interface ActivityCalendarProps {
  date: string;
}
interface UserData {
  id: string;
  [key: string]: any;
}

interface RootState {
  user: {
    user: UserData | null;
  };
}
const ActivityCalendar: React.FC<ActivityCalendarProps> = ({ date }) => {
  const user = useSelector((state: RootState) => state.user.user);
  const [activeDays, setActiveDays] = useState<Record<string, boolean>>({});
  const [visitDate, setVisitDate] = useState<string | null>(null);
  const currentDate = new Date().toISOString().slice(0, 10);
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

  const toggleDialog = () => {
    setVisitDate(null);
  };

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
        className="w-8 h-8 md:w-10 md:h-10 rounded-full"
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

    calendarDays.push(
      <div
        key={dateStr}
        className={`w-8 h-8 md:w-10 md:h-10 flex items-center justify-center rounded-full text-sm font-medium transition-all cursor-pointer
          ${
            isActive
              ? "theme-calendar-active theme-shadow hover:theme-shadow-hover"
              : "hover:theme-calendar-hover theme-text"
          } 
          ${isToday ? "ring-2 ring-offset-2" : ""}
        `}
        title={isActive ? "Active Day" : ""}
        onClick={() => {
          if (dateStr <= currentDate) setVisitDate(dateStr);
        }}
      >
        {day}
      </div>
    );
  }

  return (
    <div className="p-4 rounded-xl theme-shadow theme-border border theme-card">
      <h3 className="text-lg font-serif flex justify-between font-semibold mb-4 theme-text">
        <span>Activity Calendar</span>
        <span>{date.slice(0, 7)}</span>
      </h3>
      <div className="grid grid-cols-7 gap-1 mb-2">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div
            key={day}
            className="text-center text-xs font-medium theme-text-muted"
          >
            {day}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">{calendarDays}</div>

      {/* day window */}
      {visitDate && (
        <DraggableDialog
          title="Visit Your Day"
          visible={visitDate != null}
          toggleDialog={toggleDialog}
          Component={Day}
          props={{ date: visitDate, userId: user?.id }}
        />
      )}
    </div>
  );
};

export default ActivityCalendar;
