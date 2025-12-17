import express from 'express';
import dotenv from 'dotenv';
import { mockUser } from './middleware/user.js';
import { coursesRouter } from './routes/courses.js';
import { assignmentsRouter } from './routes/assignments.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json());
app.use('/api', mockUser);
app.use('/api/courses', coursesRouter);
app.use('/api/assignments', assignmentsRouter);

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});
