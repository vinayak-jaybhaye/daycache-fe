import { api } from "@/services/apiClient"
import type { DayListWithMetadata, DayMetadata } from "@/types/diary.types"
import { getOnePreviousDay } from "@/utils/calendar.utils"

export const initialDayList: DayListWithMetadata = {
  order: [],
  items: {},
  pagination: {
    limit: 10,
    hasMore: true,
    loading: false,
  },
}

export const createDayListSlice = (set: any, get: any) => ({
  dayList: initialDayList,

  fetchNextDayListPage: async () => {
    const { dayList } = get()
    const { pagination, order } = dayList

    if (pagination.loading || !pagination.hasMore) return

    set((state: any) => ({
      dayList: {
        ...state.dayList,
        pagination: {
          ...state.dayList.pagination,
          loading: true,
        },
      },
    }))


    const lastDate = order.at(-1)

    const res = await api.days.list({
      end_date: lastDate ? getOnePreviousDay(lastDate) : undefined,
      limit: pagination.limit,
      include_metadata: true,
    })

    set((state: any) => {
      const nextItems = { ...state.dayList.items }
      const nextOrder = [...state.dayList.order]

      for (const day of res) {
        if (!nextItems[day.date]) {
          nextItems[day.date] = day
          nextOrder.push(day.date)
        }
      }

      nextOrder.sort((a, b) => b.localeCompare(a)) // newest first

      return {
        dayList: {
          items: nextItems,
          order: nextOrder,
          pagination: {
            limit: pagination.limit,
            hasMore: res.length === pagination.limit,
            loading: false,
          },
        },
      }
    })
  },

  upsertDayMetadata: (dayMetadata: DayMetadata) => {
    const { dayList } = get()
    const { items, order } = dayList

    const oldestDayInDayList = order.at(-1) || null;

    if(oldestDayInDayList && dayMetadata.date < oldestDayInDayList)  {
      return 
    }

    if(items[dayMetadata.date]) {
      return set((state: any) => ({
        dayList: {
          ...state.dayList,
          items: {
            ...state.dayList.items,
            [dayMetadata.date]: dayMetadata,
          },
        },
      }))
    }

    const nextOrder = [...order, dayMetadata.date].sort((a, b) =>
      b.localeCompare(a)
    )

    set({
      dayList: {
        ...dayList,
        order: nextOrder,
        items: {
          ...items,
          [dayMetadata.date]: dayMetadata,
        },
      },
    })
  },

  deleteDayMetadata: (date: string) => {
    const { dayList } = get()
    const { items, order } = dayList

    if (!items[date]) return

    const nextItems = { ...items }
    delete nextItems[date]

    const nextOrder = order.filter((d: string) => d !== date)

    set({
      dayList: {
        ...dayList,
        items: nextItems,
        order: nextOrder,
      },
    })
  },
})
