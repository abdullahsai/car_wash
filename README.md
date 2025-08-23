# Car Wash App

Full-stack demo application for managing a car wash workflow.

## Features

- Check-in cars, track stages, record payments.
- Real-time dashboard and Kanban board via Socket.IO.
- Authentication with roles (admin / staff / viewer).
- Daily reports with CSV export.
- Bilingual UI placeholder (English/Arabic), dark mode (via Tailwind). [Simplified]

## Tech Stack

- Backend: Node.js, Express, TypeScript, Prisma, Socket.IO.
- Frontend: React (Vite, TypeScript, TailwindCSS).
- Database: PostgreSQL (SQLite fallback).
- Packaging: Docker, docker-compose.

## Development

```bash
# requirements: Node 20, npm
cd backend
npm install
npx prisma migrate dev --name init
npx prisma db seed
npm run dev
# in another terminal
cd ../frontend
npm install
npm run dev
```

## Docker Compose

```bash
docker compose up --build
```
Visit http://localhost:3000. Seed accounts:
- admin / admin123
- staff / staff123

## Deploy on CapRover

1. Create two apps (backend, frontend) and a PostgreSQL one-click app.
2. For backend set env vars: `DATABASE_URL`, `JWT_SECRET`.
3. Deploy images built from Dockerfiles.
4. Attach persistent volume to Postgres.

