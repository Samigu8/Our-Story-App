import { useMemo, useState } from 'react';
import { API_URL } from '../services/api';
import { AuthContext } from './auth.js';

const TOKEN_KEY = 'our-story-token';

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY));

  const login = async (email, password) => {
    const response = await fetch(`${API_URL}/auth/login`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password }) });
    const payload = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(payload.message || 'Unable to sign in.');
    localStorage.setItem(TOKEN_KEY, payload.token);
    setToken(payload.token);
  };

  const register = async (email, password) => {
    const response = await fetch(`${API_URL}/auth/register`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password }) });
    const payload = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(payload.message || 'Unable to create account.');
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
  };

  const value = useMemo(() => ({ token, isAuthenticated: Boolean(token), login, register, logout }), [token]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}