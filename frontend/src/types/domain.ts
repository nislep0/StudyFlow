export type ID = string;
export type AssignmentStatus = 'planned' | 'in_progress' | 'done';
export type Priority = 'low' | 'medium' | 'high';
export type User = {
  id: ID;
  email: string;
  password: string;
  fullName?: string;
};
export type Courses = {
  id: ID;
  userId: ID;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
};
export type Assignment = {
  id: ID;
  userId: ID;
  courseId: ID;
  title: string;
  description?: string;
  status: AssignmentStatus;
  priority: Priority;
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
};
