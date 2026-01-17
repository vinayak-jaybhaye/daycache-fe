export function getMonthDateRange(yearMonth: string) {
  const [year, month] = yearMonth.split("-").map(Number);

  const daysInMonth = new Date(year, month, 0).getDate();
  const mm = String(month).padStart(2, "0");

  return {
    start_date: `${year}-${mm}-01`,
    end_date: `${year}-${mm}-${daysInMonth}`,
  };
}

export function getOnePreviousDay(date: string) {
  const [year, month, day] = date.split("-").map(Number);

  const d = new Date(year, month - 1, day);
  d.setDate(d.getDate() - 1);

  return d.toISOString().slice(0, 10);
}

export function getMonthHeader(yearMonth: string) {
  const [year, month] = yearMonth.split("-").map(Number);
  const d = new Date(year, month - 1, 1);
  return d.toLocaleString("en", { month: "long", year: "numeric" });
}

export function isDateValid(date: string): boolean {
  // must match YYYY-MM-DD
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return false
  }

  const [y, m, d] = date.split("-").map(Number)

  // JS months are 0-based
  const parsed = new Date(Date.UTC(y, m - 1, d))

  // invalid date (e.g. 2026-02-30)
  if (
    parsed.getUTCFullYear() !== y ||
    parsed.getUTCMonth() !== m - 1 ||
    parsed.getUTCDate() !== d
  ) {
    return false
  }

  // today (UTC, date-only)
  const today = new Date()
  const todayUTC = new Date(
    Date.UTC(
      today.getUTCFullYear(),
      today.getUTCMonth(),
      today.getUTCDate()
    )
  )

  return parsed <= todayUTC
}
export function getDateString(date: string): string {
  const [y, m, d] = date.split("-").map(Number)
  return new Date(y, m - 1, d).toLocaleDateString("en", {
    month: "long",
    day: "numeric",
    year: "numeric",
  })
}

export function getPrevious6Months(date?: string): string[] {
  const base = date
    ? new Date(`${date}-01`)
    : new Date()

  // if date is older than 2020 return []
  if(base.getFullYear() < 2020) return []

  const months: string[] = []

  const start = date ? 1 : 0

  for (let i = start; i < start + 6; i++) {
    const d = new Date(base.getFullYear(), base.getMonth() - i, 1)

    months.push(
      `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`
    )
  }

  return months
}

