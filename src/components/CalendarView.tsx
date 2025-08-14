import { useState, useEffect } from "react";
import ActivityCalendar from "./ActivityCalendar";
import { ChevronDown, History } from "lucide-react";

const CalendarView = ({ gridCols = 3 }) => {
  const currentMonth = new Date().toISOString().slice(0, 7);
  const [months, setMonths] = useState<string[]>([currentMonth]);
  const [isLoading, setIsLoading] = useState(false);

  const generateLastSixMonths = async () => {
    setIsLoading(true);

    // Simulate loading delay for better UX
    await new Promise(resolve => setTimeout(resolve, 300));

    const [year, month] = months[months.length - 1].split("-").map(Number);
    const baseDate = new Date(year, month - 1);

    const monthArray: string[] = [];

    for (let i = 0; i < 6; i++) {
      const date = new Date(baseDate.getFullYear(), baseDate.getMonth() - i, 1);
      const formatted = date.toISOString().slice(0, 7);
      monthArray.push(formatted);
    }

    setMonths((prev) => [...new Set([...prev, ...monthArray])]);
    setIsLoading(false);
  };

  useEffect(() => {
    // Initial load
    generateLastSixMonths();
  }, []);

  return (
    <div
      className="min-h-full overflow-auto scrollbar-hide mx-auto transition-all duration-300 ease-in-out"
      style={{
        backgroundColor: "var(--color-bg-primary)",
      }}
    >
      {/* Header Section */}
      <div className="mb-8">
        <div
          className="text-center gap-4 p-2"
          style={{ color: "var(--color-text-primary)" }}
        >
          <div>
            <h1
              className="text-2xl md:text-3xl font-serif font-bold tracking-wide"
              style={{ color: "var(--color-text-primary)" }}
            >
              Activity Overview
            </h1>
            <p
              className="text-sm md:text-base mt-1"
              style={{ color: "var(--color-text-secondary)" }}
            >
              Track your daily activities and progress
            </p>
          </div>
        </div>

        {/* Stats bar */}
        <div
          className="flex items-center justify-center gap-2 text-sm px-4 py-2 rounded-lg mt-4 mx-2"
          style={{
            backgroundColor: "var(--color-surface-secondary)",
            border: "1px solid var(--color-border-primary)",
          }}
        >
          <History className="h-4 w-4" style={{ color: "var(--color-text-tertiary)" }} />
          <span style={{ color: "var(--color-text-secondary)" }}>
            Viewing {months.length} month{months.length !== 1 ? 's' : ''} of activity
          </span>
        </div>
      </div>

      {/* Calendar Grid */}
      <div
        className={`grid gap-4 md:gap-6 mb-8 transition-all duration-500 ${gridCols === 3
          ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
          : "grid-cols-1"
          }`}
        style={{
          opacity: isLoading ? 0.7 : 1,
          transform: isLoading ? "translateY(10px)" : "translateY(0)",
        }}
      >
        {months.map((month, index) => (
          <div
            key={month}
            className="transition-all duration-300 hover:z-10 relative"
            style={{
              animationDelay: `${index * 100}ms`,
              animation: `fadeInUp 0.6s ease-out ${index * 100}ms both`,
            }}
          >
            <ActivityCalendar date={`${month}-01`} />
          </div>
        ))}
      </div>

      {/* Load More Button */}
      <div className="flex justify-center">
        <div className="relative group">
          <button
            onClick={generateLastSixMonths}
            disabled={isLoading}
            className={`
              flex items-center justify-center gap-3 px-8 py-4 rounded-xl font-medium text-base
              transition-all duration-200 relative overflow-hidden group
              ${isLoading ? 'cursor-not-allowed' : 'cursor-pointer'}
            `}
            style={{
              backgroundColor: isLoading
                ? "var(--color-surface-tertiary)"
                : "var(--color-primary)",
              color: isLoading
                ? "var(--color-text-tertiary)"
                : "var(--color-text-inverse)",
              boxShadow: isLoading
                ? "var(--shadow-sm)"
                : "var(--shadow-lg)",
              transform: isLoading ? "scale(0.98)" : "scale(1)",
            }}
            onMouseEnter={(e) => {
              if (!isLoading) {
                e.currentTarget.style.boxShadow = "var(--shadow-xl)";
                e.currentTarget.style.transform = "scale(1.05)";
              }
            }}
            onMouseLeave={(e) => {
              if (!isLoading) {
                e.currentTarget.style.boxShadow = "var(--shadow-lg)";
                e.currentTarget.style.transform = "scale(1)";
              }
            }}
          >
            {/* Background gradient effect */}
            <div
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{
                background: `linear-gradient(45deg, var(--color-primary-600), var(--color-accent))`,
              }}
            />

            {/* Button content */}
            <div className="relative z-10 flex items-center gap-3">
              {isLoading ? (
                <>
                  <div
                    className="w-5 h-5 border-2 border-t-transparent rounded-full animate-spin"
                    style={{ borderColor: "var(--color-text-tertiary)" }}
                  />
                  <span>Loading...</span>
                </>
              ) : (
                <>
                  <History className="h-5 w-5" />
                  <span>Load Previous 6 Months</span>
                  <ChevronDown
                    className="h-5 w-5 transition-transform duration-200 group-hover:translate-y-1"
                  />
                </>
              )}
            </div>

            {/* Ripple effect */}
            {!isLoading && (
              <div className="absolute inset-0 rounded-xl overflow-hidden">
                <div
                  className="absolute inset-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300"
                  style={{
                    background: `linear-gradient(to top, var(--color-primary-700), transparent)`,
                    opacity: 0.2,
                  }}
                />
              </div>
            )}
          </button>

          {/* Glow effect for dark themes */}
          <div
            className="absolute inset-0 rounded-xl blur-xl opacity-0 group-hover:opacity-30 transition-opacity duration-300 -z-10"
            style={{
              background: `linear-gradient(45deg, var(--color-primary), var(--color-accent))`,
            }}
          />
        </div>
      </div>

      {/* Bottom spacing */}
      <div className="h-8" />
    </div>
  );
};

export default CalendarView;