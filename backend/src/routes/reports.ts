import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { requireAuth } from '../middleware/auth.js';
import { Parser } from 'json2csv';

const prisma = new PrismaClient();
const router = Router();

router.get('/daily', requireAuth, async (req, res) => {
  const dateStr = String(req.query.date);
  const start = new Date(dateStr);
  const end = new Date(start);
  end.setDate(start.getDate() + 1);

  const payments = await prisma.payment.findMany({
    where: { createdAt: { gte: start, lt: end } },
    include: { car: true },
  });
  const carsProcessed = payments.length;
  const revenue = payments.reduce((a, p) => a + p.amount, 0);

  const durations: number[] = [];
  for (const p of payments) {
    const audits = await prisma.audit.findMany({
      where: { carId: p.carId },
      orderBy: { movedAt: 'asc' },
    });
    const total = p.createdAt.getTime() - audits[0].movedAt.getTime();
    durations.push(total / 60000);
  }
  const avgTotalMinutes = durations.length ? durations.reduce((a,b)=>a+b,0)/durations.length : 0;
  const data = { date: dateStr, carsProcessed, revenue, avgTotalMinutes };

  if (req.headers.accept?.includes('text/csv') || req.query.format === 'csv') {
    const parser = new Parser({ fields: ['date','carsProcessed','revenue','avgTotalMinutes'] });
    const csv = parser.parse([data]);
    res.header('Content-Type', 'text/csv');
    return res.send(csv);
  }
  res.json(data);
});

export default router;
