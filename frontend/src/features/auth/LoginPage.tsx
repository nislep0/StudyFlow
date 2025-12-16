import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('demo@studyflow.local');
  const [password, setPassword] = useState('demo1234');
  const [error, setError] = useState<string | null>(null);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const result = login(email.trim(), password);
    if (!result.ok) {
      setError(result.message || 'Login failed');
      return;
    }
    navigate('/dashboard');
  }
  return (
    <div>
      <h2>Login to StudyFlow</h2>
      <form onSubmit={onSubmit} style={{ display: 'flex', gap: 8, maxWidth: 420 }}>
        <label>
          Email
          <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" required />
        </label>
        <label>
          Password
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            required
          />
        </label>
        {error && <div style={{ color: 'red' }}>{error}</div>}
        <button type="submit">Login</button>
      </form>
      <p style={{ marginTop: 12 }}>
        Don&apos;t have an account? <Link to="/register">Register here</Link>
      </p>
    </div>
  );
}
