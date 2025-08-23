import { Router } from 'express';
import { PrismaClient, Stage } from '@prisma/client';
import { AuthRequest, requireAuth, requireRole } from '../middleware/auth.js';
import { Server } from 'socket.io';

const prisma = new PrismaClient();
const router = Router();
let io: Server;
export function setSocket(s: Server) { io = s; }

function broadcast() {
  io.emit('update');
}

router.post('/', requireAuth, async (req: AuthRequest, res) => {
  const { plate, make, model, color, customerName, customerPhone, notes } = req.body;
  if (!/^([A-Z0-9\s]{1,10})$/.test(plate.toUpperCase())) return res.status(400).json({ error: 'Invalid plate' });
  const car = await prisma.car.create({
    data: {
      plate: plate.toUpperCase(),
      make, model, color, customerName, customerPhone, notes,
      audits: { create: { fromStage: null, toStage: Stage.WAITING, user: { connect: { id: req.user!.id } } } },
    },
  });
  broadcast();
  res.json(car);
});

router.get('/', requireAuth, async (req, res) => {
  const { status, q, from, to } = req.query;
  const where: any = {};
  if (status) where.status = status;
  if (q) where.plate = { contains: String(q).toUpperCase() };
  if (from || to) {
    where.createdAt = {};
    if (from) where.createdAt.gte = new Date(String(from));
    if (to) where.createdAt.lte = new Date(String(to));
  }
  const cars = await prisma.car.findMany({ where, orderBy: { createdAt: 'desc' } });
  res.json(cars);
});

router.get('/:id', requireAuth, async (req, res) => {
  const car = await prisma.car.findUnique({
    where: { id: Number(req.params.id) },
    include: { audits: true, payments: true },
  });
  if (!car) return res.status(404).json({ error: 'Not found' });
  res.json(car);
});

async function checkCapacity(stage: Stage) {
  const cap = await prisma.stageCapacity.findUnique({ where: { stage } });
  if (!cap) return true;
  const count = await prisma.car.count({ where: { status: stage } });
  return count < cap.capacity;
}

router.patch('/:id/status', requireAuth, async (req: AuthRequest, res) => {
  const carId = Number(req.params.id);
  const { status } = req.body as { status: Stage };
  const car = await prisma.car.findUnique({ where: { id: carId } });
  if (!car) return res.status(404).json({ error: 'Not found' });

  const order = [Stage.WAITING, Stage.WASHING, Stage.CLEANING, Stage.FINISHED, Stage.RELEASED];
  const currentIdx = order.indexOf(car.status);
  const nextIdx = order.indexOf(status);
  if (nextIdx < 0) return res.status(400).json({ error: 'Invalid status' });
  if (nextIdx !== currentIdx + 1) {
    if (req.user!.role !== 'ADMIN') return res.status(403).json({ error: 'Cannot skip or move back' });
  }
  if (!(await checkCapacity(status))) return res.status(400).json({ error: 'Stage at capacity' });

  const updated = await prisma.car.update({
    where: { id: carId },
    data: {
      status,
      audits: { create: { fromStage: car.status, toStage: status, user: { connect: { id: req.user!.id } } } },
    },
  });
  broadcast();
  res.json(updated);
});

router.post('/:id/payments', requireAuth, async (req: AuthRequest, res) => {
  const carId = Number(req.params.id);
  const { amount, method, notes } = req.body;
  const car = await prisma.car.findUnique({ where: { id: carId } });
  if (!car) return res.status(404).json({ error: 'Not found' });
  if (car.status !== Stage.FINISHED) return res.status(400).json({ error: 'Car not ready for payment' });

  const payment = await prisma.payment.create({ data: { carId, amount, method, notes } });
  await prisma.car.update({
    where: { id: carId },
    data: {
      status: Stage.RELEASED,
      audits: { create: { fromStage: Stage.FINISHED, toStage: Stage.RELEASED, user: { connect: { id: req.user!.id } } } },
    },
  });
  broadcast();
  res.json(payment);
});

export default router;
