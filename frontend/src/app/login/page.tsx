'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/lib/api-client';

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [formErrors, setFormErrors] = useState<{ email?: string; password?: string }>({});
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validate = () => {
    const errors: { email?: string; password?: string } = {};
    if (!form.email) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      errors.email = 'Invalid email format';
    }
    if (!form.password) {
      errors.password = 'Password is required';
    } else if (form.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    if (!validate()) return;

    try {
      const response = await apiClient.post('/api/auth/login', form);
      const { accessToken, dashboardUrl } = response.data;
      localStorage.setItem('token', accessToken);
      router.push('/admin/dashboards');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-100 to-indigo-200 p-4">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-2xl font-semibold mb-6 text-center text-gray-700">Login to Your Account</h1>
        <form onSubmit={handleLogin} noValidate>
          <label className="block mb-2 text-gray-600">Email</label>
          <input
            type="email"
            name="email"
            className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400 ${
              formErrors.email ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="you@example.com"
            value={form.email}
            onChange={handleChange}
            required
          />
          {formErrors.email && <p className="text-red-500 text-sm mt-1">{formErrors.email}</p>}

          <label className="block mt-4 mb-2 text-gray-600">Password</label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400 ${
                formErrors.password ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter your password"
              value={form.password}
              onChange={handleChange}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3 text-indigo-500 hover:text-indigo-700 focus:outline-none"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>
          {formErrors.password && <p className="text-red-500 text-sm mt-1">{formErrors.password}</p>}

          {error && <p className="text-red-600 text-center mt-4">{error}</p>}

          <button
            type="submit"
            className="w-full mt-6 bg-indigo-600 text-white py-3 rounded-md hover:bg-indigo-700 transition-colors"
          >
            Login
          </button>
        </form>

        <p className="mt-6 text-center text-gray-600">
          Don&apos;t have an account?{' '}
          <button
            onClick={() => router.push('/register')}
            className="text-indigo-600 hover:underline font-semibold focus:outline-none"
          >
            Register here
          </button>
        </p>
      </div>
    </div>
  );
}
