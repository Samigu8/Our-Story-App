import { useState } from 'react';
import { LogIn, UserPlus, LoaderCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/auth.js';

export default function Login() {
  const navigate = useNavigate();
  const { login, register } = useAuth();
  const [isRegistering, setIsRegistering] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({ email: '', password: '' });

  const submit = async (event) => {
    event.preventDefault();
    const email = form.email.trim();
    if (!email || !form.password) return toast.error('Email and password are required.');
    if (form.password.length < 8) return toast.error('Password must be at least 8 characters.');
    try {
      setIsSubmitting(true);
      if (isRegistering) {
        await register(email, form.password);
        await login(email, form.password);
        toast.success('Account created.');
      } else {
        await login(email, form.password);
        toast.success('Welcome back.');
      }
      navigate('/timeline');
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="min-h-screen bg-gradient-to-b from-pink-50 via-white to-blue-50 px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-md rounded-2xl bg-white p-6 shadow-md sm:p-8">
        <div className="mb-8 text-center"><h1 className="text-3xl font-semibold text-gray-900">{isRegistering ? 'Create your account' : 'Welcome back'}</h1><p className="mt-2 text-gray-600">Sign in to manage your private story.</p></div>
        <form onSubmit={submit} className="space-y-4">
          <label className="block text-sm font-medium text-gray-700">Email<input className="mt-1 w-full rounded-xl border border-gray-300 p-3" type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} autoComplete="email" /></label>
          <label className="block text-sm font-medium text-gray-700">Password<input className="mt-1 w-full rounded-xl border border-gray-300 p-3" type="password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} autoComplete={isRegistering ? 'new-password' : 'current-password'} /></label>
          <button type="submit" disabled={isSubmitting} className="flex w-full items-center justify-center gap-2 rounded-xl bg-pink-500 px-5 py-3 font-medium text-white hover:bg-pink-600 disabled:bg-pink-300">{isSubmitting ? <LoaderCircle className="h-5 w-5 animate-spin" /> : isRegistering ? <UserPlus className="h-5 w-5" /> : <LogIn className="h-5 w-5" />}{isSubmitting ? 'Working...' : isRegistering ? 'Create account' : 'Sign in'}</button>
        </form>
        <button type="button" onClick={() => setIsRegistering(!isRegistering)} className="mt-5 w-full text-sm text-pink-600 hover:text-pink-700">{isRegistering ? 'Already have an account? Sign in' : 'Need an account? Create one'}</button>
      </div>
    </section>
  );
}