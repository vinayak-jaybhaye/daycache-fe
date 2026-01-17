import { api } from "@/services/apiClient";
import type { ActiveDays } from "@/types/diary.types";
import { getMonthDateRange } from "@/utils/calendar.utils";

export const createActivitySlice = (set: any, get: any) => ({
  activeDays: {} as ActiveDays,

  fetchActiveDaysForMonth: async (yearMonth: string) => {
    if (get().activeDays[yearMonth]) return

    const { start_date, end_date } = getMonthDateRange(yearMonth)

    const dates = await api.days.list({
      start_date,
      end_date,
    })

    set((state: any) => ({
      activeDays: {
        ...state.activeDays,
        [yearMonth]: dates,
      },
    }))
  },

  removeDayFromActiveDays(date: string) {
    const ym = date.slice(0, 7)

    set((state: any) => {
      const days = state.activeDays[ym]
      if (!days) return {}

      const filtered = days.filter((d: string) => d !== date)

      // month still has active days
      if (filtered.length > 0) {
        return {
          activeDays: {
            ...state.activeDays,
            [ym]: filtered,
          },
        }
      }

      // month becomes empty → remove it
      const { [ym]: _, ...rest } = state.activeDays
      return { activeDays: rest }
    })
  },

  addDayToActiveDays(date: string) {
    const ym = date.slice(0, 7)

    set((state: any) => {
      const days = state.activeDays[ym]
      if (!days) return {}

      // already present → no-op
      if (days.includes(date)) return {}

      return {
        activeDays: {
          ...state.activeDays,
          [ym]: [...days, date],
        },
      }
    })
  },
})
