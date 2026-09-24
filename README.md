# SHELF — Library Management UI

Next.js App Router frontend for the Library Management System.

## Stack

- Next.js + TypeScript
- Tailwind CSS
- Framer Motion
- Lucide React
- next-themes
- Vercel deployment

## Environment

Create .env.local from .env.example:

```env
NEXT_PUBLIC_API_URL=https://library-management-system-swaroop-workspace.vercel.app
NEXT_PUBLIC_ENABLE_ADMIN=false
```

NEXT_PUBLIC_API_URL is the only frontend API address. Keep requests centralized in lib/api.ts.

Keep NEXT_PUBLIC_ENABLE_ADMIN=false until the backend has real authentication and authorization.

## Run locally

```bash
npm install
npm run dev
```

Quality checks:

```bash
npm run typecheck
npm run build
```

## Routes

- / landing page
- /books live catalog with search, availability filter, grid/list views, pagination, loading, empty and error states
- /books/:id book details with loading and API 404 handling
- /admin disabled by default; CRUD UI is available only when explicitly enabled
- /privacy
- /terms

## API contract

The frontend consumes:
- GET /health
- GET /api/books
- POST /api/books
- GET /api/books/:id
- PATCH /api/books/:id
- DELETE /api/books/:id
- PATCH /api/books/:id/availability

## Vercel

Create a new Vercel project from this repository. Set NEXT_PUBLIC_API_URL to the deployed backend URL and NEXT_PUBLIC_ENABLE_ADMIN=false.

The backend must allow the deployed frontend origin through its CORS_ORIGIN setting.

## UI notes

The design uses original SHELF branding, responsive navigation, dark/light mode, accessible controls, subtle motion, reduced-motion support, and reusable UI primitives.
