export type AssignmentStatus = 'planned' | 'in_progress' | 'done';
export type Priority = 'low' | 'medium' | 'high';

export interface Course {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
  assignments?: Assignment[];
}

export interface Assignment {
  id: string;
  courseId: string;
  title: string;
  description?: string;
  status: AssignmentStatus;
  priority: Priority;
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
  course?: { name: string };
}
