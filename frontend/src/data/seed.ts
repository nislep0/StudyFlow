import { storage } from './storage';
import type { Assignment, Courses, User } from '../types/domain';

function nowIso() {
  return new Date().toISOString();
}

function plusDays(days: number) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return d.toISOString().slice(0, 10);
}

export function seedData() {
  const user = storage.getUsers();
  const courses = storage.getCourses();
  const assignments = storage.getAssignments();
  if (user.length > 0 || courses.length > 0 || assignments.length > 0) return;

  const demoUser: User = {
    id: 'u_demo',
    email: 'demo@studyflow.local',
    password: 'demo1234',
    fullName: 'Demo User',
  };

  const c1: Courses = {
    id: 'c_alg',
    userId: demoUser.id,
    name: 'Algorithms and data structures',
    description: 'Basic data structures and algorithms',
    createdAt: nowIso(),
    updatedAt: nowIso(),
  };
  const c2: Courses = {
    id: 'c_web',
    userId: demoUser.id,
    name: 'Web Development',
    description: 'Frontend + Backend',
    createdAt: nowIso(),
    updatedAt: nowIso(),
  };
  const a1: Assignment = {
    id: 'assignment-1',
    userId: demoUser.id,
    courseId: c1.id,
    title: 'Lab2: UML + ER Diagram',
    description: 'Create UML and ER diagrams for the given scenarios.',
    status: 'in_progress',
    priority: 'high',
    dueDate: plusDays(7),
    createdAt: nowIso(),
    updatedAt: nowIso(),
  };
  const a2: Assignment = {
    id: 'assignment-2',
    userId: demoUser.id,
    courseId: c2.id,
    title: 'Lab3: Prototype',
    description: 'Interactive prototype with static data',
    status: 'planned',
    priority: 'medium',
    dueDate: plusDays(14),
    createdAt: nowIso(),
    updatedAt: nowIso(),
  };

  storage.setUsers([demoUser]);
  storage.setCourses([c1, c2]);
  storage.setAssignments([a1, a2]);
}
