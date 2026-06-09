# DayCache Frontend

React SPA for [DayCache](https://daycache-fe.vercel.app) — a personal diary application. Write daily entries, browse your journal by date, search past writing, and track activity on a calendar.

**Live:** [daycache-fe.vercel.app](https://daycache-fe.vercel.app)

**Related repository:** [daycache-backend](https://github.com/vinayak-jaybhaye/daycache-backend) (FastAPI backend)

---

## Features

| Feature | Status |
|---------|--------|
| Email/password login | Working |
| Google OAuth login | Working |
| Sign up | Form exists; OTP flow disabled |
| Forgot password | Form exists; OTP flow disabled |
| Write, edit, delete journal entries | Working (auto-save) |
| Browse days (infinite scroll) | Working |
| Two view modes (Regular / Diary) | Working |
| Search entries by keyword and date | Working |
| Activity calendar (month grids) | Working |
| Theme selection (light / dark / sepia) | Working |
| Change password, delete account | Working |
| AI day summaries | API client ready; no UI |
| Chat with diary | Not implemented |
| Image/file uploads | Not implemented |

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | React 19 |
| Build | Vite 6 |
| Language | TypeScript 5.8 (strict) |
| Routing | React Router DOM 7 |
| State | Zustand 5 |
| Styling | Tailwind CSS 4 |
| Icons | lucide-react |
| Google Auth | @react-oauth/google |
| HTTP | Native `fetch` (cookie-based) |
| Deploy | Vercel |

---

## Quick Start

### Prerequisites

- Node.js 18+
- Running DayCache backend (see backend README)

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

```bash
cp .env.sample .env
```

```env
VITE_API_URL=http://localhost:8000
VITE_GOOGLE_CLIENT_ID=your-google-client-id
```

### 3. Start development server

```bash
npm run dev
```

Opens at [http://localhost:5173](http://localhost:5173).

> Ensure the backend is running and `CORS_ORIGINS` includes `http://localhost:5173`.

### 4. Build for production

```bash
npm run build    # Output: dist/
npm run preview  # Preview production build locally
npm run lint     # ESLint
```

---

## Project Structure

```
daycache-fe/
├── public/                     # Static assets
├── src/
│   ├── main.tsx                # Bootstrap (theme, auth, render)
│   ├── App.tsx                 # Router definition
│   ├── index.css               # Tailwind + CSS theme variables
│   ├── components/             # UI components
│   │   └── atoms/              # Small reusable pieces
│   ├── pages/                  # Route-level page shells
│   ├── store/                  # Zustand stores and slices
│   ├── services/               # API client, auth/theme bootstrap
│   ├── types/                  # TypeScript interfaces
│   └── utils/                  # Calendar helpers, debounce, scroll
├── index.html
├── vite.config.ts
├── vercel.json                 # SPA rewrites for Vercel
└── docs/                       # Detailed documentation
```

---

## Documentation

| Document | Description |
|----------|-------------|
| [Architecture](docs/architecture.md) | App bootstrap, layers, data flow |
| [Routing & Pages](docs/routing.md) | All routes, layouts, navigation |
| [State Management](docs/state-management.md) | Zustand stores and slices |
| [Components](docs/components.md) | Component hierarchy and responsibilities |
| [API Integration](docs/api-integration.md) | How the frontend talks to the backend |
| [Development Guide](docs/development.md) | Theming, conventions, known gaps |

---

## Routes Overview

| Route | Page | Auth |
|-------|------|------|
| `/` | Home (day list + detail split pane) | Protected |
| `/day/:date` | Day detail (nested in Home) | Protected |
| `/open/:date` | Full-screen day view | Protected |
| `/search` | Entry search | Protected |
| `/activity` | Calendar activity view | Protected |
| `/activity/day/:date` | Day detail in activity view | Protected |
| `/settings` | Appearance and account | Protected |
| `/login` | Login | Public |
| `/signup` | Sign up | Public |
| `/forgot-password` | Password reset | Public |

---

## Deployment

Hosted on Vercel. Set environment variables in the Vercel dashboard:

- `VITE_API_URL` — production backend URL
- `VITE_GOOGLE_CLIENT_ID` — Google OAuth client ID

`vercel.json` rewrites all paths to `/` for client-side routing.
