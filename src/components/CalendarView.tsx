import React, { useState, useEffect } from "react";
import ActivityCalendar from "./ActivityCalendar";

const CalendarView: React.FC = ({ gridCols = 3 }) => {
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
    <div>
      <div
        className={`grid grid-cols-1 gap-2 ${
          gridCols == 3 && "md:grid-cols-2 lg:grid-cols-3"
        }`}
      >
        {months.map((month) => (
          <ActivityCalendar key={month} date={`${month}-01`} />
        ))}
      </div>

      <div className="flex justify-center mt-8">
        <button
          onClick={generateLastSixMonths}
          className="px-6 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors"
        >
          Load More
        </button>
      </div>
    </div>
  );
};

export default CalendarView;
