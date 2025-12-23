const API_BASE = import.meta.env.VITE_API_BASE ?? 'http://localhost:3000/api';

export async function apiFetch<T>(path: string, opts?: RequestInit): Promise<T> {
  const userId = localStorage.getItem('studyflow_user_id');

  const res = await fetch(`${API_BASE}${path}`, {
    ...opts,
    headers: {
      'Content-Type': 'application/json',
      ...(userId ? { 'x-user-id': userId } : {}),
      ...(opts?.headers ?? {}),
    },
  });

  if (!res.ok) {
    const msg = await res.text();
    throw new Error(msg || `HTTP ${res.status}`);
  }

  if (res.status === 204) return undefined as T;
  return (await res.json()) as T;
}
