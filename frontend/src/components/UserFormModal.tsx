'use client';

import { useEffect, useState, useRef } from 'react';
import { apiClient } from '@/lib/api-client';
import toast from 'react-hot-toast';
import { User, UserFormModalProps } from '@/types/UserDto';
import { FiX } from 'react-icons/fi';

const roleOptions = [
  { value: 'ADMIN', label: 'Admin' },
  { value: 'DOCTOR', label: 'Doctor' },
  { value: 'PATIENT', label: 'Patient' },
];

// Base backend URL from env or fallback
const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8080';

// Helper to normalize URLs (makes relative URLs absolute)
function normalizeUrl(url?: string | null) {
  if (!url) return '';
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  return backendUrl + url;
}

export default function UserFormModal({ user, onClose, onSuccess }: UserFormModalProps) {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'PATIENT',
    profilePhotoUrl: '',
  });
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) return;
    const file = e.target.files[0];

    if (file.size > 2 * 1024 * 1024) {
      toast.error('File too large (max 2MB).');
      return;
    }

    if (!file.type.startsWith('image/')) {
      toast.error('Invalid file type. Please select an image.');
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('You must be logged in.');
      return;
    }

    setUploading(true);

    const formDataUpload = new FormData();
    formDataUpload.append('file', file);

    try {
      const response = await apiClient.post(
        '/api/auth/upload-profile-photo',
        formDataUpload,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const url = response.data.profilePhotoUrl;
      setFormData(prev => ({
        ...prev,
        profilePhotoUrl: url,
      }));
      toast.success('Profile photo uploaded!');
    } catch (err: any) {
      console.error('Upload error:', err);
      toast.error(err.response?.data?.message || err.message);
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.email || (!user?.id && !formData.password)) {
      toast.error('Please fill all required fields');
      return;
    }

    setLoading(true);

    try {
      const data: Record<string, any> = {
        email: formData.email,
        role: formData.role,
      };

      if (!user?.id) {
        // New user creation requires password
        data.password = formData.password;
      } else if (formData.password) {
        // Optional: update password
        data.password = formData.password;
      }

      // Normalize URLs before comparing
      const normalizedFormPhotoUrl = normalizeUrl(formData.profilePhotoUrl);
      const normalizedUserPhotoUrl = normalizeUrl(user?.profilePhotoUrl);

      console.log('Current user.profilePhotoUrl:', normalizedUserPhotoUrl);
      console.log('Form photo URL:', normalizedFormPhotoUrl);
      console.log('Include photo URL in request?', normalizedFormPhotoUrl !== normalizedUserPhotoUrl);

      // ONLY include profilePhotoUrl if it changed (based on normalized URLs)
      if (
        formData.profilePhotoUrl &&
        normalizedFormPhotoUrl !== normalizedUserPhotoUrl
      ) {
        data.profilePhotoUrl = formData.profilePhotoUrl;
      }

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

          {/* Profile Photo Upload */}
          <div>
            <label className="block font-medium mb-1">
              Profile Photo
            </label>
            <div className="flex items-center gap-3">
              {formData.profilePhotoUrl ? (
                <img
                  src={`${formData.profilePhotoUrl}`}
                  alt="Profile"
                  className="w-12 h-12 rounded-full object-cover border"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                  N/A
                </div>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 text-sm"
              >
                {uploading ? 'Uploading...' : 'Upload Photo'}
              </button>
            </div>
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
