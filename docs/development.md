# Development Guide

Conventions, theming, build configuration, and known gaps for contributing to the DayCache frontend.

---

## Development Workflow

```bash
# Install
npm install

# Configure
cp .env.sample .env
# Set VITE_API_URL and VITE_GOOGLE_CLIENT_ID

# Start dev server (with HMR)
npm run dev

# Lint
npm run lint

# Build
npm run build

# Preview production build
npm run preview
```

Dev server runs at `http://localhost:5173` by default.

---

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `VITE_API_URL` | Yes | Backend API base URL (e.g. `http://localhost:8000`) |
| `VITE_GOOGLE_CLIENT_ID` | For Google login | Google OAuth 2.0 client ID |

Vite exposes only variables prefixed with `VITE_` to client code via `import.meta.env`.

---

## Theming

### How it works

1. CSS custom properties in `src/index.css` define design tokens
2. Three theme classes (`light`, `dark`, `sepia`) set different values for those tokens
3. Tailwind maps tokens via `@theme` directive (e.g. `bg-app`, `text-primary`)
4. Theme class is applied to `<html>` element

### Theme persistence

```typescript
// services/theme.ts
localStorage.setItem("theme", theme)   // "light" | "dark" | "sepia"
```

### Bootstrap

`bootstrapTheme()` runs before React render to prevent flash of wrong theme.

### Diary view

`DiaryView` and `DiaryViewEntry` use inline styles for a paper aesthetic independent of theme CSS variables. References `'Caveat', cursive` handwriting font (not loaded in `index.html` — may fall back to system cursive).

### Design tokens

| Token | Usage |
|-------|-------|
| `bg-app` | Main background |
| `bg-subtle` | Secondary background |
| `text-primary` | Primary text |
| `text-secondary` | Secondary text |
| `accent` | Interactive elements |
| `border` | Borders and dividers |

Fonts: `Merriweather` (body), `Inter` (UI/headings).

---

## Path Alias

`@/` maps to `src/` — configured in both `vite.config.ts` and `tsconfig.app.json`.

```typescript
import { Day } from "@/components"
import { useDiaryStore } from "@/store/diary.store"
import type { Entry } from "@/types/diary.types"
```

---

## Key Patterns

### Zustand slice composition

New diary features should add a slice file and merge it in `diary.store.ts`:

```typescript
// store/new-feature.slice.ts
export const createNewFeatureSlice = (set, get) => ({
  // state and actions
})

// store/diary.store.ts
export const useDiaryStore = create<DiaryStore>()((set, get) => ({
  ...createDayListSlice(set, get),
  ...createEntriesSlice(set, get),
  ...createActivitySlice(set, get),
  ...createNewFeatureSlice(set, get),
}))
```

### Infinite scroll

Use the `useInfiniteScroll` hook from `utils/actions.utils.ts`:

```typescript
const sentinelRef = useInfiniteScroll({
  onLoadMore: fetchNextPage,
  hasMore: pagination.hasMore,
  loading: pagination.loading,
})
```

Attach `sentinelRef` to a sentinel element at the bottom of a scrollable list.

### Debounced saves

Entry auto-save uses `useDebouncedCallback` (2s delay) plus immediate save on blur:

```typescript
const debouncedSave = useDebouncedCallback((content: string) => {
  updateEntry({ id: entry.id, content })
}, 2000)
```

### Store access outside React

```typescript
useDiaryStore.getState().clearAll()
useAuthStore.getState().logout()
```

Used in `AppNav` refresh handler and auth bootstrap.

### ContentEditable entries

Entries use `contentEditable` divs (not textarea/input):

- Plain text paste only
- Enter inserts `<br>` via `document.execCommand('insertLineBreak')`
- Content read via `innerText`

---

## Build and Deploy

### Vite build

```bash
npm run build   # tsc -b && vite build → dist/
```

TypeScript compilation runs before Vite bundling. Output goes to `dist/`.

### Vercel deployment

`vercel.json`:

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/" }]
}
```

All routes rewrite to `/` for SPA client-side routing.

Set `VITE_API_URL` and `VITE_GOOGLE_CLIENT_ID` in the Vercel dashboard environment variables.

---

## File Reference

| Path | Purpose |
|------|---------|
| `src/main.tsx` | App bootstrap |
| `src/App.tsx` | Router definition |
| `src/index.css` | Tailwind + theme CSS variables |
| `src/services/apiClient.ts` | API client (all backend calls) |
| `src/services/bootstrapAuth.ts` | Session check on startup |
| `src/services/bootstrapTheme.ts` | Theme before render |
| `src/services/checkLogin.ts` | Post-login session refresh |
| `src/services/theme.ts` | Theme get/set |
| `src/store/auth.store.ts` | Auth state (persisted) |
| `src/store/diary.store.ts` | Diary state (composed) |
| `src/store/daylist.slice.ts` | Day list pagination |
| `src/store/entries.slice.ts` | Per-day entry cache |
| `src/store/datelist.slice.ts` | Activity calendar data |
| `src/types/user.ts` | User interface |
| `src/types/diary.types.ts` | Entry, DayMetadata types |
| `src/utils/actions.utils.ts` | Debounce, infinite scroll hooks |
| `src/utils/calendar.utils.ts` | Date helpers |
| `vite.config.ts` | Vite + React + Tailwind plugins |
| `vercel.json` | SPA rewrites |

---

## Known Gaps

### Feature gaps

| Feature | Status |
|---------|--------|
| AI day summaries | API method exists; no UI to trigger or display |
| Chat with diary | No code |
| Smart autocomplete | No code |
| Image/file uploads | No code |
| Entry delete confirmation | `DeleteDialog` exists but unused |
| Day metadata/tags display | Tags shown in list but not populated from API |

### Disabled flows

| Flow | Detail |
|------|--------|
| OTP signup | `handleSendOtp` returns early with disabled message |
| OTP password reset | Same pattern in `ForgotPassword` |

### Code quality

| Issue | Detail |
|-------|--------|
| Login pre-filled dev credentials | `dev1@example.com` / `devpassword` in Login.tsx |
| No user-visible error messages | Most failures only `console.error` |
| Dead components | `MenuBar.tsx`, `DeleteDialog.tsx` not imported |
| Empty route `/day` | No element, appears unused |
| Missing assets | `login_bg.png`, `notebook.png` referenced but not in `public/` |
| Unused dependencies | `react-redux`, `jwt-decode` in package.json |
| Activity calendar lag | `addDayToActiveDays` no-ops if month not cached |
| ActivityHistory empty start | Relies on scroll sentinel to trigger first load |
| Undefined Tailwind classes | Some classes like `bg-bg-surface`, `accent-secondary` not in `@theme` |
| Caveat font | Referenced in diary view but not loaded |
| No tests | No `*.test.*` or `*.spec.*` files |

### Security note

Auth store persists `isAuthenticated` to `localStorage`. This can briefly show authenticated UI before `bootstrapAuth` corrects stale state. The actual session is validated server-side on every API call via the HTTP-only cookie.

---

## Adding a New Page

1. Create component in `src/pages/NewPage.tsx`
2. Export from `src/pages/index.ts`
3. Add route in `src/App.tsx` inside the appropriate layout/guard
4. Add navigation link in `AppNav` if needed

## Adding a New API Call

1. Add method to the appropriate namespace in `src/services/apiClient.ts`
2. Call from a store action or component
3. Add/update types in `src/types/` if needed

## Adding a New Store Slice

1. Create `src/store/new-feature.slice.ts`
2. Define state shape and actions
3. Merge in `src/store/diary.store.ts` (or create a new store)
4. Add types to `DiaryStore` interface
