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

## Environment Variables

The backend expects the following environment variables:

- `DATABASE_URL` – connection string for the PostgreSQL database.
- `JWT_SECRET` – secret used for signing JSON Web Tokens.
- `PORT` – optional HTTP port (defaults to `4000`).

For production, it is recommended to deploy a PostgreSQL instance using CapRover's one-click app and use its connection URL for `DATABASE_URL`.

## Deploy on CapRover

1. On the CapRover dashboard, install the PostgreSQL one-click app and note the provided connection URL.
2. Create two apps for the backend and frontend.
3. In the backend app, set environment variables:
   - `DATABASE_URL` – the connection string from the one-click Postgres app.
   - `JWT_SECRET` – any secret value used for tokens.
4. From the `backend/` and `frontend/` directories, run `caprover deploy` to build and upload using the included `captain-definition` files.
5. Attach a persistent volume to the Postgres app.

