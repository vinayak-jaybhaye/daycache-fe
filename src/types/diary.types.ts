export interface Entry {
  id: number
  content: string
  entry_date: string
  created_at: string
  updated_at: string
}

export interface DayMetadata {
  date: string
  summary?: string
  tags?: string[]
  updated_at?: string
  created_at?: string
}

export interface DayWithMetadata {
  date: string
  summary?: string
  tags?: string[]
  updated_at?: string
}

export type DayListWithMetadata = {
  order: string[]                       // DESC
  items: Record<string, DayWithMetadata>
  pagination: {
    limit: number
    hasMore: boolean
    loading: boolean
  }
}

export type DayWithEntries = {
  [date: string]: {
    entries: Entry[]
  }
}

export type ActiveDays = {
  [yearMonth: string]: string[] // YYYY-MM -> dates
}
