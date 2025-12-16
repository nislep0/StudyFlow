import { useMemo } from 'react';
import { useData } from '../../context/DataContext';

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

function addDaysISO(days: number) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString().slice(0, 10);
}

export function DashboardPage() {
  const { courses, assignments } = useData();
  const stats = useMemo(() => {
    const total = assignments.length;
    const done = assignments.filter((a) => a.status === 'completed').length;
    const inProgress = assignments.filter((a) => a.status !== 'completed').length;
    return { total, done, inProgress };
  }, [assignments]);
  const upcomingAssignments = useMemo(() => {
    const fromDate = todayISO();
    const toDate = addDaysISO(7);
    return assignments
      .filter((a) => a.dueDate)
      .filter((a) => a.status !== 'completed')
      .filter((a) => (a.dueDate as string) >= fromDate && (a.dueDate as string) <= toDate)
      .sort((a, b) => (a.dueDate as string).localeCompare(b.dueDate as string));
  }, [assignments]);
  function courseName(id: string) {
    return courses.find((course) => course.id === id)?.name ?? 'Unknown Course';
  }
  return (
    <div>
      <h2>Dashboard</h2>
      <section style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        <div style={{ border: '1px solid #ccc', padding: 10, borderRadius: 4, minWidth: 120 }}>
          <div style={{ opacity: 0.7 }}>Total Assignments</div>
          <div style={{ fontSize: 24, fontWeight: 'bold' }}>{stats.total}</div>
        </div>
        <div style={{ border: '1px solid #ccc', padding: 10, borderRadius: 4, minWidth: 120 }}>
          <div style={{ opacity: 0.7 }}>Completed</div>
          <div style={{ fontSize: 24, fontWeight: 'bold' }}>{stats.done}</div>
        </div>
        <div style={{ border: '1px solid #ccc', padding: 10, borderRadius: 4, minWidth: 120 }}>
          <div style={{ opacity: 0.7 }}>In Progress</div>
          <div style={{ fontSize: 24, fontWeight: 'bold' }}>{stats.inProgress}</div>
        </div>
      </section>
      <section style={{ marginTop: 20 }}>
        <h3>Upcoming Assignments (Next 7 Days)</h3>
        {upcomingAssignments.length === 0 ? (
          <p style={{ opacity: 0.8 }}>No upcoming assignments in the next 7 days.</p>
        ) : (
          <ul style={{ display: 'grid', gap: 10, paddingLeft: 18 }}>
            {upcomingAssignments.map((assignment) => (
              <li key={assignment.id}>
                <strong>{assignment.title}</strong> for <em>{courseName(assignment.courseId)}</em> -
                Due on {assignment.dueDate}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
