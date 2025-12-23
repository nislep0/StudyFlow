import 'dotenv/config';
import express from 'express';
import cors from 'cors';

import { mockUser } from './middleware/user.js';
import { coursesRouter } from './routes/courses.js';
import { assignmentsRouter } from './routes/assignments.js';
console.log('CWD:', process.cwd());
console.log('DATABASE_URL:', process.env.DATABASE_URL);
const app = express();

app.use(cors());
app.use(express.json());
app.use(mockUser);
app.use('/api/courses', coursesRouter);
app.use('/api/assignments', assignmentsRouter);

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

const PORT = Number(process.env.PORT ?? 3000);
if (!Number.isFinite(PORT)) throw new Error('invalid port');

app.listen(PORT, '0.0.0.0', () => {
  console.log(`server is running on port ${PORT}`);
});
