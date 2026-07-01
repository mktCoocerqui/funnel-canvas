# CRM Strategy OS

Visual strategic-planning system for CRM/marketing teams — an infinite canvas
(à la Miro/Funnelytics/n8n) for mapping clusters, pipelines, campaigns,
messages and KPIs, with Kanban/Table/Timeline/Calendar/Dashboard views over
the same data.

## Structure

This is an npm-workspaces monorepo so the frontend and the API can deploy as
a single Vercel project:

- `frontend/` — React + TypeScript + Vite + TailwindCSS + React Flow + Zustand
- `backend/` — NestJS + Prisma + PostgreSQL (source of truth for the domain/DB code)
- `api/` — a single Vercel serverless function (`[...path].ts`) that boots the
  NestJS app (wrapped in Express) and handles every `/api/*` request in production

## Local development

Requires a running PostgreSQL instance and `DATABASE_URL` set in `backend/.env`
(copy `backend/.env.example`).

```bash
npm install                 # installs both workspaces from the repo root
npm run build --workspace=backend   # prisma generate + nest build (or just `prisma generate`)
cd backend && npx prisma migrate dev --name init
npm run start:dev --workspace=backend   # NestJS on :3000
npm run dev --workspace=frontend        # Vite on :5173, proxies /api -> :3000
```

Open http://localhost:5173. On first load the app bootstraps a "Coocerqui" /
"CRM 2026" workspace+project in Postgres and seeds a few demo cards. If the
backend is unreachable, the UI falls back to an offline in-memory demo state.

Implemented so far: dark "Linear/Raycast" app shell, draggable object library
(30+ card types across Estratégia/Jornada/Comunicação/Dados/Automação/
Comércio/Notas), infinite canvas (pan/zoom/minimap/multi-select/connect) and
Kanban board — both backed by the same REST API (workspaces/projects/cards/
connections), plus a properties panel for editing the selected card. Table,
Timeline, Calendar and Dashboard views are stubbed in the top nav but not yet
implemented.

## Prisma / database

The schema (`backend/prisma/schema.prisma`) models Workspace → Project →
Card/Connection/Comment. It uses Prisma 7's driver-adapter client (no native
query-engine binary): `@prisma/adapter-pg` connects over plain `pg`, and the
generated client (`backend/src/generated/prisma`, gitignored, produced by
`prisma generate`) is CommonJS so it works with NestJS's default build.
`npm install` triggers `prisma generate` via `postinstall`.

## Deploying to Vercel

The repo is set up as a single Vercel project covering both halves:

- **Root Directory**: repo root (leave default) — this is required so Vercel
  sees both `frontend/` (via `vercel.json`'s `buildCommand`/`outputDirectory`)
  and the top-level `api/` folder (auto-detected as a serverless function).
- `vercel.json` sets `buildCommand: npm run build` (builds the frontend into
  `frontend/dist`) and `outputDirectory: frontend/dist`.
- `api/[...path].ts` is a catch-all Vercel Node function that lazily boots the
  NestJS app once per cold start (cached across warm invocations) and handles
  every request under `/api/*`.
- Set a `DATABASE_URL` environment variable in the Vercel project pointing at
  your Postgres instance (Neon/Supabase/Vercel Postgres all work — anything
  reachable over the standard `postgres://` protocol, since the app connects
  via `@prisma/adapter-pg` rather than Prisma's old binary engine).
- Run `npx prisma migrate deploy` (from `backend/`, pointed at the production
  `DATABASE_URL`) to apply migrations before/after your first deploy.

No extra rewrites are needed: `api/[...path].ts`'s filename is Vercel's
catch-all convention, so every `/api/...` request (including the bare `/api`
health check) already routes to it.
