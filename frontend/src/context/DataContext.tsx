import React, { createContext, useState, useContext, useMemo } from 'react';
import { storage } from '../data/storage';
import type { Assignment, Courses, Priority } from '../types/domain';
import { useAuth } from './AuthContext';

type DataContextValue = {
  courses: Courses[];
  assignments: Assignment[];

  addCourse: (name: string, description?: string) => void;
  updateCourse: (id: string, patch: Partial<Pick<Courses, 'name' | 'description'>>) => void;
  deleteCourse: (id: string) => void;
  addAssignment: (input: {
    courseId: string;
    title: string;
    description?: string;
    dueDate?: string;
    priority: Priority;
  }) => void;
  updateAssignment: (
    id: string,
    patch: Partial<Pick<Assignment, 'title' | 'description' | 'dueDate' | 'priority' | 'status'>>,
  ) => void;
  deleteAssignment: (id: string) => void;
};
const DataContext = createContext<DataContextValue | null>(null);

function nowIso() {
  return new Date().toISOString();
}
function generateId(prefix: string) {
  return `${prefix}_${Math.random().toString(36).slice(2)}_${Date.now()}`;
}
export function DataProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [coursesState, setCoursesState] = useState(() => storage.getCourses());
  const [assignmentsState, setAssignmentsState] = useState(() => storage.getAssignments());
  const courses = useMemo(() => {
    if (!user) return [];
    return coursesState.filter((c) => c.userId === user.id);
  }, [coursesState, user]);
  const assignments = useMemo(() => {
    if (!user) return [];
    return assignmentsState.filter((a) => a.userId === user.id);
  }, [assignmentsState, user]);

  function persistCourses(newCourses: Courses[]) {
    setCoursesState(newCourses);
    storage.setCourses(newCourses);
  }
  function persistAssignments(newAssignments: Assignment[]) {
    setAssignmentsState(newAssignments);
    storage.setAssignments(newAssignments);
  }
  function addCourse(name: string, description?: string) {
    if (!user) return;
    const newCourse: Courses = {
      id: generateId('course'),
      userId: user.id,
      name,
      description,
      createdAt: nowIso(),
      updatedAt: nowIso(),
    };
    persistCourses([...coursesState, newCourse]);
  }
  function updateCourse(id: string, patch: Partial<Pick<Courses, 'name' | 'description'>>) {
    const newCourses = coursesState.map((c) =>
      c.id === id ? { ...c, ...patch, updatedAt: nowIso() } : c,
    );
    persistCourses(newCourses);
  }
  function deleteCourse(id: string) {
    persistCourses(coursesState.filter((c) => c.id !== id));
    persistAssignments(assignmentsState.filter((a) => a.courseId !== id));
  }
  function addAssignment(input: {
    courseId: string;
    title: string;
    description?: string;
    dueDate?: string;
    priority: Priority;
  }) {
    if (!user) return;
    const newAssignment: Assignment = {
      id: generateId('assignment'),
      userId: user.id,
      courseId: input.courseId,
      title: input.title,
      description: input.description,
      dueDate: input.dueDate,
      priority: input.priority,
      status: 'planned',
      createdAt: nowIso(),
      updatedAt: nowIso(),
    };
    persistAssignments([...assignmentsState, newAssignment]);
  }
  function updateAssignment(
    id: string,
    patch: Partial<Pick<Assignment, 'title' | 'description' | 'dueDate' | 'priority' | 'status'>>,
  ) {
    const newAssignments = assignmentsState.map((a) =>
      a.id === id ? { ...a, ...patch, updatedAt: nowIso() } : a,
    );
    persistAssignments(newAssignments);
  }
  function deleteAssignment(id: string) {
    persistAssignments(assignmentsState.filter((a) => a.id !== id));
  }
  const value: DataContextValue = {
    courses,
    assignments,
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
