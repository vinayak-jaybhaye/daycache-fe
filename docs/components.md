# Components

Component hierarchy, responsibilities, and usage patterns.

---

## Component Tree

```
App (RouterProvider)
├── MainLayout
│   ├── AppNav
│   └── Outlet
│       ├── Home
│       │   ├── DayList
│       │   │   └── DayListItem (atom)
│       │   └── Outlet → Day
│       ├── SearchEntries
│       │   ├── Entry (inline editing)
│       │   └── DayList (empty state)
│       ├── ActivityLayout
│       │   ├── ActivityHistory
│       │   │   └── ActivityCalendar (per month)
│       │   │       └── MonthCalendar (atom)
│       │   └── Outlet → Day
│       ├── Day
│       │   ├── RegularView → Entry, NewEntryBtn
│       │   └── DiaryView → DiaryViewEntry, NewEntryBtn
│       └── Settings
│           ├── Appearance (atom)
│           └── Account (atom)
└── PublicOnlyRoute
    ├── Login → GoogleBtn (atom)
    ├── Signup → GoogleBtn (atom)
    └── ForgotPassword

Route guards: ProtectedRoute, PublicOnlyRoute
```

---

## Layout Components

### `MainLayout`

Fixed navigation wrapper. Renders `AppNav` and an `<Outlet />` for page content. All authenticated routes pass through this layout.

### `ActivityLayout`

Split-pane layout for the activity view. Left panel shows `ActivityHistory`, right panel shows nested `Day` via `<Outlet />`. Same responsive behavior as `Home`.

### `ProtectedRoute`

Auth gate. Shows loading state during bootstrap, redirects to `/login` if unauthenticated.

### `PublicOnlyRoute`

Redirects authenticated users away from login/signup pages to `/`.

---

## Navigation

### `AppNav`

Primary navigation component.

- **Desktop:** fixed left sidebar with icon + label links
- **Mobile:** fixed bottom bar with icons only
- Links: Home, Today, Search, Activity, Settings
- **Refresh button:** calls `useDiaryStore.getState().clearAll()` to invalidate all cached data

---

## Day Browsing

### `DayList`

Infinite-scroll feed of days with metadata.

- Fetches pages via `fetchNextDayListPage()` on scroll
- Pins "today" at the top if not already in the list
- Renders `DayListItem` for each day
- Uses `useInfiniteScroll` hook for pagination trigger

### `DayListItem` (atom)

Single day row in the list.

- Shows formatted date, summary snippet, tags (max 3)
- Click navigates to `/day/:date`

### `Day`

Day detail container. Validates date param, fetches entries, manages view mode toggle.

- Renders `RegularView` or `DiaryView` based on `viewMode` state
- Toggle via `Repeat2` icon button

### `RegularView`

App-themed day view shell.

- Date header with back navigation
- Renders `Entry` components for each entry
- `NewEntryBtn` at the bottom

### `DiaryView`

Paper-aesthetic day view shell.

- Handwriting font, paper texture background
- Renders `DiaryViewEntry` components
- `NewEntryBtn` at the bottom

---

## Entry Editing

### `Entry`

ContentEditable journal entry for the regular view.

| Behavior | Detail |
|----------|--------|
| Auto-save | 2-second debounce via `useDebouncedCallback` |
| Blur save | Immediate save when focus leaves |
| Delete | Hover reveals delete button; no confirmation dialog |
| Paste | Plain text only (strips formatting) |
| Enter key | Inserts line break via `document.execCommand` |

### `DiaryViewEntry`

Same editing behavior as `Entry` but styled for the diary/paper aesthetic (handwriting font, no border).

### `NewEntryBtn` (atom)

Creates a new empty entry via `addEntry({ content: "", date })`.

---

## Search

### `SearchEntries`

Full-page search interface.

- Text input with 500ms debounce
- Date range filters (start/end)
- Paginated results with infinite scroll
- Double-tap/click to edit entries inline using `Entry` component
- Empty state renders `DayList` with "Explore Recent Activity" title

---

## Activity Calendar

### `ActivityHistory`

Loads month grids via infinite scroll.

- Starts with empty `months` array
- Fetches 6 months at a time via `fetchActiveDaysForMonth`
- Renders `ActivityCalendar` for each month

### `ActivityCalendar`

Wrapper for a single month's calendar grid. Passes active days and selected date to `MonthCalendar`.

### `MonthCalendar` (atom)

7-column calendar grid.

- Highlights days with entries (from `activeDays` store)
- Highlights selected day
- Click navigates to `/activity/day/:date`

---

## Settings

### `Appearance` (atom)

Three-button grid for theme selection: light, dark, sepia. Calls `setTheme()` from `services/theme.ts`.

### `Account` (atom)

Account management panel.

- Displays user email
- Change password form
- Delete account button (with confirmation)
- Embeds `LogoutBtn`

### `LogoutBtn` (atom)

Calls `api.auth.logout()`, then `authStore.logout()` (which also clears diary cache).

---

## Auth Components

### `GoogleBtn` (atom)

Google OAuth sign-in button using `@react-oauth/google`.

- On success: sends ID token to `api.auth.googleAuth`
- Then calls `checkLogin()` to refresh auth store

---

## Unused Components

These exist in the codebase but are not imported anywhere:

| Component | Original purpose |
|-----------|-----------------|
| `MenuBar.tsx` | Older FAB menu; superseded by `AppNav` |
| `DeleteDialog.tsx` | Modal confirmation for entry deletion; entries delete immediately without it |

---

## Barrel Exports

Components are re-exported for clean imports:

```typescript
// src/components/index.ts
export { default as Day } from "./Day"
export { default as DayList } from "./DayList"
// ...

// src/components/atoms/index.ts
export { default as GoogleBtn } from "./GoogleBtn"
export { default as DayListItem } from "./DayListItem"
// ...
```

Import pattern:

```typescript
import { Day, DayList, ProtectedRoute } from "@/components"
import { GoogleBtn, NewEntryBtn } from "@/components/atoms"
```
