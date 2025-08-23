import { Router } from 'express';
import { PrismaClient, Stage } from '@prisma/client';
import { requireAuth } from '../middleware/auth.js';

const prisma = new PrismaClient();
const router = Router();

router.get('/overview', requireAuth, async (_req, res) => {
  const stages = Object.values(Stage);
  const counts: Record<string, number> = {};
  const averages: Record<string, number> = {};
  const now = new Date();
  const start = new Date();
  start.setHours(0,0,0,0);

  for (const stage of stages) {
    counts[stage] = await prisma.car.count({ where: { status: stage } });
    const cars = await prisma.car.findMany({
      where: { status: stage },
      include: { audits: { where: { toStage: stage }, orderBy: { movedAt: 'desc' }, take: 1 } }
    });
    const durations = cars
      .filter(c => c.audits[0] && c.audits[0].movedAt >= start)
      .map(c => (now.getTime() - c.audits[0].movedAt.getTime())/60000);
    averages[stage] = durations.length ? durations.reduce((a,b)=>a+b,0)/durations.length : 0;
  }
  const total = await prisma.car.count({ where: { status: { not: Stage.RELEASED } } });
  res.json({ counts, averages, total });
});

export default router;
