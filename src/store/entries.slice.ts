import { api } from "@/services/apiClient"
import type { Entry, DayWithEntries } from "@/types/diary.types"
import type { DiaryStore } from "@/store/diary.store"

export const createEntriesSlice = (set: any, get: any) => ({
  dayWithEntries: {} as DayWithEntries,

  fetchEntriesForDay: async (date: string) => {
    if (get().dayWithEntries[date]) return

    const entries = await api.days.getEntriesForDay(date)

    set((state: any) => ({
      dayWithEntries: {
        ...state.dayWithEntries,
        [date]: { entries },
      },
    }))
  },

  addEntry: async ({ date, content }: { date: string; content: string }) => {

    const newEntry = await api.entries.create({
      content,
      entry_date: date,
    })

    get().upsertDayMetadata({ date, summary: " ", tags: [] })
    get().addDayToActiveDays(date)

    set((state: any) => {
      const prevDayEntries = state.dayWithEntries[date]?.entries ?? []

      return {
        // -------- entries --------
        dayWithEntries: {
          ...state.dayWithEntries,
          [date]: {
            entries: [
              newEntry,
              ...prevDayEntries.filter((e: Entry) => e.id !== newEntry.id),
            ],
          },
        },
      }
    })
  },

  deleteEntry: async (date: string, entryId: number) => {
    // delete from server first
    await api.entries.delete(entryId)

    // check if day is having another entry
    const doesDayHaveAnotherEntry = get().dayWithEntries[date].entries.length > 1
    if (!doesDayHaveAnotherEntry) {
      get().deleteDayMetadata(date)
      get().removeDayFromActiveDays(date)
    }

    // update local cache
    set((state: DiaryStore) => {

      // remove entry from its day
      const dayWithEntries = {
        ...state.dayWithEntries,
        [date]: {
          entries: state.dayWithEntries[date].entries.filter(e => e.id !== entryId),
        },
      }

      return { dayWithEntries }
    })
  },


  updateEntry: async ({id, content}: {id: number, content: string}) => {
    // update entry on server
    const updatedEntry = await api.entries.update(
      Number(id),
      content
    )

    // update local cache
    set((state: DiaryStore) => {
      let updated = false

      const dayWithEntries = Object.fromEntries(
        Object.entries(state.dayWithEntries).map(([date, day]) => {
          const entries = day.entries.map((e) => {
            if (e.id === updatedEntry.id) {
              updated = true
              return updatedEntry
            }
            return e
          })

          return [date, { entries }]
        })
      )

      // entry not cached → no-op
      if (!updated) {
        return {}
      }

      return { dayWithEntries }
    })
  }

})
