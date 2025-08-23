import { PrismaClient, Stage, Role } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const adminPass = await bcrypt.hash('admin123', 10);
  const staffPass = await bcrypt.hash('staff123', 10);

  await prisma.user.createMany({
    data: [
      { username: 'admin', password: adminPass, role: Role.ADMIN },
      { username: 'staff', password: staffPass, role: Role.STAFF },
    ],
    skipDuplicates: true,
  });

  await prisma.stageCapacity.createMany({
    data: [
      { stage: Stage.WAITING, capacity: 10 },
      { stage: Stage.WASHING, capacity: 2 },
      { stage: Stage.CLEANING, capacity: 2 },
      { stage: Stage.FINISHED, capacity: 5 },
    ],
    skipDuplicates: true,
  });

  const plates = ['A123', 'B234', 'C345', 'D456', 'E567', 'F678', 'G789', 'H890', 'I901', 'J012'];
  const stages: Stage[] = [
    Stage.WAITING,
    Stage.WAITING,
    Stage.WASHING,
    Stage.WASHING,
    Stage.CLEANING,
    Stage.CLEANING,
    Stage.FINISHED,
    Stage.FINISHED,
    Stage.RELEASED,
    Stage.RELEASED,
  ];

  for (let i = 0; i < plates.length; i++) {
    await prisma.car.create({
      data: {
        plate: plates[i],
        status: stages[i],
        audits: {
          create: {
            fromStage: null,
            toStage: stages[i],
            user: { connect: { username: 'admin' } },
          },
        },
      },
    });
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
