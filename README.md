# CRM Strategy OS

Visual strategic-planning system for CRM/marketing teams — an infinite canvas
(à la Miro/Funnelytics/n8n) for mapping clusters, pipelines, campaigns,
messages and KPIs, with Kanban/Table/Timeline/Calendar/Dashboard views over
the same data.

## Structure

- `frontend/` — React + TypeScript + Vite + TailwindCSS + React Flow + Zustand
- `backend/` — NestJS + Prisma + PostgreSQL

## Frontend

```bash
cd frontend
npm install
npm run dev
```

Implemented so far: dark "Linear/Raycast" app shell, draggable object
library (30+ card types across Estratégia/Jornada/Comunicação/Dados/
Automação/Comércio/Notas), infinite canvas (pan/zoom/minimap/multi-select/
connect), and a properties panel for editing the selected card. Kanban,
Table, Timeline, Calendar and Dashboard views are stubbed in the top nav but
not yet implemented.

## Backend

```bash
cd backend
npm install
npx prisma generate
npx prisma migrate dev --name init   # requires a running PostgreSQL instance
npm run start:dev
```

The Prisma schema (`backend/prisma/schema.prisma`) models Workspace →
Project → Card/Connection/Comment, mirroring the frontend's card taxonomy.
REST endpoints exist under `/api` for workspaces, projects, cards and
connections (basic CRUD only — not yet wired up to the frontend).

> Note: `npx prisma generate`/`migrate` need to download engine binaries from
> Prisma's CDN, which isn't reachable from this sandboxed environment's
> network policy — run those commands on a machine with normal internet
> access.
