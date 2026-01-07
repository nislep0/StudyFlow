import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import { prisma } from '../../src/db/prisma.js';
import type { Server } from 'http';

const BASE = process.env.E2E_BASE_URL || 'http://127.0.0.1:3010';

type ApiResult<T> = {
  res: Response;
  json: T | null;
  text: string;
};

async function api<T = unknown>(path: string, init?: RequestInit): Promise<ApiResult<T>> {
  const res = await fetch(`${BASE}${path}`, {
    ...init,
    headers: {
      'content-type': 'application/json',
      ...(init?.headers ?? {}),
    },
  });

  const text = await res.text();

  let json: T | null = null;
  try {
    json = text ? (JSON.parse(text) as T) : null;
  } catch {
    json = null;
  }

  return { res, json, text };
}

async function waitForHealth(timeoutMs = 10_000) {
  const start = Date.now();

  while (Date.now() - start < timeoutMs) {
    try {
      const { res } = await api('/health');
      if (res.ok) return;
    } catch {
      // ignore
    }
    await new Promise((r) => setTimeout(r, 250));
  }

  throw new Error('API did not become healthy in time');
}

describe('E2E: API + Postgres', () => {
  let server: Server;

  beforeAll(async () => {
    const { createApp } = await import('../../src/app.js');
    const app = createApp();

    const port = Number(process.env.PORT) || 3010;
    server = app.listen(port, '127.0.0.1');

    await prisma.$connect();
    await waitForHealth();
  });

  afterAll(async () => {
    await prisma.$disconnect();
    await new Promise<void>((resolve, reject) => {
      server.close((err) => (err ? reject(err) : resolve()));
    });
  });

  beforeEach(async () => {
    await prisma.assignment.deleteMany();
    await prisma.course.deleteMany();
  });

  it('health', async () => {
    const { res, json } = await api<{ status: string }>('/health');
    expect(res.status).toBe(200);
    expect(json?.status).toBe('ok');
  });

  it('course + assignment flow', async () => {
    const c = await api<{ id: string; name: string }>('/api/courses', {
      method: 'POST',
      body: JSON.stringify({ name: 'E2E Course', description: 'desc' }),
    });
    expect(c.res.status).toBe(201);
    expect(c.json?.name).toBe('E2E Course');

    const courseId = c.json?.id;
    expect(courseId).toBeTruthy();

    const a = await api<{ id: string; title: string }>('/api/assignments', {
      method: 'POST',
      body: JSON.stringify({ courseId, title: 'E2E Assignment', priority: 'high' }),
    });
    expect(a.res.status).toBe(201);
    expect(a.json?.title).toBe('E2E Assignment');

    const assignmentId = a.json?.id;
    expect(assignmentId).toBeTruthy();

    const list = await api<unknown[]>(`/api/assignments?courseId=${courseId}`);
    expect(list.res.status).toBe(200);
    expect(Array.isArray(list.json)).toBe(true);
    expect(list.json?.length).toBe(1);

    const upd = await api<{ status: string }>(`/api/assignments/${assignmentId}`, {
      method: 'PUT',
      body: JSON.stringify({ status: 'done' }),
    });
    expect(upd.res.status).toBe(200);
    expect(upd.json?.status).toBe('done');

    const delCourse = await api(`/api/courses/${courseId}`, { method: 'DELETE' });
    expect(delCourse.res.status).toBe(204);

    const after = await api<unknown[]>(`/api/assignments?courseId=${courseId}`);
    expect(after.res.status).toBe(200);
    expect(after.json?.length).toBe(0);
  });
});
