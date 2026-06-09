# State Management

DayCache uses **Zustand 5** for client-side state. There are two stores: one for authentication and one for diary data.

---

## Auth Store

**File:** `src/store/auth.store.ts`

Persisted to `localStorage` under key `"auth"`.

### State

```typescript
{
  user: User | null
  isAuthenticated: boolean
  status: "idle" | "authenticated" | "unauthenticated"
}
```

### Actions

| Action | Behavior |
|--------|----------|
| `setUser(user)` | Sets user, `isAuthenticated: true`, `status: "authenticated"` |
| `logout()` | Clears user, sets `status: "unauthenticated"`, calls `diaryStore.clearAll()` |

### Persistence

Only `user` and `isAuthenticated` are persisted. On rehydration:

- If `isAuthenticated` is true → `status` set to `"authenticated"`
- If false → `status` set to `"unauthenticated"` and diary cache cleared

### Usage

```typescript
// In components
const user = useAuthStore((s) => s.user)
const logout = useAuthStore((s) => s.logout)

// Outside React
useAuthStore.getState().setUser(user)
```

---

## Diary Store

**File:** `src/store/diary.store.ts`

Not persisted — cleared on logout, refresh, or unauthenticated rehydration.

Composed from three slices:

```
diary.store
├── daylist.slice    → paginated day metadata feed
├── entries.slice    → per-day entry cache
└── datelist.slice   → activity calendar data
```

---

## Day List Slice

**File:** `src/store/daylist.slice.ts`

Manages the scrollable feed of days shown in `DayList`.

### State shape

```typescript
dayList: {
  order: string[]              // dates in display order (newest first)
  items: Record<string, DayMetadata>  // keyed by YYYY-MM-DD
  pagination: {
    limit: number              // default 30
    hasMore: boolean
    loading: boolean
  }
}
```

### Actions

| Action | Behavior |
|--------|----------|
| `fetchNextDayListPage()` | Fetches next page via `api.days.list({ include_metadata: true })`. Uses `end_date` cursor (day before last loaded). Appends to `order` and `items`. |
| `upsertDayMetadata(metadata)` | Adds or updates a day in the list |
| `deleteDayMetadata(date)` | Removes a day from `order` and `items` |

### Pagination strategy

Cursor-based using dates:
1. First page: no `end_date` → returns newest N days
2. Next page: `end_date` = day before the last item in `order`

---

## Entries Slice

**File:** `src/store/entries.slice.ts`

Caches entries per date to avoid re-fetching when navigating between days.

### State shape

```typescript
dayWithEntries: {
  [date: string]: {
    entries: Entry[]
  }
}
```

### Actions

| Action | Behavior |
|--------|----------|
| `fetchEntriesForDay(date)` | Skips if already cached. Calls `api.days.getEntriesForDay(date)`. |
| `addEntry({ date, content })` | POST via `api.entries.create`, appends to cache, upserts day metadata in day list. |
| `updateEntry({ id, content })` | PATCH via `api.entries.update`, updates cache in place. |
| `deleteEntry(date, entryId)` | DELETE via `api.entries.delete`. If last entry for date, also removes day from list and activity. |

### Cache behavior

- Entries are fetched once per date per session
- `clearAll()` wipes the entire cache
- Nav "Refresh" button calls `clearAll()` to force re-fetch

---

## Activity Slice (Date List)

**File:** `src/store/datelist.slice.ts`

Powers the activity calendar — which dates have entries per month.

### State shape

```typescript
activeDays: {
  [yearMonth: string]: string[]   // e.g. "2026-06": ["2026-06-09", "2026-06-08"]
}
```

### Actions

| Action | Behavior |
|--------|----------|
| `fetchActiveDaysForMonth(yearMonth)` | Skips if cached. Calls `api.days.list({ start_date, end_date })` for the month range. |
| `addDayToActiveDays(date)` | Adds date to the month's array (no-op if month not yet loaded) |
| `removeDayFromActiveDays(date)` | Removes date from the month's array |

### Known limitation

`addDayToActiveDays` no-ops if that month hasn't been fetched yet. New entries may not appear on the calendar until the user visits that month in the activity view.

---

## Clear All

```typescript
clearAll: () => {
  set({
    dayList: initialDayList,
    dayWithEntries: {},
    activeDays: {},
  })
}
```

Triggered by:
- `authStore.logout()`
- AppNav "Refresh" button
- Auth store rehydration when unauthenticated

---

## Data Flow Examples

### Opening a day

```
User clicks DayListItem
  → navigate to /day/2026-06-09
  → Day component mounts
  → fetchEntriesForDay("2026-06-09")
    → cache hit? return
    → cache miss? api.days.getEntriesForDay → store in dayWithEntries
  → render RegularView or DiaryView with entries
```

### Creating an entry

```
User clicks NewEntryBtn
  → addEntry({ date, content: "" })
    → api.entries.create
    → append to dayWithEntries[date]
    → upsertDayMetadata in dayList
    → addDayToActiveDays(date)
  → Entry component renders with contentEditable
```

### Infinite scroll (day list)

```
DayList sentinel enters viewport
  → useInfiniteScroll callback
  → fetchNextDayListPage()
    → api.days.list({ include_metadata: true, end_date: cursor })
    → append to dayList.order and dayList.items
```

### Search (local state, not store)

`SearchEntries` manages its own component state for query, filters, results, and pagination. It calls `api.entries.list` directly rather than going through the diary store.
