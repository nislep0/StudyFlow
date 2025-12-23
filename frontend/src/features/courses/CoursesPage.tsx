import React, { useMemo, useState } from 'react';
import { useData } from '../../context/DataContext';

export function CoursesPage() {
  const { courses, addCourse, updateCourse, deleteCourse, isLoading, error } = useData();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [editingCourseId, setEditingCourseId] = useState<string | null>(null);
  const editingCourse = useMemo(
    () => courses.find((course) => course.id === editingCourseId) ?? null,
    [editingCourseId, courses],
  );

  async function onAddCourse(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    try {
      await addCourse(name.trim(), description.trim() || undefined);
      setName('');
      setDescription('');
    } catch (e: unknown) {
      console.error(e);
    }
  }
  function startEditCourse(id: string) {
    setEditingCourseId(id);
  }
  async function applyEditCourse() {
    if (!editingCourse) return;
    try {
      await updateCourse(editingCourse.id, {
        name: editingCourse.name,
        description: editingCourse.description,
      });
      setEditingCourseId(null);
    } catch (e: unknown) {
      console.error(e);
    }
  }
  return (
    <div>
      <h2>Courses</h2>
      {isLoading && <p style={{ opacity: 0.8 }}>Loading...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <section style={{ marginBottom: 20 }}>
        <h3>Add Course</h3>
        <form onSubmit={onAddCourse} style={{ display: 'grid', gap: 10, maxWidth: 520 }}>
          <label>
            Name
            <input value={name} onChange={(e) => setName(e.target.value)} required />
          </label>
          <label>
            Description
            <input value={description} onChange={(e) => setDescription(e.target.value)} />
          </label>
          <button type="submit">Add Course</button>
        </form>
      </section>
      <section>
        <h3>Existing Courses</h3>
        {courses.length === 0 ? (
          <p style={{ opacity: 0.8 }}>No courses available.</p>
        ) : (
          <ul style={{ display: 'grid', gap: 10, paddingLeft: 18 }}>
            {courses.map((course) => (
              <li
                key={course.id}
                style={{ border: '1px solid #ccc', padding: 10, borderRadius: 4 }}
              >
                <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
                  <strong>{course.name}</strong>
                  <span style={{ opacity: 0.7 }}>{course.description}</span>
                  <button onClick={() => startEditCourse(course.id)}>Edit</button>
                  <button onClick={() => deleteCourse(course.id)}>Delete</button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
      {editingCourse && (
        <section style={{ marginTop: 20, padding: 12, border: '1px solid #666', borderRadius: 4 }}>
          <h3>Edit Course</h3>
          <div style={{ display: 'grid', gap: 10, maxWidth: 520 }}>
            <label>
              Name
              <input
                value={editingCourse.name}
                onChange={(e) => updateCourse(editingCourse.id, { name: e.target.value })}
                required
              />
            </label>
            <label>
              Description
              <input
                value={editingCourse.description ?? ''}
                onChange={(e) => updateCourse(editingCourse.id, { description: e.target.value })}
              />
            </label>
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={applyEditCourse}>Apply</button>
              <button onClick={() => setEditingCourseId(null)}>Cancel</button>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
