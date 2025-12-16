import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState<string | null>(null);

  function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);

    if (!email.includes('@') || password.length < 4) {
      setError('Invalid email or password too short');
      return;
    }
    const result = register(email.trim(), password, fullName.trim() || undefined);
    if (!result.ok) {
      setError(result.message || 'Registration failed');
      return;
    }
    navigate('/dashboard');
  }
  return (
    <div>
      <h2>Register</h2>
      <form onSubmit={onSubmit} style={{ display: 'grid', gap: '8px', maxWidth: 420 }}>
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
        <label>
          Full Name (optional)
          <input value={fullName} onChange={(e) => setFullName(e.target.value)} type="text" />
        </label>
        {error && <div style={{ color: 'red' }}>{error}</div>}
        <button type="submit">Register</button>
      </form>
      <p style={{ marginTop: 12 }}>
        Already have an account? <Link to="/login">Login here</Link>
      </p>
    </div>
  );
}
