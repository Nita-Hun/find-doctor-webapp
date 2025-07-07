'use client';

import { useEffect, useState } from 'react';
import { apiClient } from '@/lib/api-client';
import toast from 'react-hot-toast';
import { Doctor, DoctorFormModalProps } from '@/types/DoctorDto';
import { FiX } from 'react-icons/fi';

const statusOptions = [
  { value: 'ACTIVE', label: 'Active' },
  { value: 'INACTIVE', label: 'Inactive' },
];

export default function DoctorFormModal({ doctor, onClose, onSuccess }: DoctorFormModalProps) {
  const [formData, setFormData] = useState<Doctor>({
    firstname: '',
    lastname: '',
    status: 'ACTIVE',
    hospitalId: 0,
    specializationId: 0,
  });

  const [hospitals, setHospitals] = useState<{ id: number; name: string }[]>([]);
  const [specializations, setSpecializations] = useState<{ id: number; name: string }[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
  async function fetchDropdownData() {
    try {
      const [hospitalsRes, specializationsRes] = await Promise.all([
        apiClient.get('/api/hospitals'),
        apiClient.get('/api/specializations')
      ]);

      const hospitalsData = hospitalsRes.data;
      const specializationsData = specializationsRes.data;

      setHospitals(Array.isArray(hospitalsData) ? hospitalsData : hospitalsData.content ?? []);

      if (Array.isArray(specializationsData)) {
        setSpecializations(specializationsData);
      } else if (Array.isArray(specializationsData.content)) {
        setSpecializations(specializationsData.content);
      } else {
        setSpecializations([]);
      }

      if (doctor) {
        setFormData({
          firstname: doctor.firstname,
          lastname: doctor.lastname,
          status: doctor.status,
          hospitalId: doctor.hospitalId,
          specializationId: doctor.specializationId
        });
      }
    } catch (error) {
      console.error('Error loading dropdown data:', error);
      toast.error('Failed to load form data');
    }
  }

  fetchDropdownData();
}, [doctor]);


  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: name.endsWith('Id') ? parseInt(value, 10) || 0 : value 
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.firstname || !formData.lastname || !formData.hospitalId || !formData.specializationId) {
      toast.error('Please fill all required fields');
      return;
    }

    setLoading(true);

    try {
      if (doctor?.id) {
        await apiClient.put(`/api/doctors/${doctor.id}`, formData);
        toast.success('Doctor updated successfully');
      } else {
        await apiClient.post('/api/doctors', formData);
        toast.success('Doctor created successfully');
      }
      onSuccess();
    } catch (error) {
      console.error('Error saving doctor:', error);
      toast.error('Failed to save doctor');
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
                {doctor ? 'Edit Doctor' : 'Add New Doctor'}
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

          {/* Hospital */}
          <div>
            <label htmlFor="hospital" className="block font-medium mb-1">
              Hospital <span className="text-red-600">*</span>
            </label>
            <select
              id="hospital"
              name="hospitalId"
              value={formData.hospitalId}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
              required
            >
              <option value={0} disabled>
                Select hospital
              </option>
              {hospitals.map(h => (
                <option key={h.id} value={h.id}>{h.name}</option>
              ))}
            </select>
          </div>

          {/* Specialization */}
          <div>
            <label htmlFor="specialization" className="block font-medium mb-1">
              Specialization <span className="text-red-600">*</span>
            </label>
            <select
              id="specialization"
              name="specializationId"
              value={formData.specializationId}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
              required
            >
              <option value={0} disabled>
                Select specialization
              </option>
              {specializations.map(s => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
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
                  {doctor ? 'Updating...' : 'Creating...'}
                </span>
              ) : (
                doctor ? 'Update Doctor' : 'Create'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}