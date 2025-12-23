import React, { createContext, useState, useContext, useMemo, useEffect } from 'react';
import { apiFetch } from '../shared/api/client';
import type { Assignment, Courses, Priority } from '../types/domain';
import { useAuth } from './AuthContext';

type DataContextValue = {
  courses: Courses[];
  assignments: Assignment[];
  isLoading: boolean;
  error: string | null;
  reload: () => Promise<void>;

  addCourse: (name: string, description?: string) => Promise<void>;
  updateCourse: (
    id: string,
    patch: Partial<Pick<Courses, 'name' | 'description'>>,
  ) => Promise<void>;
  deleteCourse: (id: string) => Promise<void>;
  addAssignment: (input: {
    courseId: string;
    title: string;
    description?: string;
    dueDate?: string;
    priority: Priority;
  }) => Promise<void>;
  updateAssignment: (
    id: string,
    patch: Partial<Pick<Assignment, 'title' | 'description' | 'dueDate' | 'priority' | 'status'>>,
  ) => Promise<void>;
  deleteAssignment: (id: string) => Promise<void>;
};
const DataContext = createContext<DataContextValue | null>(null);

export function DataProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [coursesState, setCoursesState] = useState<Courses[]>([]);
  const [assignmentsState, setAssignmentsState] = useState<Assignment[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const courses = useMemo(() => {
    if (!user) return [];
    return coursesState;
  }, [coursesState, user]);
  const assignments = useMemo(() => {
    if (!user) return [];
    return assignmentsState;
  }, [assignmentsState, user]);

  async function reload() {
    if (!user) {
      setCoursesState([]);
      setAssignmentsState([]);
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const [c, a] = await Promise.all([
        apiFetch<Courses[]>('/courses'),
        apiFetch<Assignment[]>('/assignments'),
      ]);
      setCoursesState(c);
      setAssignmentsState(a);
    } catch (e: unknown) {
      if (e instanceof Error) {
        setError(e?.message ?? 'Failed to load data');
      } else {
        setError('unknown error');
      }
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    void reload();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  async function addCourse(name: string, description?: string) {
    if (!user) return;
    const created = await apiFetch<Courses>('/courses', {
      method: 'POST',
      body: JSON.stringify({ name, description }),
    });
    setCoursesState((prev) => [created, ...prev]);
  }

  async function updateCourse(id: string, patch: Partial<Pick<Courses, 'name' | 'description'>>) {
    const updated = await apiFetch<Courses>(`/courses/${id}`, {
      method: 'PUT',
      body: JSON.stringify(patch),
    });
    setCoursesState((prev) => prev.map((c) => (c.id === id ? updated : c)));
  }

  async function deleteCourse(id: string) {
    await apiFetch<void>(`/courses/${id}`, { method: 'DELETE' });
    setCoursesState((prev) => prev.filter((c) => c.id !== id));
    setAssignmentsState((prev) => prev.filter((a) => a.courseId !== id));
  }

  async function addAssignment(input: {
    courseId: string;
    title: string;
    description?: string;
    dueDate?: string;
    priority: Priority;
  }) {
    if (!user) return;
    const created = await apiFetch<Assignment>('/assignments', {
      method: 'POST',
      body: JSON.stringify(input),
    });
    setAssignmentsState((prev) => [...prev, created]);
  }

  async function updateAssignment(
    id: string,
    patch: Partial<Pick<Assignment, 'title' | 'description' | 'dueDate' | 'priority' | 'status'>>,
  ) {
    const updated = await apiFetch<Assignment>(`/assignments/${id}`, {
      method: 'PUT',
      body: JSON.stringify(patch),
    });
    setAssignmentsState((prev) => prev.map((a) => (a.id === id ? updated : a)));
  }

  async function deleteAssignment(id: string) {
    await apiFetch<void>(`/assignments/${id}`, { method: 'DELETE' });
    setAssignmentsState((prev) => prev.filter((a) => a.id !== id));
  }

  const value: DataContextValue = {
    courses,
    assignments,
    isLoading,
    error,
    reload,
    addCourse,
    updateCourse,
    deleteCourse,
    addAssignment,
    updateAssignment,
    deleteAssignment,
  };
  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}
export function useData() {
  const context = useContext(DataContext);
  if (!context) throw new Error('useData must be used within a DataProvider');
  return context;
}
