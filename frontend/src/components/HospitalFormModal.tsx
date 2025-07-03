'use client';

import { FiEdit2, FiTrash2, FiX } from 'react-icons/fi';
import { useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Hospital } from '@/types/hospital';

interface HospitalFormModalProps {
  hospital: Hospital | null;
  onClose: () => void;
  onSuccess: () => void;
}

export default function HospitalFormModal({ 
  hospital, 
  onClose, 
  onSuccess 
}: HospitalFormModalProps) {
  const [formData, setFormData] = useState({
    name: hospital?.name || '',
    phone: hospital?.phone || '',
    address: hospital?.address || ''
  });
  const [isNameUnique, setIsNameUnique] = useState(true);
  const [isChecking, setIsChecking] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (hospital) {
      setFormData({
        name: hospital.name,
        phone: hospital.phone,
        address: hospital.address,
      });
    }
  }, [hospital]);

  const checkNameUniqueness = async () => {
    if (!formData.name) {
      setIsNameUnique(true);
      return;
    }

    setIsChecking(true);
    try {
      const response = await axios.get('http://localhost:8080/api/hospitals/check-name', {
        params: {
          name: formData.name,
          excludeId: hospital?.id
        }
      });
      setIsNameUnique(response.data.isUnique);
      if (!response.data.isUnique) {
        setErrors(prev => ({ ...prev, name: 'Hospital name already exists' }));
      }
    } catch (error) {
      console.error('Error checking name uniqueness:', error);
      toast.error('Error checking name uniqueness');
    } finally {
      setIsChecking(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone is required';
    } else if (!/^[\d\s+\-()]+$/.test(formData.phone)) {
      newErrors.phone = 'Invalid phone number';
    }
    
    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
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
      if (hospital) {
        // Update existing hospital
        await axios.put(`http://localhost:8080/api/hospitals/${hospital.id}`, formData);
        toast.success('Hospital updated successfully');
      } else {
        // Create new hospital
        await axios.post('http://localhost:8080/api/hospitals', formData);
        toast.success('Hospital created successfully');
      }
      onSuccess();
    } catch (error) {
      console.error('Error saving hospital:', error);
      toast.error('Failed to save hospital');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="flex justify-between items-center border-b p-4">
          <h2 className="text-xl font-semibold">
            {hospital ? 'Edit Hospital' : 'Add New Hospital'}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <FiX size={24} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Hospital Name *
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
              <p className="mt-1 text-sm text-red-600">This hospital name already exists</p>
            )}
            {isChecking && (
              <p className="mt-1 text-sm text-gray-500">Checking name availability...</p>
            )}
          </div>
          
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
              Phone Number *
            </label>
            <input
              type="text"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
                errors.phone ? 'border-red-500' : 'border'
              }`}
            />
            {errors.phone && (
              <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
            )}
          </div>
          
          <div>
            <label htmlFor="address" className="block text-sm font-medium text-gray-700">
              Address *
            </label>
            <input
              type="text"
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
                errors.address ? 'border-red-500' : 'border'
              }`}
            />
            {errors.address && (
              <p className="mt-1 text-sm text-red-600">{errors.address}</p>
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
              {hospital ? 'Update' : 'Create'} Hospital
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}