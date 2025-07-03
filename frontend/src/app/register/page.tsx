'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/lib/api-client';

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    email: '',
    password: '',
    role: 'PATIENT', // default role
  });
  const [error, setError] = useState('');
  const [formErrors, setFormErrors] = useState<{ email?: string; password?: string }>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    if (!validate()) return;

    try {
      await apiClient.post('/api/auth/register', form);
      router.push('/login');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-purple-100 to-pink-200 p-4">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-2xl font-semibold mb-6 text-center text-gray-700">Create an Account</h1>
        <form onSubmit={handleRegister} noValidate>
          <label className="block mb-2 text-gray-600">Email</label>
          <input
            type="email"
            name="email"
            className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-pink-400 ${
              formErrors.email ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="you@example.com"
            value={form.email}
            onChange={handleChange}
            required
          />
          {formErrors.email && <p className="text-red-500 text-sm mt-1">{formErrors.email}</p>}

          <label className="block mt-4 mb-2 text-gray-600">Password</label>
          <input
            type="password"
            name="password"
            className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-pink-400 ${
              formErrors.password ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Enter your password"
            value={form.password}
            onChange={handleChange}
            required
          />
          {formErrors.password && <p className="text-red-500 text-sm mt-1">{formErrors.password}</p>}

          <label className="block mt-4 mb-2 text-gray-600">Role</label>
          <select
            name="role"
            value={form.role}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-400"
          >
            <option value="PATIENT">Patient</option>
            <option value="DOCTOR">Doctor</option>
            <option value="ADMIN">Admin</option>
          </select>

          {error && <p className="text-red-600 text-center mt-4">{error}</p>}

          <button
            type="submit"
            className="w-full mt-6 bg-pink-600 text-white py-3 rounded-md hover:bg-pink-700 transition-colors"
          >
            Register
          </button>
        </form>

        <p className="mt-6 text-center text-gray-600">
          Already have an account?{' '}
          <button
            onClick={() => router.push('/login')}
            className="text-pink-600 hover:underline font-semibold focus:outline-none"
          >
            Login here
          </button>
        </p>
      </div>
    </div>
  );
}
