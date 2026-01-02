import type { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <div
      style={{
        fontFamily: 'system-ui, -apple-system, sans-serif',
        minHeight: '100vh',
        backgroundColor: '#f5f5f5',
      }}
    >
      <header
        style={{
          backgroundColor: '#1976d2',
          color: 'white',
          padding: '1rem 2rem',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        }}
      >
        <div
          style={{
            maxWidth: '1200px',
            margin: '0 auto',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
            <h1 style={{ margin: 0, fontSize: '1.5rem' }}>
              <Link to="/" style={{ color: 'white', textDecoration: 'none' }}>
                StudyFlow
              </Link>
            </h1>

            <nav style={{ display: 'flex', gap: '1rem' }}>
              <Link
                to="/"
                style={{
                  color: isActive('/') ? '#ffeb3b' : 'white',
                  textDecoration: 'none',
                  fontWeight: isActive('/') ? 'bold' : 'normal',
                  padding: '0.5rem',
                  borderRadius: '4px',
                  backgroundColor: isActive('/') ? 'rgba(255,255,255,0.1)' : 'transparent',
                }}
              >
                Dashboard
              </Link>
              <Link
                to="/courses"
                style={{
                  color: isActive('/courses') ? '#ffeb3b' : 'white',
                  textDecoration: 'none',
                  fontWeight: isActive('/courses') ? 'bold' : 'normal',
                  padding: '0.5rem',
                  borderRadius: '4px',
                  backgroundColor: isActive('/courses') ? 'rgba(255,255,255,0.1)' : 'transparent',
                }}
              >
                Courses
              </Link>
              <Link
                to="/assignments"
                style={{
                  color: isActive('/assignments') ? '#ffeb3b' : 'white',
                  textDecoration: 'none',
                  fontWeight: isActive('/assignments') ? 'bold' : 'normal',
                  padding: '0.5rem',
                  borderRadius: '4px',
                  backgroundColor: isActive('/assignments')
                    ? 'rgba(255,255,255,0.1)'
                    : 'transparent',
                }}
              >
                Assignments
              </Link>
            </nav>
          </div>

          <div style={{ fontSize: '0.9rem', opacity: 0.9 }}>Lab #4: Database Integration</div>
        </div>
      </header>

      <main
        style={{
          maxWidth: '1200px',
          margin: '2rem auto',
          padding: '0 1rem',
        }}
      >
        {children}
      </main>

      <footer
        style={{
          marginTop: '3rem',
          padding: '1rem',
          textAlign: 'center',
          color: '#666',
          fontSize: '0.9rem',
          borderTop: '1px solid #ddd',
        }}
      >
        <p>StudyFlow © 2024 - Laboratory Work #4 - Database Integration</p>
      </footer>
    </div>
  );
}
