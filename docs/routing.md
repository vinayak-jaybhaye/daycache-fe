# Routing & Pages

All routes are defined in `src/App.tsx` using React Router v7's `createBrowserRouter`.

---

## Route Tree

```
/                           MainLayout → ProtectedRoute → Home
  └── day/:date             (nested) → Day

/open/:date                 MainLayout → ProtectedRoute → Day (full-screen)

/search                     MainLayout → ProtectedRoute → SearchEntries

/activity                   MainLayout → ProtectedRoute → ActivityLayout
  └── day/:date             (nested) → Day

/settings                   MainLayout → ProtectedRoute → Settings

/login                      PublicOnlyRoute → Login
/signup                     PublicOnlyRoute → Signup
/forgot-password            PublicOnlyRoute → ForgotPassword

*                           → Navigate to /
```

---

## Layout Components

### `MainLayout`

Wraps all authenticated pages. Renders:

- **`AppNav`** — fixed sidebar (desktop) or bottom bar (mobile)
- **`<Outlet />`** — child route content

### `ProtectedRoute`

Auth gate for authenticated routes.

| `auth.status` | Behavior |
|---------------|----------|
| `"idle"` | Shows "Checking session…" loading state |
| `"unauthenticated"` | Redirects to `/login` |
| `"authenticated"` | Renders `<Outlet />` |

### `PublicOnlyRoute`

Prevents authenticated users from seeing login/signup pages.

| `auth.isAuthenticated` | Behavior |
|----------------------|----------|
| `true` | Redirects to `/` |
| `false` | Renders `<Outlet />` |

> Does not handle `status === "idle"` — a brief flash of the login form is possible during bootstrap.

---

## Pages

### `Home` (`/`)

Master-detail layout for browsing days.

- **Left panel:** `DayList` — infinite-scroll feed of days with metadata
- **Right panel:** `<Outlet />` renders `Day` when `/day/:date` is matched
- **Mobile:** shows list OR detail based on route match
- **Desktop:** always shows both panels side by side

### `Day` (`/day/:date`, `/open/:date`, `/activity/day/:date`)

Day detail view. Validates the `date` URL param, fetches entries, and renders either:

- **`RegularView`** — app-themed entry editor (default)
- **`DiaryView`** — paper-aesthetic entry editor

Toggle between views via the `Repeat2` icon. Defaults to `"regular"`.

Used in three contexts:
- Nested in `Home` (split pane)
- Top-level at `/open/:date` (full screen, no sidebar list)
- Nested in `ActivityLayout` (activity split pane)

### `SearchEntries` (`/search`)

Keyword search with date range filters.

- Debounced text input (500ms)
- Paginated results (`limit: 10`) with infinite scroll
- Double-tap/click to edit entries inline
- Empty state shows `DayList` titled "Explore Recent Activity"

### `ActivityLayout` (`/activity`)

Calendar-based activity view.

- **Left panel:** `ActivityHistory` — month grids showing days with entries
- **Right panel:** `<Outlet />` renders `Day` when `/activity/day/:date` is matched
- Same responsive split-pane behavior as `Home`

### `Settings` (`/settings`)

Two sections:

- **`Appearance`** — theme picker (light / dark / sepia)
- **`Account`** — profile display, change password, delete account, logout

### `Login` (`/login`)

Email/password form + Google OAuth button.

- On success: `checkLogin()` → auth store update → `PublicOnlyRoute` redirects to `/`
- Ships with pre-filled dev credentials (`dev1@example.com` / `devpassword`)

### `Signup` (`/signup`)

Registration form with OTP step.

- OTP sending is **disabled** in UI (early return with message)
- Form still calls `api.auth.signup` if submitted

### `ForgotPassword` (`/forgot-password`)

Password reset form with OTP step.

- OTP sending is **disabled** in UI (same pattern as signup)

---

## Navigation

### `AppNav`

Primary navigation, rendered in `MainLayout`:

| Item | Route | Icon |
|------|-------|------|
| Home | `/` | Home |
| Today | `/day/{today}` | Calendar |
| Search | `/search` | Search |
| Activity | `/activity` | Activity |
| Settings | `/settings` | Settings |
| Refresh | — (clears diary cache) | RefreshCw |

Desktop: fixed left sidebar. Mobile: fixed bottom bar.

### In-component navigation

- `DayListItem` → navigates to `/day/:date`
- `MonthCalendar` day cells → navigates to `/activity/day/:date`
- `RegularView` / `DiaryView` back button → navigates to parent list
- Search result click → navigates to `/open/:date`

---

## Route Parameters

| Param | Format | Validation |
|-------|--------|------------|
| `:date` | `YYYY-MM-DD` | Validated by `isDateValid()` in `calendar.utils.ts` |

Invalid dates show an error state in the `Day` component.

---

## Catch-all

Any unmatched route redirects to `/` via `<Navigate to="/" replace />`.
