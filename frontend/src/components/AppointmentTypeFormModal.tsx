'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';
import { AppointmentType } from '@/types/appointment-type';
import FormInputField from './FormInputField';
import { apiClient } from '@/lib/api-client';

export default function AppointmentTypeFormModal({
  appointmentType,
  onClose,
  onSuccess
}: {
  appointmentType: AppointmentType | null;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [form, setForm] = useState<AppointmentType>(
    appointmentType || { name: '', price: 0 }
  );
  const [nameError, setNameError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!form.name.trim()) {
      setNameError('Name is required');
      return;
    }
    setNameError('');

    setIsSubmitting(true);
    
    try {
      if (appointmentType?.id) {
        // Update existing
        await apiClient.put(`/api/appointment-types/${appointmentType.id}`, form);
        toast.success('Appointment type updated');
      } else {
        // Create new
        await apiClient.post('/api/appointment-types', form);
        toast.success('Appointment type created');
      }
      
      onSuccess(); // This should close the modal and refresh data
      onClose();
    } catch (error: any) {
      console.error('Submission error:', error);
      
      // Show detailed error message
      const errorMessage = error.response?.data?.message 
        || error.message 
        || 'Failed to save appointment type';
      
      toast.error(errorMessage);
      
      // Handle duplicate name error specifically
      if (error.response?.data?.error?.includes('unique')) {
        setNameError('This name already exists');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">
          {appointmentType?.id ? 'Edit' : 'Add'} Appointment Type
        </h2>
        
        <form onSubmit={handleSubmit}>
          <FormInputField
            label="Name"
            value={form.name}
            onChange={(value) => {
              setForm({...form, name: value});
              setNameError(''); // Clear error when typing
            }}
            error={nameError}
            required
          />
          
          <FormInputField
            label="Price"
            type="number"
            value={form.price.toString()}
            onChange={(value) => setForm({
              ...form, 
              price: Math.max(0, parseFloat(value) || 0
              )
            })}
            step="0.01"
            min="0"
            required
          />

          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`px-4 py-2 rounded-md text-sm font-medium text-white ${
                isSubmitting 
                  ? 'bg-blue-400 cursor-not-allowed' 
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" 
                    xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </span>
              ) : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}