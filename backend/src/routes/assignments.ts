import { Router } from 'express';
import { prisma } from '../db/prisma.js';
import type { AssignmentStatus, Priority } from '@prisma/client';

export const assignmentsRouter = Router();

const STATUS_VALUES = new Set<AssignmentStatus>(['planned', 'in_progress', 'done']);
const PRIORITY_VALUES = new Set<Priority>(['low', 'medium', 'high']);

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function normalizeUuid(raw?: string): string | undefined {
  if (!raw) return undefined;
  const v = String(raw).trim();

  if (!v || v === 'undefined' || v === 'null' || v === 'all') return undefined;

  return UUID_RE.test(v) ? v : '__invalid__';
}

function normalizeStatus(raw?: string): AssignmentStatus | undefined {
  if (!raw) return undefined;
  const v = String(raw).trim();

  const mapped = v === 'inProgress' ? 'in_progress' : v === 'IN_PROGRESS' ? 'in_progress' : v;

  return STATUS_VALUES.has(mapped as AssignmentStatus) ? (mapped as AssignmentStatus) : undefined;
}

function normalizePriority(raw?: string): Priority | undefined {
  if (!raw) return undefined;
  const v = String(raw).trim().toLowerCase();
  return PRIORITY_VALUES.has(v as Priority) ? (v as Priority) : undefined;
}

assignmentsRouter.get('/', async (req, res) => {
  console.log('Assignments query:', req.query);

  const userId = req.userId!;
  const { courseId, status } = req.query as { courseId?: string; status?: string };

  const normalizedStatus = normalizeStatus(status);
  if (status && !normalizedStatus) {
    return res.status(400).json({
      message: `Invalid status '${status}'. Allowed: planned, in_progress, done`,
    });
  }

  const normalizedCourseId = normalizeUuid(courseId);
  if (normalizedCourseId === '__invalid__') {
    return res.status(400).json({ message: `Invalid courseId '${courseId}' (must be UUID)` });
  }

  if (!UUID_RE.test(userId)) {
    return res.status(400).json({ message: `Invalid x-user-id '${userId}' (must be UUID)` });
  }

  const assignments = await prisma.assignment.findMany({
    where: {
      userId,
      ...(normalizedCourseId ? { courseId: normalizedCourseId } : {}),
      ...(normalizedStatus ? { status: normalizedStatus } : {}),
    },
    orderBy: [{ dueDate: 'asc' }, { createdAt: 'desc' }],
  });

  res.json(assignments);
});

assignmentsRouter.post('/', async (req, res) => {
  console.log('Assignments query:', req.query);
  const userId = req.userId!;
  const { courseId, title, description, dueDate, priority } = req.body as {
    courseId?: string;
    title?: string;
    description?: string;
    dueDate?: string;
    priority?: Priority;
  };
  if (!courseId) return res.status(400).json({ message: 'courseId is required' });
  if (!title?.trim()) return res.status(400).json({ message: 'title is required' });
  const course = await prisma.course.findFirst({ where: { id: courseId, userId } });
  if (!course) return res.status(403).json({ message: 'course does not belong to user' });

  const normalizedPriority = normalizePriority(priority as unknown as string);
  if (priority && !normalizedPriority) {
    return res.status(400).json({
      message: `Invalid priority '${priority}'.Allowed: low, medium, high`,
    });
  }

  const assignment = await prisma.assignment.create({
    data: {
      userId,
      courseId,
      title: title.trim(),
      description: description?.trim() || null,
      dueDate: dueDate ? new Date(dueDate) : null,
      priority: normalizedPriority ?? 'medium',
    },
  });
  res.status(201).json(assignment);
});

assignmentsRouter.put('/:id', async (req, res) => {
  console.log('Assignments query:', req.query);
  const userId = req.userId!;
  const { id } = req.params;
  const { title, description, dueDate, priority, status } = req.body as {
    title?: string;
    description?: string;
    dueDate?: string;
    priority?: Priority;
    status?: AssignmentStatus;
  };
  const existing = await prisma.assignment.findFirst({ where: { id, userId } });
  if (!existing) return res.status(404).json({ message: 'assignment not found' });

  const normalizedStatus = normalizeStatus(status);

  if (status && !normalizedStatus) {
    return res.status(400).json({
      message: `Invalid status '${status}'.Allowed: planned, in_progress, done`,
    });
  }

  const normalizedPriority = normalizePriority(priority as unknown as string);
  if (priority && !normalizedPriority) {
    return res.status(400).json({
      message: `Invalid priority '${priority}'.Allowed: low, medium, high`,
    });
  }

  const updated = await prisma.assignment.update({
    where: { id },
    data: {
      title: title !== undefined ? title.trim() || existing.title : existing.title,
      description: description !== undefined ? description.trim() || null : existing.description,
      dueDate: dueDate !== undefined ? (dueDate ? new Date(dueDate) : null) : existing.dueDate,
      priority: normalizedPriority ?? existing.priority,
      status: normalizedStatus ?? existing.status,
    },
  });
  res.json(updated);
});

assignmentsRouter.delete('/:id', async (req, res) => {
  const userId = req.userId!;
  const { id } = req.params;
  const existing = await prisma.assignment.findFirst({ where: { id, userId } });
  if (!existing) return res.status(404).json({ message: 'assignment not found' });
  await prisma.assignment.delete({ where: { id } });
  res.status(204).send();
});
