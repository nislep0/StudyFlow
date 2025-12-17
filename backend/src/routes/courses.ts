import { Router } from 'express';
import { prisma } from '../db/prisma.js';

export const coursesRouter = Router();
coursesRouter.get('/', async (req, res) => {
  const userId = req.userId!;
  const courses = await prisma.course.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  });
  res.json(courses);
});

coursesRouter.post('/', async (req, res) => {
  const userId = req.userId!;
  const { name, description } = req.body as { name?: string; description?: string };
  if (!name?.trim()) return res.status(400).json({ message: 'name is required' });
  const course = await prisma.course.create({
    data: { userId, name: name.trim(), description: description?.trim() || null },
  });
  res.status(201).json(course);
});

coursesRouter.put('/:id', async (req, res) => {
  const userId = req.userId!;
  const { id } = req.params;
  const { name, description } = req.body as { name?: string; description?: string };
  const existing = await prisma.course.findFirst({ where: { id, userId } });
  if (!existing) return res.status(404).json({ message: 'course not found' });
  const course = await prisma.course.update({
    where: { id },
    data: {
      name: name?.trim() ?? existing.name,
      description: description !== undefined ? description?.trim() || null : existing.description,
    },
  });
  res.json(course);
});

coursesRouter.delete('/:id', async (req, res) => {
  const userId = req.userId!;
  const { id } = req.params;
  const existing = await prisma.course.findFirst({ where: { id, userId } });
  if (!existing) return res.status(404).json({ message: 'course not found' });
  await prisma.course.delete({ where: { id } });
  res.status(204).send();
});
