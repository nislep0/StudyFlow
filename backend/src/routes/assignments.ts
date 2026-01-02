import { Router, type Request, type Response } from 'express';
import { prisma } from '../db/prisma.js';

export const assignmentsRouter = Router();

assignmentsRouter.get('/', async (req: Request, res: Response) => {
  try {
    const { courseId, status } = req.query;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = {};

    if (courseId && typeof courseId === 'string') {
      where.courseId = courseId;
    }

    if (
      status &&
      typeof status === 'string' &&
      ['planned', 'in_progress', 'done'].includes(status)
    ) {
      where.status = status;
    }

    const assignments = await prisma.assignment.findMany({
      where,
      orderBy: [{ dueDate: 'asc' }, { createdAt: 'desc' }],
    });

    res.json(assignments);
  } catch (error) {
    console.error('Error fetching assignments:', error);
    res.status(500).json({ message: 'Failed to fetch assignments' });
  }
});

assignmentsRouter.post('/', async (req: Request, res: Response) => {
  try {
    const { courseId, title, description, dueDate, priority, status } = req.body;

    if (!courseId || typeof courseId !== 'string') {
      return res.status(400).json({ message: 'Course ID is required' });
    }

    if (!title?.trim()) {
      return res.status(400).json({ message: 'Title is required' });
    }

    const course = await prisma.course.findUnique({ where: { id: courseId } });
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    const assignment = await prisma.assignment.create({
      data: {
        courseId,
        title: title.trim(),
        description: description?.trim() || null,
        dueDate: dueDate ? new Date(dueDate) : null,
        priority: priority || 'medium',
        status: status || 'planned',
      },
    });

    res.status(201).json(assignment);
  } catch (error) {
    console.error('Error creating assignment:', error);
    res.status(500).json({ message: 'Failed to create assignment' });
  }
});

assignmentsRouter.put('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, description, dueDate, priority, status } = req.body;

    if (!id) {
      return res.status(400).json({ error: 'ID is important' });
    }

    const existing = await prisma.assignment.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ message: 'Assignment not found' });
    }

    const assignment = await prisma.assignment.update({
      where: { id },
      data: {
        title: title !== undefined ? title.trim() : existing.title,
        description: description !== undefined ? description?.trim() || null : existing.description,
        dueDate: dueDate !== undefined ? (dueDate ? new Date(dueDate) : null) : existing.dueDate,
        priority: priority || existing.priority,
        status: status || existing.status,
      },
    });

    res.json(assignment);
  } catch (error) {
    console.error('Error updating assignment:', error);
    res.status(500).json({ message: 'Failed to update assignment' });
  }
});

assignmentsRouter.delete('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: 'ID is important' });
    }

    const existing = await prisma.assignment.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ message: 'Assignment not found' });
    }

    await prisma.assignment.delete({ where: { id } });
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting assignment:', error);
    res.status(500).json({ message: 'Failed to delete assignment' });
  }
});
