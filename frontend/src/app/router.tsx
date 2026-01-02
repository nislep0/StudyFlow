import { createBrowserRouter } from 'react-router-dom';
import { Layout } from '../shared/components/Layout';
import { DashboardPage } from '../features/dashboard/DashboardPage';
import { CoursesPage } from '../features/courses/CoursesPage';
import { AssignmentsPage } from '../features/assignments/AssignmentsPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <Layout>
        <DashboardPage />
      </Layout>
    ),
  },
  {
    path: '/courses',
    element: (
      <Layout>
        <CoursesPage />
      </Layout>
    ),
  },
  {
    path: '/assignments',
    element: (
      <Layout>
        <AssignmentsPage />
      </Layout>
    ),
  },
]);
