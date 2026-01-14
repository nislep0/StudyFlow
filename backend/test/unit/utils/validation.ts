import type { AssignmentStatus, Priority } from '@prisma/client';

export const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const STATUS_VALUES = new Set<AssignmentStatus>(['planned', 'in_progress', 'done']);
const PRIORITY_VALUES = new Set<Priority>(['low', 'medium', 'high']);

export function normalizeUuid(raw?: string): string | undefined | '__invalid__' {
  if (!raw) return undefined;
  const v = String(raw).trim();
  if (!v || v === 'undefined' || v === 'null' || v === 'all') return undefined;
  return UUID_RE.test(v) ? v : '__invalid__';
}

export function normalizeStatus(raw?: string): AssignmentStatus | undefined {
  if (!raw) return undefined;
  const v = String(raw).trim();
  const mapped = v === 'inProgress' ? 'in_progress' : v === 'IN_PROGRESS' ? 'in_progress' : v;
  return STATUS_VALUES.has(mapped as AssignmentStatus) ? (mapped as AssignmentStatus) : undefined;
}

export function normalizePriority(raw?: string): Priority | undefined {
  if (!raw) return undefined;
  const v = String(raw).trim().toLowerCase();
  return PRIORITY_VALUES.has(v as Priority) ? (v as Priority) : undefined;
}
