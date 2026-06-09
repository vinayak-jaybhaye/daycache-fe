# Architecture

How the DayCache frontend is structured, bootstrapped, and how data flows through the application.

---

## High-Level Overview

DayCache is a **single-page application** built with React 19 and Vite. It communicates with a separate FastAPI backend via cookie-based authentication (no tokens in JavaScript).

```
┌─────────────────────────────────────────────────────────────┐
│ main.tsx                                                     │
│  1. bootstrapTheme()     → apply saved theme to <html>      │
│  2. bootstrapAuth()      → GET /users/me, hydrate auth store│
│  3. GoogleOAuthProvider  → wrap app for Google login        │
│  4. <App />              → RouterProvider                   │
└──────────────────────────────┬──────────────────────────────┘
                               │
         ┌─────────────────────┼─────────────────────┐
         ▼                     ▼                     ▼
   PublicOnlyRoute      MainLayout + AppNav     ProtectedRoute
   (login/signup)       (sidebar navigation)    (auth gate)
         │                     │                     │
         ▼                     ▼                     ▼
   Auth pages            Page components         Zustand stores
                              │                ├─ auth.store
                              ▼                └─ diary.store
                         apiClient.ts              (3 slices)
                         (fetch + cookies)
```

---

## Application Bootstrap

`src/main.tsx` runs an async IIFE before rendering:

1. **`bootstrapTheme()`** — reads `localStorage` key `"theme"`, applies class (`light` / `dark` / `sepia`) to `document.documentElement` to prevent flash of wrong theme
2. **`bootstrapAuth()`** — calls `GET /users/me` with cookies; on success sets user in auth store, on failure clears auth
3. **Render** — wraps `<App />` in `GoogleOAuthProvider` with `VITE_GOOGLE_CLIENT_ID`

This ensures theme and auth state are ready before the router renders.

---

## Layer Responsibilities

### Routing (`src/App.tsx`)

React Router v7 data router with nested layouts:

- **`MainLayout`** — fixed sidebar (`AppNav`) + content area (`Outlet`)
- **`ProtectedRoute`** — redirects unauthenticated users to `/login`
- **`PublicOnlyRoute`** — redirects authenticated users to `/`
- **Pages** — route-level shells that compose components

### State (`src/store/`)

Two Zustand stores:

| Store | Persisted | Purpose |
|-------|-----------|---------|
| `auth.store` | Yes (`localStorage` key `"auth"`) | User session, auth status |
| `diary.store` | No | Day list, entries cache, activity calendar |

The diary store is composed from three slices merged in `diary.store.ts`.

### API Layer (`src/services/apiClient.ts`)

Single module exporting an `api` object with namespaces: `auth`, `user`, `entries`, `days`.

- Uses native `fetch` with `credentials: "include"` for cookie auth
- Generic `request<T>()` wrapper handles JSON, query params, and error parsing
- No Axios, no interceptors — errors throw `Error` with backend `detail` message

### Services (`src/services/`)

| Module | Purpose |
|--------|---------|
| `bootstrapAuth.ts` | Session check on app start |
| `bootstrapTheme.ts` | Theme application before render |
| `checkLogin.ts` | Post-login session refresh |
| `theme.ts` | Theme get/set helpers |

### Components (`src/components/`)

Organized by responsibility:

- **Layouts** — `MainLayout`, `ActivityLayout`, route guards
- **Views** — `DayList`, `RegularView`, `DiaryView`, `SearchEntries`, `ActivityHistory`
- **Entry editors** — `Entry`, `DiaryViewEntry` (contentEditable with auto-save)
- **Atoms** — small reusable pieces in `components/atoms/`

### Types (`src/types/`)

| File | Contents |
|------|----------|
| `user.ts` | `User` interface |
| `diary.types.ts` | `Entry`, `DayMetadata`, store shape types |

### Utils (`src/utils/`)

| File | Purpose |
|------|---------|
| `actions.utils.ts` | `useDebouncedCallback`, `useInfiniteScroll` |
| `calendar.utils.ts` | Date formatting, month grid helpers, validation |

---

## Data Flow Patterns

### Reading data

```
Component mount
  → store action (e.g. fetchEntriesForDay)
    → api.entries / api.days
      → backend
    → update normalized cache in store
  → component re-renders from store
```

### Writing data

```
User edits entry (contentEditable)
  → debounced updateEntry (2s delay)
    → api.entries.update
    → optimistic local cache update
  → on blur: immediate save
```

### Cache invalidation

- **Logout** — `authStore.logout()` calls `diaryStore.clearAll()`
- **Refresh button** (AppNav) — `diaryStore.clearAll()` forces re-fetch
- **Delete last entry** — removes day from day list and activity calendar

---

## Authentication Model

The frontend does **not** store JWTs. Authentication is entirely cookie-based:

1. Login/signup/Google auth POST to backend
2. Backend sets `access_token` HTTP-only cookie
3. All subsequent requests include cookie via `credentials: "include"`
4. `bootstrapAuth` and `checkLogin` verify session via `GET /users/me`

Auth store persists `user` and `isAuthenticated` to `localStorage` for fast initial render, but `bootstrapAuth` corrects stale state on every app load.

---

## Responsive Design

The app uses a **master-detail split pane** pattern:

| Viewport | Behavior |
|----------|----------|
| Mobile (`< lg`) | Full-width list OR full-width detail (toggled by route match) |
| Desktop (`lg+`) | 1/3 list panel + 2/3 detail panel side by side |

Implemented in `Home.tsx` and `ActivityLayout.tsx` using `useMatch` on route patterns and Tailwind `basis` transitions.

---

## Theming

CSS custom properties in `index.css` define design tokens. Three themes (`light`, `dark`, `sepia`) are applied as classes on `<html>`.

The **Diary view** uses inline styles for a paper aesthetic independent of theme variables, with a handwriting font (`Caveat`).

See [Development Guide](development.md#theming) for details.

---

## Key Conventions

1. **Path alias** — `@/` maps to `src/` (configured in `vite.config.ts` and `tsconfig`)
2. **Barrel exports** — `pages/index.ts`, `components/index.ts`, `components/atoms/index.ts`
3. **Store access outside React** — `useDiaryStore.getState()` in nav handlers and effects
4. **Normalized caches** — days keyed by `YYYY-MM-DD` date string
5. **Infinite scroll** — `useInfiniteScroll` IntersectionObserver hook for day list and search
6. **Strict TypeScript** — `strict: true`, `noUnusedLocals`, `verbatimModuleSyntax`
