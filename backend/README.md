# Backend Deployment Notes

## Automatic database setup

The backend image now starts with an entrypoint script that runs the Prisma migrations and seed script before launching the API server. On every container start, the following commands execute sequentially:

```bash
npx prisma migrate deploy
npx prisma db seed
```

This guarantees the database schema is up to date and that the default admin account defined in `prisma/seed.ts` is provisioned automatically for CapRover and other deployments.

## Rerunning the seed manually

If you ever need to reapply the seed data (for example after clearing the database), run the seed command manually from the backend workspace or inside the container:

```bash
npx prisma db seed
```

The command can be executed as many times as needed because the seed script uses `skipDuplicates` to avoid recreating existing records.
