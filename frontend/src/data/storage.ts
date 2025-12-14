import type { Assignment, Courses, User } from '../types/domain';

const LS_KEYS = {
  users: 'studyflow_users',
  auth: 'studyflow_auth',
  courses: 'studyflow_courses',
  assignments: 'studyflow_assignments',
} as const;

export type AuthState = {
  userId: string | null;
};

function readJSON<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeJSON<T>(key: string, value: T) {
  localStorage.setItem(key, JSON.stringify(value));
}

export const storage = {
  getUsers(): User[] {
    return readJSON<User[]>(LS_KEYS.users, []);
  },
  setUsers(users: User[]) {
    writeJSON<User[]>(LS_KEYS.users, users);
  },
  getAuth(): AuthState {
    return readJSON<AuthState>(LS_KEYS.auth, { userId: null });
  },
  setAuth(auth: AuthState) {
    writeJSON<AuthState>(LS_KEYS.auth, auth);
  },
  getCourses(): Courses[] {
    return readJSON<Courses[]>(LS_KEYS.courses, []);
  },
  setCourses(courses: Courses[]) {
    writeJSON<Courses[]>(LS_KEYS.courses, courses);
  },
  getAssignments(): Assignment[] {
    return readJSON<Assignment[]>(LS_KEYS.assignments, []);
  },
  setAssignments(assignments: Assignment[]) {
    writeJSON<Assignment[]>(LS_KEYS.assignments, assignments);
  },
};
