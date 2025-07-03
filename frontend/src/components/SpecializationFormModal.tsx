'use client';

import { useEffect, useState } from 'react';
import { apiClient } from '@/lib/api-client';
import toast from 'react-hot-toast';
import { FiX } from 'react-icons/fi';
import { Specialization } from '@/types/specialization';

interface SpecializationFormModalProps {
  specialization: Specialization | null;
  onClose: () => void;
  onSuccess: () => void;
}

export default function SpecializationFormModal({ 
  specialization, 
  onClose, 
  onSuccess 
}: SpecializationFormModalProps) {
  const [formData, setFormData] = useState({
    name: specialization?.name || ''
  });
  const [isNameUnique, setIsNameUnique] = useState(true);
  const [isChecking, setIsChecking] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (specialization) {
      setFormData({
        name: specialization.name,
      });
    }
  }, [specialization]);

  const checkNameUniqueness = async () => {
    if (!formData.name.trim()) {
      setIsNameUnique(true);
      return;
    }

    setIsChecking(true);
    try {
      const response = await apiClient.get('/api/specializations/check-name', {
        params: {
          name: formData.name.trim(),
          excludeId: specialization?.id
        }
      });
      setIsNameUnique(response.data.isUnique);
      if (!response.data.isUnique) {
        setErrors(prev => ({ ...prev, name: 'Specialization name already exists' }));
      } else {
        setErrors(prev => ({ ...prev, name: '' }));
      }
    } catch (error) {
      console.error('Error checking name uniqueness:', error);
      toast.error('Error checking name uniqueness');
    } finally {
      setIsChecking(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (name === 'name') {
      setIsNameUnique(true);
      setErrors(prev => ({ ...prev, name: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.trim().length < 3) {
      newErrors.name = 'Name must be at least 3 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    if (!isNameUnique && !isChecking) {
      await checkNameUniqueness();
      return;
    }
    if (!isNameUnique) return;

    try {
      if (specialization) {
        // Update existing specialization
        await apiClient.put(`/api/specializations/${specialization.id}`, formData);
        toast.success('Specialization updated successfully');
      } else {
        // Create new specialization
        await apiClient.post('/api/specializations', formData);
        toast.success('Specialization created successfully');
      }
      onSuccess();
    } catch (error) {
      console.error('Error saving specialization:', error);
      toast.error('Failed to save specialization');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="flex justify-between items-center border-b p-4">
          <h2 className="text-xl font-semibold">
            {specialization ? 'Edit Specialization' : 'Add New Specialization'}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <FiX size={24} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Specialization Name *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              onBlur={checkNameUniqueness}
              className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
                errors.name || !isNameUnique ? 'border-red-500' : 'border'
              }`}
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name}</p>
            )}
            {!isNameUnique && !errors.name && (
              <p className="mt-1 text-sm text-red-600">This specialization name already exists</p>
            )}
            {isChecking && (
              <p className="mt-1 text-sm text-gray-500">Checking name availability...</p>
            )}
          </div>

          
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isChecking}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {specialization ? 'Update' : 'Create'} Specialization
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}