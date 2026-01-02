import express from 'express';
import cors from 'cors';
import { coursesRouter } from './routes/courses.js';
import { assignmentsRouter } from './routes/assignments.js';

export function createApp() {
  const app = express();

  app.use(cors());
  app.use(express.json());

  app.get('/health', (_req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  app.use('/api/courses', coursesRouter);
  app.use('/api/assignments', assignmentsRouter);

  app.use((_req, res) => {
    res.status(404).json({ message: 'Route not found' });
  });

  return app;
}
