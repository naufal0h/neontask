import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import authRoutes from './routes/auth';
import taskRoutes from './routes/tasks';

dotenv.config();

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

// Health check
app.get('/api/health', async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({ 
      status: 'ONLINE', 
      system: 'NeonTask v1.0.4',
      database: 'CONNECTED',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      status: 'DEGRADED',
      database: 'DISCONNECTED'
    });
  }
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'ENDPOINT NOT FOUND' });
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`[NeonTask] Server running on port ${PORT}`);
  console.log(`[NeonTask] API endpoints ready`);
});

process.on('SIGINT', async () => {
  await prisma.$disconnect();
  console.log('[NeonTask] System shutdown complete');
  process.exit(0);
});