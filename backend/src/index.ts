import 'dotenv/config';
import { createApp } from './app.js';

const app = createApp();

const PORT = Number(process.env.PORT ?? 3000);
if (!Number.isFinite(PORT)) throw new Error('invalid port');

app.listen(PORT, '0.0.0.0', () => {
  console.log(`server is running on port ${PORT}`);
});
