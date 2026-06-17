# J-Track

A frontend-only job tracking platform built with **Next.js 16** (App Router), **TypeScript**, and **Tailwind CSS v4**.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router) |
| Styling | Tailwind CSS v4 with `tw-animate-css` |
| UI Library | shadcn/ui (New York style) on Radix primitives |
| State Management | Zustand v5 (auth store) |
| Server State | TanStack React Query v5 |
| Forms | react-hook-form + zod validation |
| Auth | JWT via HTTP-only cookies (backend API) |
| Animations | framer-motion |
| Notifications | sonner (toasts) |
| Icons | lucide-react |
| Fonts | Inter (sans), Fraunces (serif headings) |

## Routes

| Route | Page | Auth |
|-------|------|------|
| `/` | Landing page (hero, features, CTA) | Public |
| `/login` | Email/password login | Public |
| `/register` | Registration (name, email, password, role, resume upload) | Public |
| `/forgot-password` | Enter email to request reset | Public |
| `/reset-password` | Redirects to `/reset-password/[token]` | Public |
| `/reset-password/[token]` | Set new password | Public |
| `/jobs` | Browse active jobs with search, filter, pagination | Public |
| `/jobs/[jobId]` | Job detail, apply, AI match analysis | Public (apply/match require auth) |
| `/dashboard` | User info cards, logout (wrapped in `AuthGuard`) | Protected |

## Auth Flow

1. **App mount** — `AuthInitializer` (inside `Providers`) calls `authApi.me()` to hydrate the Zustand store from the existing cookie session.
2. **Login** — `login/page.tsx` validates with zod, calls `authApi.login()`, stores user in Zustand store via `setUser()`, redirects to `/jobs`.
3. **Route protection** — The `(dashboard)` route group is wrapped in `AuthGuard`. If `!isLoading && !user`, it redirects to `/login`. Shows a spinner while loading.
4. **Logout** — Calls `authApi.logout()`, clears the store, redirects to `/`.
5. **Auth Shell** — `AuthShell` component wraps all auth pages with a consistent layout (logo, theme toggle, gradient background, animated entry).

Auth is entirely **cookie-based** — all API requests use `credentials: "include"`. No token is stored or sent manually in headers.

## Job Browsing & Applications

### Browse Jobs (`/jobs`)
- `BrowseJobs` (client) uses `useQuery` to fetch `jobApi.activeJobs()` with search `title`, `location` filter, and pagination.
- Renders a 2-column grid of `JobCard` components (presentational, no `"use client"`).
- States: loading spinner, error with retry, empty "No jobs found".

### Job Detail (`/jobs/[jobId]`)
- Fetches `jobApi.jobDetail(id)` and, if the user is a jobseeker, `jobApi.myApplications()` to check if already applied.
- `JobDetail` renders: header (company logo, title, salary, badges), apply button, AI match button, quick info grid, description, tech stack, responsibilities/skills, preferred skills, certifications, benefits, work details, career growth, interview process.
- **Apply**: `useMutation` calling `jobApi.apply(jobId)` — on success, toast + button shows "Applied ✓".

### AI Match Analysis
- `AnalyzeMatch` opens a dialog with the results of streaming SSE analysis.
- `jobApi.analyzeMatch(jobId)` sends a POST and reads the response as an **SSE stream** via `ReadableStream.getReader()`, parsing `data: {...}` lines.
- Stream events: `progress` (status text), `chunk` (ignored), `complete` (opens dialog with score, summary, recommendation, strengths, gaps), `error` (toast).

### My Applications
- `MyApplications` (client) fetches `jobApi.myApplications()` and renders a grid of `ApplicationCard` components with status badges (Submitted/amber, Rejected/red, Hired/green).

## Data Flow

```
User Action → Page/Component → react-hook-form / React Query → zod validation → authApi/jobApi (fetch with credentials: "include") → Zustand store / setState / toast → redirect or re-render
```

## Project Structure

```
app/                                 # Next.js App Router
├── (routes)/
│   ├── (dashboard)/                 # AuthGuard-wrapped
│   │   └── dashboard/page.tsx
│   ├── (landing)/                   # Public pages
│   │   ├── page.tsx                 # Landing
│   │   ├── layout.tsx
│   │   ├── login/page.tsx
│   │   ├── register/page.tsx
│   │   ├── forgot-password/page.tsx
│   │   ├── reset-password/page.tsx
│   │   └── reset-password/[token]/page.tsx
│   └── jobs/
│       ├── page.tsx                 # Browse jobs
│       └── [jobId]/page.tsx         # Job detail
├── layout.tsx                       # Root layout (fonts, Providers)
├── loading.tsx                      # Global loading spinner
├── error.tsx                        # Error boundary
└── globals.css                      # Tailwind theme (light/dark)

components/
├── jobs/
│   ├── analyze-match.tsx            # SSE streaming AI analysis dialog
│   ├── application-card.tsx         # Application display card
│   ├── browse-jobs.tsx              # Job search/filter/paginate
│   ├── job-card.tsx                 # Job listing card
│   ├── job-detail.tsx               # Full job detail view
│   └── my-applications.tsx          # User's applications list
├── providers/
│   └── index.tsx                    # QueryClient + AuthInitializer + Toaster
├── ui/                              # shadcn/ui primitives
├── auth-guard.tsx                   # Route protection wrapper
├── auth-initializer.tsx             # Hydrate auth from cookie on mount
├── auth-shell.tsx                   # Auth page layout wrapper
├── site-header.tsx                  # Global header (auth-aware)
└── theme-toggle.tsx                 # Manual light/dark toggle

lib/
├── auth-api.ts                      # Auth API client (login, register, me, logout, etc.)
├── job-api.ts                       # Job API client (activeJobs, detail, apply, analyzeMatch)
├── types.ts                         # TypeScript interfaces
├── utils.ts                         # Utility functions (cn)
└── validations.ts                   # Zod schemas (login, register, forgot/reset password)

stores/
└── auth-store.ts                    # Zustand auth store (user, token, isLoading, initialize, logout)

hooks/
└── use-mobile.tsx                   # Responsive mobile check (768px breakpoint)
```

## Environment

Copy `.env.example` to `.env.local`:

```
NEXT_PUBLIC_API_BASE=http://localhost/api
```

## Getting Started

```bash
npm install
npm run dev
```

Opens at [http://localhost:3000](http://localhost:3000). The app expects a backend API at `NEXT_PUBLIC_API_BASE`.
