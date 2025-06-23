'use client';

import { useState } from 'react';
import axios from 'axios';

export default function RegisterPage() {
  const [form, setForm] = useState({ name: '', email: '', password: ''});
  const [message, setMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:8080/api/auth/register', form);
      setMessage(res.data.message);
    } catch (err: any) {
      setMessage(err.response?.data?.error || 'Something went wrong');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white shadow-md rounded-md w-full max-w-md p-8 text-center">
        <div className="flex justify-center mb-4">
          <img src="/key-icon.png" alt="Key Icon" className="h-12 w-12" />
        </div>
        <h1 className="text-2xl font-semibold mb-6">Registration</h1>
        <form onSubmit={handleRegister} className="flex flex-col gap-4 text-left">
          <div>
            <label className="block text-sm text-gray-600">Username</label>
            <input
              name="name"
              type="name"
              onChange={handleChange}
              className="w-full border-b-2 focus:outline-none py-2"
            />
          </div>
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
          
          <button type="submit" className="bg-blue-600 text-white py-2 mt-2 rounded hover:bg-blue-700 transition">
            REGISTER
          </button>
        </form>
        {message && <p className="mt-4 text-sm text-red-500">{message}</p>}
        <p className="mt-6 text-sm">
          Already have an account?{' '}
          <a href="/login" className="text-blue-600 hover:underline">
            Login
          </a>
        </p>
      </div>
    </div>
  );
}
