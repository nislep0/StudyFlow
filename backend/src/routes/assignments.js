import { Router } from 'express';
import { prisma } from '../db/prisma.js';
export const assignmentsRouter = Router();
assignmentsRouter.get('/', async (req, res) => {
  const userId = req.userId;
  const { courseId, status } = req.query;
  const assignments = await prisma.assignment.findMany({
    where: {
      userId,
      ...(courseId ? { courseId } : {}),
      ...(status ? { status: status } : {}),
    },
    orderBy: [{ dueDate: 'asc' }, { createdAt: 'desc' }],
  });
  res.json(assignments);
});
assignmentsRouter.post('/', async (req, res) => {
  const userId = req.userId;
  const { courseId, title, description, dueDate, priority } = req.body;
  if (!courseId) return res.status(400).json({ message: 'courseId is required' });
  if (!title?.trim()) return res.status(400).json({ message: 'title is required' });
  const course = await prisma.course.findFirst({ where: { id: courseId, userId } });
  if (!course) return res.status(403).json({ message: 'course does not belong to user' });
  const assignment = await prisma.assignment.create({
    data: {
      userId,
      courseId,
      title: title.trim(),
      description: description?.trim() || null,
      dueDate: dueDate ? new Date(dueDate) : null,
      priority: priority ?? 'medium',
    },
  });
  res.status(201).json(assignment);
});
assignmentsRouter.put('/:id', async (req, res) => {
  const userId = req.userId;
  const { id } = req.params;
  const { title, description, dueDate, priority, status } = req.body;
  const existing = await prisma.assignment.findFirst({ where: { id, userId } });
  if (!existing) return res.status(404).json({ message: 'assignment not found' });
  const updated = await prisma.assignment.update({
    where: { id },
    data: {
      title: title?.trim() ?? existing.title,
      description: description !== undefined ? description?.trim() || null : existing.description,
      dueDate: dueDate !== undefined ? (dueDate ? new Date(dueDate) : null) : existing.dueDate,
      priority: priority ?? existing.priority,
      status: status ?? existing.status,
    },
  });
  res.json(updated);
});
assignmentsRouter.delete('/:id', async (req, res) => {
  const userId = req.userId;
  const { id } = req.params;
  const existing = await prisma.assignment.findFirst({ where: { id, userId } });
  if (!existing) return res.status(404).json({ message: 'assignment not found' });
  await prisma.assignment.delete({ where: { id } });
  res.status(204).send();
});
//# sourceMappingURL=assignments.js.map
