import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import { createApp } from '../../src/app';

const app = createApp();
const USER_ID = process.env.TEST_USER_ID || '1035904b-ebdc-43af-bb8c-9c99710315ff';

describe('API integration', () => {
  beforeAll(async () => {});

  it('health works without auth', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
  });

  it('courses requires x-user-id', async () => {
    const res = await request(app).get('/api/courses');
    expect(res.status).toBe(401);
  });

  it('create and list course', async () => {
    const created = await request(app)
      .post('/api/courses')
      .set('x-user-id', USER_ID)
      .send({ name: 'Integration Course', description: 'test' });

    expect(created.status).toBe(201);
    expect(created.body.name).toBe('Integration Course');

    const list = await request(app).get('/api/courses').set('x-user-id', USER_ID);
    expect(list.status).toBe(200);
    expect(Array.isArray(list.body)).toBe(true);
  });
});
