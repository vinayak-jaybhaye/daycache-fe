# API Integration

How the frontend communicates with the DayCache FastAPI backend.

---

## API Client

**File:** `src/services/apiClient.ts`

Single module exporting an `api` object. All HTTP calls go through a generic `request<T>()` wrapper.

### Configuration

```typescript
const API_URL = import.meta.env.VITE_API_URL ?? "";
```

Set via `.env`:

```env
VITE_API_URL=http://localhost:8000
```

### Request wrapper

```typescript
async function request<T>(endpoint: string, options?: {
  method?: "GET" | "POST" | "PATCH" | "DELETE"
  body?: unknown
  params?: Record<string, string | number | boolean | undefined>
  signal?: AbortSignal
}): Promise<T>
```

Key behaviors:

- **`credentials: "include"`** — sends HTTP-only auth cookie with every request
- **JSON body** — sets `Content-Type: application/json` when body is present
- **Query params** — appended via `URLSearchParams`
- **Error handling** — parses `detail` or `message` from error response JSON, throws `Error`
- **Null responses** — returns `null` if response body is empty

---

## API Namespaces

### `api.auth`

| Method | HTTP | Endpoint | Used by |
|--------|------|----------|---------|
| `signup(data)` | POST | `/auth/signup` | Signup page |
| `login(data)` | POST | `/auth/login` | Login page |
| `googleAuth(token)` | POST | `/auth/google-auth` | GoogleBtn |
| `logout()` | POST | `/auth/logout` | LogoutBtn |
| `getOtp(data)` | POST | `/auth/get-otp` | Signup, ForgotPassword *(disabled in UI)* |
| `resetPassword(data)` | POST | `/auth/reset-password` | ForgotPassword |

### `api.user`

| Method | HTTP | Endpoint | Used by |
|--------|------|----------|---------|
| `getMe()` | GET | `/users/me` | bootstrapAuth, checkLogin |
| `deleteMe()` | DELETE | `/users/me` | Account |
| `changePassword(data)` | POST | `/users/me/change-password` | Account |

### `api.entries`

| Method | HTTP | Endpoint | Used by |
|--------|------|----------|---------|
| `create(data)` | POST | `/entries/` | entries slice (addEntry) |
| `list(params?)` | GET | `/entries` | SearchEntries |
| `get(entryId)` | GET | `/entries/:id` | **Not used** |
| `update(entryId, content)` | PATCH | `/entries/:id` | entries slice (updateEntry) |
| `delete(entryId)` | DELETE | `/entries/:id` | entries slice (deleteEntry) |

### `api.days`

| Method | HTTP | Endpoint | Used by |
|--------|------|----------|---------|
| `list(params?)` | GET | `/days/` | daylist slice, datelist slice |
| `getEntriesForDay(date)` | GET | `/days/:date` | entries slice (fetchEntriesForDay) |
| `delete(date)` | DELETE | `/days/:date` | **Not used** |
| `getMetadata(date)` | GET | `/days/:date/metadata` | **Not used** |
| `clearMetadata(date)` | DELETE | `/days/:date/metadata` | **Not used** |
| `generateSummary(date)` | GET | `/days/:date/generate-summary` | **Not used** |

---

## Authentication Flow

### App startup

```
bootstrapAuth()
  → GET /users/me (cookie sent automatically)
  → success: authStore.setUser(user)
  → failure: authStore.logout()
```

### Login

```
User submits login form
  → POST /auth/login { email, password }
  → backend sets access_token cookie
  → checkLogin()
    → GET /users/me
    → authStore.setUser(user)
  → PublicOnlyRoute detects authenticated → redirect to /
```

### Google login

```
User clicks GoogleBtn
  → Google OAuth popup → ID token
  → POST /auth/google-auth { google_token }
  → backend sets cookie
  → checkLogin() → setUser()
```

### Logout

```
User clicks LogoutBtn
  → POST /auth/logout (clears cookie)
  → authStore.logout() (clears user + diary cache)
```

---

## Data Types

### `User` (`src/types/user.ts`)

```typescript
interface User {
  id: number
  email: string
  created_at?: string
  updated_at?: string
}
```

### `Entry` (`src/types/diary.types.ts`)

```typescript
interface Entry {
  id: number
  content: string
  entry_date: string
  created_at: string
  updated_at?: string
}
```

### `DayMetadata` (`src/types/diary.types.ts`)

```typescript
interface DayMetadata {
  date: string
  summary?: string
  tags?: string[]
}
```

---

## CORS and Cookies

The frontend and backend run on different origins in development and production:

| Environment | Frontend | Backend |
|-------------|----------|---------|
| Local | `http://localhost:5173` | `http://localhost:8000` |
| Production | `daycache-fe.vercel.app` | Separate API domain |

Requirements for cookie auth to work:

1. Backend `CORS_ORIGINS` must include the frontend origin
2. Backend must set `allow_credentials=True` (configured in `main.py`)
3. Cookie must use `samesite=none` + `secure=True` for cross-origin (production)
4. Frontend must use `credentials: "include"` on all requests (configured in `apiClient.ts`)

---

## Error Handling

API errors throw JavaScript `Error` with the backend's `detail` message:

```typescript
try {
  await api.auth.login({ email, password })
} catch (err) {
  // err.message contains backend error detail
}
```

Currently, most components only `console.error` on failure — no user-visible error toasts or inline messages (except auth pages showing basic error text).

---

## Unused API Methods

These are defined in `apiClient.ts` but not called by any component:

| Method | Potential use |
|--------|---------------|
| `entries.get(id)` | Single entry detail view |
| `days.delete(date)` | Delete entire day |
| `days.getMetadata(date)` | Display summary/tags in day view |
| `days.clearMetadata(date)` | Clear AI summary |
| `days.generateSummary(date)` | Trigger AI summary generation |

These correspond to backend features that are planned but not yet wired into the UI.
