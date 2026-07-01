# CRM Strategy OS

Visual strategic-planning system for CRM/marketing teams — an infinite canvas
(à la Miro/Funnelytics/n8n) for mapping clusters, pipelines, campaigns,
messages and KPIs, with Kanban/Table/Timeline/Calendar/Dashboard views over
the same data.

## Structure

Two independent apps, deployed as a single Vercel project via Vercel's
multi-service support (see `vercel.json`):

- `frontend/` — React + TypeScript + Vite + TailwindCSS + React Flow + Zustand
- `backend/` — NestJS + Prisma + PostgreSQL, serving everything under `/api`

## Local development

Requires a running PostgreSQL instance and `DATABASE_URL` set in `backend/.env`
(copy `backend/.env.example`).

```bash
cd backend && npm install && npx prisma migrate dev --name init && npm run start:dev   # NestJS on :3000
cd frontend && npm install && npm run dev                                              # Vite on :5173, proxies /api -> :3000
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

Vercel auto-detects this as a monorepo with two deployable apps (Vite +
NestJS) and needs `vercel.json` to describe them as one project:

```json
{
  "services": {
    "frontend": { "root": "frontend", "framework": "vite" },
    "backend": { "root": "backend" }
  },
  "rewrites": [
    { "source": "/api(/.*)?", "destination": { "type": "service", "service": "backend" } },
    { "source": "/(.*)", "destination": { "type": "service", "service": "frontend" } }
  ]
}
```

(already committed at the repo root). Each service installs/builds
independently from its own directory — no root-level `package.json` needed.

Steps:

1. Import the repo in Vercel; it should pick up `vercel.json` and show the
   `frontend` and `backend` services automatically.
2. Set `DATABASE_URL` as an environment variable on the **backend** service,
   pointing at your Postgres instance (Supabase/Neon/Vercel Postgres — any
   standard `postgres://` connection string works, since the app connects via
   `@prisma/adapter-pg` rather than Prisma's old binary engine). Use the
   pooled/"Session pooler" connection string if your provider offers one.
3. Before (or right after) the first deploy, apply migrations against that
   same database from your local machine:
   ```bash
   cd backend
   DATABASE_URL="<your production connection string>" npx prisma migrate deploy
   ```
4. Deploy. `backend/src/main.ts` already reads `process.env.PORT`, which is
   how Vercel's Node "Web Service" runtime expects the app to listen.
