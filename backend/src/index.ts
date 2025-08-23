import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { createServer } from 'http';
import { Server } from 'socket.io';
import authRouter from './routes/auth.js';
import carRouter, { setSocket } from './routes/cars.js';
import metricsRouter from './routes/metrics.js';
import reportsRouter from './routes/reports.js';

const app = express();
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(cookieParser());

const httpServer = createServer(app);
const io = new Server(httpServer, { cors: { origin: true, credentials: true } });
setSocket(io);

app.use('/api/auth', authRouter);
app.use('/api/cars', carRouter);
app.use('/api/metrics', metricsRouter);
app.use('/api/reports', reportsRouter);

const PORT = process.env.PORT || 4000;
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
