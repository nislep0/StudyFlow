import React from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { Layout } from '../shared/components/Layout';
import { ProtectedRoute } from '../shared/components/ProtectedRoute';
import { LoginPage } from '../features/auth/LoginPage';
import { RegisterPage } from '../features/auth/RegisterPage';
import { DashboardPage } from '../features/dashboard/DashboardPage';
import { CoursesPage } from '../features/courses/CoursesPage';
import { AssignmentsPage } from '../features/assignments/AssignmentsPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <Layout>
        <Navigate to="/dashboard" replace />
      </Layout>
    ),
  },
  {
    path: '/login',
    element: (
      <Layout>
        <LoginPage />
      </Layout>
    ),
  },
  {
    path: '/register',
    element: (
      <Layout>
        <RegisterPage />
      </Layout>
    ),
  },
  {
    path: '/dashboard',
    element: (
      <Layout>
        <ProtectedRoute>
          <DashboardPage />
        </ProtectedRoute>
      </Layout>
    ),
  },
  {
    path: '/courses',
    element: (
      <Layout>
        <ProtectedRoute>
          <CoursesPage />
        </ProtectedRoute>
      </Layout>
    ),
  },
  {
    path: '/assignments',
    element: (
      <Layout>
        <ProtectedRoute>
          <AssignmentsPage />
        </ProtectedRoute>
      </Layout>
    ),
  },
]);
