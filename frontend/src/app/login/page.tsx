'use client';

import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: '', password: '' });
  const [message, setMessage] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:8080/api/auth/login', form);
      setMessage('Welcome ' + res.data.user.name + '!');
      router.push('/dashboard');
    } catch (err: any) {
      setMessage(err.response?.data?.error || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white shadow-md rounded-md w-full max-w-md p-8 text-center">
        <div className="flex justify-center mb-4">
          <img src="/lock-icon.png" alt="Lock Icon" className="h-12 w-12" />
        </div>
        <h1 className="text-2xl font-semibold mb-6">Login</h1>
        <form onSubmit={handleLogin} className="flex flex-col gap-4 text-left">
          <div>
            <label className="block text-sm text-gray-600">Email Address</label>
            <input
              name="email"
              type="email"
              onChange={handleChange}
              className="w-full border-b-2 focus:outline-none py-2"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600">Password</label>
            <input
              name="password"
              type="password"
              onChange={handleChange}
              className="w-full border-b-2 focus:outline-none py-2"
            />
          </div>
          <div className="flex items-center justify-between text-sm mt-1">
            <label className="flex items-center">
              <input
                type="checkbox"
                className="mr-2"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              Remember me
            </label>
            <a href="/forgot-password" className="text-blue-600 hover:underline">
              Forget Password?
            </a>
          </div>
          <button type="submit" className="bg-blue-600 text-white py-2 mt-2 rounded hover:bg-blue-700 transition">
            LOGIN
          </button>
        </form>
        {message && <p className="mt-4 text-sm text-red-500">{message}</p>}
        <p className="mt-6 text-sm text-center">
          Don’t have an account?{' '}
          <a href="/register" className="text-blue-600 hover:underline">
            Register
          </a>
        </p>
      </div>
    </div>
  );
}
