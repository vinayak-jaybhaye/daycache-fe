import { create } from "zustand"

import { createDayListSlice, initialDayList } from "@/store/daylist.slice"
import { createEntriesSlice } from "@/store/entries.slice"
import { createActivitySlice } from "@/store/datelist.slice"

import type {
  DayListWithMetadata,
  DayWithEntries,
  ActiveDays,
  DayMetadata,
} from "@/types/diary.types"

export interface DiaryStore {
  dayList: DayListWithMetadata
  dayWithEntries: DayWithEntries
  activeDays: ActiveDays

  fetchNextDayListPage: () => Promise<void>
  upsertDayMetadata: (dayMetadata: DayMetadata) => void
  deleteDayMetadata: (date: string) => void
  fetchActiveDaysForMonth: (yearMonth: string) => Promise<void>

  fetchEntriesForDay: (date: string) => Promise<void>
  addEntry: (entry: { date: string; content: string }) => void
  updateEntry: (entry: {id: number, content: string}) => void
  deleteEntry: (date: string, entryId: number) => void

  removeDayFromActiveDays: (date: string) => void
  addDayToActiveDays: (date: string) => void

  clearAll: () => void
}

export const useDiaryStore = create<DiaryStore>()((set, get) => ({
  ...createDayListSlice(set, get),
  ...createEntriesSlice(set, get),
  ...createActivitySlice(set, get),

  clearAll: () => {
    set({
      dayList: initialDayList,
      dayWithEntries: {},
      activeDays: {},
    })
  },
}))
