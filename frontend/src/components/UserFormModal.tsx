'use client';

import { useEffect, useState } from 'react';
import { apiClient } from '@/lib/api-client';
import toast from 'react-hot-toast';
import { User, UserFormModalProps } from '@/types/UserDto';
import { FiX } from 'react-icons/fi';

const roleOptions = [
  { value: 'ADMIN', label: 'Admin' },
  { value: 'DOCTOR', label: 'Doctor' },
  { value: 'PATIENT', label: 'Patient' },
];

export default function UserFormModal({ user, onClose, onSuccess }: UserFormModalProps) {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'PATIENT',
    profilePhotoUrl: '',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        email: user.email,
        password: '',
        role: user.role,
        profilePhotoUrl: user.profilePhotoUrl || '',
      });
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.email || (!user?.id && !formData.password)) {
      toast.error('Please fill all required fields');
      return;
    }

    setLoading(true);

    try {
      const data = {
        ...formData,
        profilePhotoUrl: formData.profilePhotoUrl || null
      };

      if (user?.id) {
        await apiClient.put(`/api/users/${user.id}`, data);
        toast.success('User updated successfully');
      } else {
        await apiClient.post('/api/users', data);
        toast.success('User created successfully');
      }
      onSuccess();
    } catch (error) {
      console.error('Error saving user:', error);
      toast.error('Failed to save user');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 relative">
        <div className="flex justify-between items-center border-b pb-4 mb-4">
                  <h2 className="text-xl font-semibold">
                    {user ? 'Edit User' : 'Add New User'}
                  </h2>
                  <button 
                    onClick={onClose} 
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <FiX size={24} />
                  </button>
                </div>
        <form onSubmit={handleSubmit} className="space-y-4 text-sm" noValidate>
          {/* Email */}
          <div>
            <label htmlFor="email" className="block font-medium mb-1">
              Email <span className="text-red-600">*</span>
            </label>
            <input
              id="email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
              required
            />
          </div>

          {/* Password */}
          {!user?.id && (
            <div>
              <label htmlFor="password" className="block font-medium mb-1">
                Password <span className="text-red-600">*</span>
              </label>
              <input
                id="password"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2"
                required
              />
            </div>
          )}

          {/* Role */}
          <div>
            <label htmlFor="role" className="block font-medium mb-1">
              Role <span className="text-red-600">*</span>
            </label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
              required
            >
              {roleOptions.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>

          {/* Profile Photo */}
          <div>
            <label htmlFor="profilePhotoUrl" className="block font-medium mb-1">
              Profile Photo URL
            </label>
            <input
              id="profilePhotoUrl"
              type="text"
              name="profilePhotoUrl"
              value={formData.profilePhotoUrl}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
              placeholder="https://example.com/photo.jpg"
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {user ? 'Updating...' : 'Creating...'}
                </span>
              ) : (
                user ? 'Update User' : 'Create'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}