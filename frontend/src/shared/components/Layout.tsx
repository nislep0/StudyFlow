import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export function Layout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const location = useLocation();
  return (
    <div
      style={{ fontFamily: 'system-ui, sans-serif', padding: 16, maxWidth: 980, margin: '0 auto' }}
    >
      <header
        style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <strong>StudyFlow</strong>
          {user && (
            <nav style={{ display: 'flex', gap: 8 }}>
              <Link
                to="/dashboard"
                aria-current={location.pathname === '/dashboard' ? 'page' : undefined}
              >
                Dashboard
              </Link>
              <Link
                to="/courses"
                aria-current={location.pathname === '/courses' ? 'page' : undefined}
              >
                Courses
              </Link>
              <Link
                to="/assignments"
                aria-current={location.pathname === '/assignments' ? 'page' : undefined}
              >
                Assignments
              </Link>
            </nav>
          )}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {user ? (
            <>
              <span style={{ opacity: 0.8 }}>Signed in as {user.email}</span>
              <button onClick={logout}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register">Register</Link>
            </>
          )}
        </div>
      </header>
      <hr style={{ margin: '16px 0' }} />
      <main>{children}</main>
    </div>
  );
}
