import React, { useMemo, useState } from 'react';
import { useData } from '../../context/DataContext';
import type { AssignmentStatus, Priority } from '../../types/domain';

export function AssignmentsPage() {
  const {
    courses,
    assignments,
    addAssignment,
    updateAssignment,
    deleteAssignment,
    isLoading,
    error,
  } = useData();
  const [courseId, setCourseId] = useState<string>('');
  const [title, setTitle] = useState('');
  const [dueDate, setDueDate] = useState<string>('');
  const [priority, setPriority] = useState<Priority>('medium');

  const [statusFilter, setStatusFilter] = useState<AssignmentStatus | 'all'>('all');
  const [courseFilter, setCourseFilter] = useState<string>('all');
  const filteredAssignments = useMemo(() => {
    return assignments
      .filter((assignment) =>
        courseFilter === 'all' ? true : assignment.courseId === courseFilter,
      )
      .filter((assignment) => (statusFilter === 'all' ? true : assignment.status === statusFilter))
      .sort((a, b) => (a.dueDate ?? '9999-12-31').localeCompare(b.dueDate ?? '9999-12-31'));
  }, [assignments, courseFilter, statusFilter]);

  async function onAddAssignment(e: React.FormEvent) {
    e.preventDefault();
    if (!courseId || !title.trim()) return;
    try {
      await addAssignment({
        courseId,
        title: title.trim(),
        dueDate: dueDate || undefined,
        priority,
      });
      setTitle('');
      setDueDate('');
      setPriority('medium');
    } catch (e: unknown) {
      console.error(e);
    }
  }
  function courseName(id: string) {
    return courses.find((course) => course.id === id)?.name ?? 'Unknown Course';
  }
  return (
    <div>
      <h2>Assignments</h2>
      {isLoading && <p style={{ opacity: 0.8 }}>Loading...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <section style={{ marginBottom: 20 }}>
        <h3>Add Assignment</h3>
        {courses.length === 0 ? (
          <p style={{ opacity: 0.8 }}>Please add a course before adding assignments.</p>
        ) : (
          <form onSubmit={onAddAssignment} style={{ display: 'grid', gap: 10, maxWidth: 640 }}>
            <label>
              Course
              <select value={courseId} onChange={(e) => setCourseId(e.target.value)}>
                <option value="">Select a course</option>
                {courses.map((course) => (
                  <option key={course.id} value={course.id}>
                    {course.name}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Title
              <input value={title} onChange={(e) => setTitle(e.target.value)} />
            </label>
            <label>
              Due Date
              <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
            </label>
            <label>
              Priority
              <select value={priority} onChange={(e) => setPriority(e.target.value as Priority)}>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </label>
            <button type="submit">Add Assignment</button>
          </form>
        )}
      </section>
      <section style={{ marginBottom: 18 }}>
        <h3>Filter Assignments</h3>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <label>
            Course
            <select value={courseFilter} onChange={(e) => setCourseFilter(e.target.value)}>
              <option value="all">All Courses</option>
              {courses.map((course) => (
                <option key={course.id} value={course.id}>
                  {course.name}
                </option>
              ))}
            </select>
          </label>
          <label>
            Status
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as AssignmentStatus | 'all')}
            >
              <option value="all">All Statuses</option>
              <option value="planned">Planned</option>
              <option value="in_progress">In Progress</option>
              <option value="done">Done</option>
            </select>
          </label>
        </div>
      </section>
      <section>
        <h3>Existing Assignments</h3>
        {filteredAssignments.length === 0 ? (
          <p style={{ opacity: 0.8 }}>No assignments match the selected filters.</p>
        ) : (
          <ul style={{ display: 'grid', gap: 10, paddingLeft: 18 }}>
            {filteredAssignments.map((assignment) => (
              <li key={assignment.id}>
                <div style={{ display: 'grid', gap: 6 }}>
                  <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
                    <strong>{assignment.title}</strong>
                    <span style={{ opacity: 0.7 }}>({courseName(assignment.courseId)})</span>
                    {assignment.dueDate && <span>Due: {assignment.dueDate.slice(0, 10)}</span>}
                    <span>Priority: {assignment.priority}</span>
                  </div>
                  <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
                    <label>
                      Status
                      <select
                        value={assignment.status}
                        onChange={(e) =>
                          updateAssignment(assignment.id, {
                            status: e.target.value as AssignmentStatus,
                          })
                        }
                      >
                        <option value="planned">Planned</option>
                        <option value="in_progress">In Progress</option>
                        <option value="done">Done</option>
                      </select>
                    </label>
                    <button onClick={() => deleteAssignment(assignment.id)}>Delete</button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
