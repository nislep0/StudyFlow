import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const url = process.env.DATABASE_URL;
if (!url) throw new Error('DATABASE_URL is missing');
const adapter = new PrismaPg({ url });
export const prisma = new PrismaClient({ adapter });
