'use client';

import { useEffect, useState } from 'react';
import { apiClient } from '@/lib/api-client';
import toast from 'react-hot-toast';
import { Patient, PatientFormModalProps } from '@/types/Patient';
import { FiX } from 'react-icons/fi';

const statusOptions = [
  { value: 'ACTIVE', label: 'Active' },
  { value: 'INACTIVE', label: 'Inactive' },
  { value: 'PENDING', label: 'Pending' },
];

const genderOptions = [
  { value: 'MALE', label: 'Male' },
  { value: 'FEMALE', label: 'Female' },
  { value: 'OTHER', label: 'Other' },
];

export default function PatientFormModal({ patient, onClose, onSuccess }: PatientFormModalProps) {
  const [formData, setFormData] = useState<Patient>({
    firstname: '',
    lastname: '',
    status: 'ACTIVE',
    gender: 'MALE',
    dateOfBirth: '',
    address: ''
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (patient) {
      setFormData({
        ...patient,
        dateOfBirth: patient.dateOfBirth ? patient.dateOfBirth.split('T')[0] : ''
      });
    }
  }, [patient]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.firstname || !formData.lastname || !formData.dateOfBirth || !formData.address) {
      toast.error('Please fill all required fields');
      return;
    }

    setLoading(true);

    try {
      const data = {
        ...formData,
        dateOfBirth: formData.dateOfBirth ? `${formData.dateOfBirth}T00:00:00` : null
      };

      if (patient?.id) {
        await apiClient.put(`/api/patients/${patient.id}`, data);
        toast.success('Patient updated successfully');
      } else {
        await apiClient.post('/api/patients', data);
        toast.success('Patient created successfully');
      }
      onSuccess();
    } catch (error) {
      console.error('Error saving patient:', error);
      toast.error('Failed to save patient');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 relative">
            {/* Modified header section to match first modal */}
            <div className="flex justify-between items-center border-b pb-4 mb-4">
              <h2 className="text-xl font-semibold">
                {patient ? 'Edit Patient' : 'Add New Patient'}
              </h2>
              <button 
                onClick={onClose} 
                className="text-gray-500 hover:text-gray-700"
              >
                <FiX size={24} />
              </button>
            </div>
        <form onSubmit={handleSubmit} className="space-y-4 text-sm" noValidate>
          {/* First Name */}
          <div>
            <label htmlFor="firstname" className="block font-medium mb-1">
              First Name <span className="text-red-600">*</span>
            </label>
            <input
              id="firstname"
              type="text"
              name="firstname"
              value={formData.firstname}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
              required
            />
          </div>

          {/* Last Name */}
          <div>
            <label htmlFor="lastname" className="block font-medium mb-1">
              Last Name <span className="text-red-600">*</span>
            </label>
            <input
              id="lastname"
              type="text"
              name="lastname"
              value={formData.lastname}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
              required
            />
          </div>

          {/* Status */}
          <div>
            <label htmlFor="status" className="block font-medium mb-1">
              Status <span className="text-red-600">*</span>
            </label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
              required
            >
              {statusOptions.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>

          {/* Gender */}
          <div>
            <label htmlFor="gender" className="block font-medium mb-1">
              Gender <span className="text-red-600">*</span>
            </label>
            <select
              id="gender"
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
              required
            >
              {genderOptions.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>

          {/* Date of Birth */}
          <div>
            <label htmlFor="dateOfBirth" className="block font-medium mb-1">
              Date of Birth <span className="text-red-600">*</span>
            </label>
            <input
              id="dateOfBirth"
              type="date"
              name="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={handleChange}
              max={new Date().toISOString().split('T')[0]}
              className="w-full border border-gray-300 rounded px-3 py-2"
              required
            />
          </div>

          {/* Address */}
          <div>
            <label htmlFor="address" className="block font-medium mb-1">
              Address <span className="text-red-600">*</span>
            </label>
            <textarea
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              rows={3}
              className="w-full border border-gray-300 rounded px-3 py-2"
              required
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
                  {patient ? 'Updating...' : 'Creating...'}
                </span>
              ) : (
                patient ? 'Update Patient' : 'Create'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}