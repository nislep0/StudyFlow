import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import request from 'supertest';
import { createApp } from '../../src/app.js';
import { prisma } from '../../src/db/prisma.js';

const app = createApp();

describe('API integration (Postgres in Docker)', () => {
  beforeAll(async () => {
    await prisma.$connect();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  beforeEach(async () => {
    await prisma.assignment.deleteMany();
    await prisma.course.deleteMany();
  });

  it('health works', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
  });

  it('create and list course', async () => {
    const created = await request(app)
      .post('/api/courses')
      .send({ name: 'Integration Course', description: 'test' });

    expect(created.status).toBe(201);
    expect(created.body.name).toBe('Integration Course');

    const list = await request(app).get('/api/courses');
    expect(list.status).toBe(200);
    expect(Array.isArray(list.body)).toBe(true);
    expect(list.body.length).toBe(1);
  });

  it('create assignment and filter by courseId', async () => {
    const course = await request(app).post('/api/courses').send({ name: 'C1' });
    expect(course.status).toBe(201);

    const created = await request(app).post('/api/assignments').send({
      courseId: course.body.id,
      title: 'A1',
      priority: 'high',
      status: 'planned',
      dueDate: '2024-02-20',
    });

    expect(created.status).toBe(201);

    const filtered = await request(app).get('/api/assignments').query({ courseId: course.body.id });

    expect(filtered.status).toBe(200);
    expect(filtered.body.length).toBe(1);
    expect(filtered.body[0].title).toBe('A1');
  });

  it('update assignment status', async () => {
    const course = await request(app).post('/api/courses').send({ name: 'C2' });

    const a = await request(app).post('/api/assignments').send({
      courseId: course.body.id,
      title: 'To update',
    });

    const upd = await request(app).put(`/api/assignments/${a.body.id}`).send({ status: 'done' });

    expect(upd.status).toBe(200);
    expect(upd.body.status).toBe('done');
  });

  it('deleting course cascades assignments', async () => {
    const course = await request(app).post('/api/courses').send({ name: 'Cascade' });
    await request(app).post('/api/assignments').send({
      courseId: course.body.id,
      title: 'A',
    });

    const del = await request(app).delete(`/api/courses/${course.body.id}`);
    expect(del.status).toBe(204);

    const list = await request(app).get('/api/assignments');
    expect(list.status).toBe(200);
    expect(list.body.length).toBe(0);
  });
});
