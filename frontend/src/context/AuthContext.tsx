import React, { createContext, useState, useContext, useMemo } from 'react';
import { storage } from '../data/storage';
import type { User } from '../types/domain';

type AuthContextValue = {
  user: User | null;
  login: (email: string, password: string) => { ok: true } | { ok: false; message: string };
  register: (
    email: string,
    password: string,
    fullName?: string,
  ) => { ok: true } | { ok: false; message: string };
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

function getId(prefix: string) {
  return `${prefix}_${Math.random().toString(36).slice(2)}_${Date.now()}`;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [auth, setAuth] = useState(() => storage.getAuth());
  const user = useMemo(() => {
    if (!auth.userId) return null;
    return storage.getUsers().find((u) => u.id === auth.userId) ?? null;
  }, [auth.userId]);
  function login(email: string, password: string) {
    const users = storage.getUsers().find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (!users || users.password !== password)
      return { ok: false as const, message: 'Invalid email or password' };
    const newAuth = { userId: users.id };
    storage.setAuth(newAuth);
    setAuth(newAuth);
    localStorage.setItem('studyflow_user_id', users.id);

    return { ok: true as const };
  }
  function register(email: string, password: string, fullName?: string) {
    const users = storage.getUsers();
    const exists = users.some((u) => u.email.toLowerCase() === email.toLowerCase());
    if (exists) return { ok: false as const, message: 'Email is already registered' };
    const newUser: User = {
      id: getId('u'),
      email,
      password,
      fullName,
    };
    storage.setUsers([...users, newUser]);
    const newAuth = { userId: newUser.id };
    storage.setAuth(newAuth);
    setAuth(newAuth);
    localStorage.setItem('studyflow_user_id', newUser.id);
    return { ok: true as const };
  }
  function logout() {
    storage.setAuth({ userId: null });
    setAuth({ userId: null });
    localStorage.removeItem('studyflow_user_id');
  }
  const value: AuthContextValue = {
    user,
    login,
    register,
    logout,
  };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
}
