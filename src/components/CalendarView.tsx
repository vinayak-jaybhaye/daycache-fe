import { useState, useEffect } from "react";
import ActivityCalendar from "./ActivityCalendar";
import { ChevronDown } from "lucide-react";

const CalendarView = ({ gridCols = 3 }) => {
  const currentMonth = new Date().toISOString().slice(0, 7);
  const [months, setMonths] = useState<string[]>([currentMonth]);

  const generateLastSixMonths = () => {
    const [year, month] = months[months.length - 1].split("-").map(Number);
    const baseDate = new Date(year, month - 1);

    const monthArray: string[] = [];

    for (let i = 0; i < 6; i++) {
      const date = new Date(baseDate.getFullYear(), baseDate.getMonth() - i, 1);
      const formatted = date.toISOString().slice(0, 7);
      monthArray.push(formatted);
    }
    console.log(monthArray);
    setMonths((prev) => [...new Set([...prev, ...monthArray])]);
  };

  useEffect(() => {
    // Initial load
    generateLastSixMonths();
  }, []);

  return (
    <div className="theme-bg h-full overflow-auto scrollbar-hide mx-auto transition-all duration-300 ease-in-out">
      <div
        className={`grid grid-cols-1 gap-2 ${
          gridCols == 3 && "md:grid-cols-2 lg:grid-cols-3"
        }`}
      >
        {months.map((month) => (
          <ActivityCalendar key={month} date={`${month}-01`} />
        ))}
      </div>

      <div className="flex justify-center mt-4">
        <button
          onClick={generateLastSixMonths}
          className="flex items-center justify-center w-full theme-button-primary theme-shadow hover:theme-button-hover transition-all"
        >
          <ChevronDown className="h-8 w-8" />
        </button>
      </div>
    </div>
  );
};

export default CalendarView;
