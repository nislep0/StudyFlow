import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';

const { Pool } = pg;
const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  throw new Error('Missing DATABASE_URL');
}

const pool = new Pool({ connectionString: databaseUrl });
export const prisma = new PrismaClient({
  adapter: new PrismaPg(pool),
});
