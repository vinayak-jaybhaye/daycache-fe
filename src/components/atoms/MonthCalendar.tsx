import { getMonthHeader } from "@/utils/calendar.utils"
type MonthCalendarProps = {
    yearMonth: string // "yyyy-mm"
    activeDays?: string[] // ["yyyy-mm-dd"]
    selectedDay?: string
    onDayClick?: (date: string) => void
}

export default function MonthCalendar({
    yearMonth,
    activeDays = [],
    selectedDay,
    onDayClick,
}: MonthCalendarProps) {
    const [year, month] = yearMonth.split("-").map(Number)

    // month index is 0-based
    const firstDay = new Date(year, month - 1, 1)
    const daysInMonth = new Date(year, month, 0).getDate()
    const startWeekday = firstDay.getDay() // 0 = Sunday

    const activeSet = new Set(activeDays)

    const cells: (string | null)[] = []

    // leading empty cells
    for (let i = 0; i < startWeekday; i++) {
        cells.push(null)
    }

    // actual days
    for (let day = 1; day <= daysInMonth; day++) {
        const dd = String(day).padStart(2, "0")
        const mm = String(month).padStart(2, "0")
        cells.push(`${year}-${mm}-${dd}`)
    }

    return (
        <div className="w-full max-w-sm mx-auto bg-surface-default border border-border-subtle rounded-xl p-4 shadow-sm">
            <div className="text-center text-lg font-semibold mb-2">
                {getMonthHeader(yearMonth)}
            </div>
            <div className="grid grid-cols-7 mb-2">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
                    <div key={d} className="text-center text-xs font-semibold text-text-muted py-1">
                        {d}
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-7 gap-1">
                {cells.map((date, idx) =>
                    date ? (
                        <button
                            key={date}
                            onClick={() => onDayClick?.(date)}
                            className={`h-9 rounded-md flex items-center justify-center text-sm font-medium transition-all duration-200 
                                ${selectedDay === date
                                    ? "bg-surface-selected text-accent-primary border-2 border-accent-primary font-bold shadow-md"
                                    : activeSet.has(date)
                                        ? "bg-accent-primary text-text-inverse shadow-sm hover:bg-accent-strong scale-105"
                                        : "bg-surface-default text-text-primary hover:bg-surface-raised hover:text-accent-primary hover:scale-105"
                                }`}
                        >
                            {Number(date.slice(-2))}
                        </button>
                    ) : (
                        <div key={`empty-${idx}`} />
                    )
                )}
            </div>
        </div>
    )
}
