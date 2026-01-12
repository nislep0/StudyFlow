import type { ReactNode } from 'react';
import { createContext, useContext, useState, useEffect } from 'react';
import { apiFetch } from '../shared/api/client';
import type { Course, Assignment, AssignmentStatus, Priority } from '../types/domain';

interface DataContextType {
  courses: Course[];
  assignments: Assignment[];
  isLoading: boolean;
  error: string | null;
  refresh: () => Promise<void>;

  addCourse: (name: string, description?: string) => Promise<Course>;
  updateCourse: (id: string, data: Partial<Course>) => Promise<Course>;
  deleteCourse: (id: string) => Promise<void>;

  addAssignment: (data: {
    courseId: string;
    title: string;
    description?: string;
    dueDate?: string;
    priority?: Priority;
    status?: AssignmentStatus;
  }) => Promise<Assignment>;

  updateAssignment: (id: string, data: Partial<Assignment>) => Promise<Assignment>;
  deleteAssignment: (id: string) => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: ReactNode }) {
  const [courses, setCourses] = useState<Course[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const [coursesData, assignmentsData] = await Promise.all([
        apiFetch<Course[]>('/courses'),
        apiFetch<Assignment[]>('/assignments'),
      ]);

      setCourses(coursesData);
      setAssignments(assignmentsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load data');
      console.error('Error loading data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const addCourse = async (name: string, description?: string): Promise<Course> => {
    const newCourse = await apiFetch<Course>('/courses', {
      method: 'POST',
      body: JSON.stringify({ name, description }),
    });

    setCourses((prev) => [newCourse, ...prev]);
    return newCourse;
  };

  const updateCourse = async (id: string, data: Partial<Course>): Promise<Course> => {
    const updated = await apiFetch<Course>(`/courses/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });

    setCourses((prev) => prev.map((course) => (course.id === id ? updated : course)));
    return updated;
  };

  const deleteCourse = async (id: string): Promise<void> => {
    await apiFetch(`/courses/${id}`, { method: 'DELETE' });
    setCourses((prev) => prev.filter((course) => course.id !== id));
    setAssignments((prev) => prev.filter((assignment) => assignment.courseId !== id));
  };

  const addAssignment = async (data: {
    courseId: string;
    title: string;
    description?: string;
    dueDate?: string;
    priority?: Priority;
    status?: AssignmentStatus;
  }): Promise<Assignment> => {
    const newAssignment = await apiFetch<Assignment>('/assignments', {
      method: 'POST',
      body: JSON.stringify(data),
    });

    setAssignments((prev) => [...prev, newAssignment]);
    return newAssignment;
  };

  const updateAssignment = async (id: string, data: Partial<Assignment>): Promise<Assignment> => {
    const updated = await apiFetch<Assignment>(`/assignments/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });

    setAssignments((prev) =>
      prev.map((assignment) => (assignment.id === id ? updated : assignment)),
    );
    return updated;
  };

  const deleteAssignment = async (id: string): Promise<void> => {
    await apiFetch(`/assignments/${id}`, { method: 'DELETE' });
    setAssignments((prev) => prev.filter((assignment) => assignment.id !== id));
  };

  const value: DataContextType = {
    courses,
    assignments,
    isLoading,
    error,
    refresh: loadData,
    addCourse,
    updateCourse,
    deleteCourse,
    addAssignment,
    updateAssignment,
    deleteAssignment,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}
/* eslint-disable react-refresh/only-export-components */
export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}
