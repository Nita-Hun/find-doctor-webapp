'use client';

import { useState, useEffect } from 'react';
import { apiClient } from '@/lib/api-client';
import toast from 'react-hot-toast';
import { FiX } from 'react-icons/fi';
import { FeedbackFormModalProps } from '@/types/Feedback';
import { AppointmentDto } from '@/types/Appointment';

export default function FeedbackFormModal({
  feedback,
  appointments,
  onClose,
  onSuccess
}: FeedbackFormModalProps & { appointments: AppointmentDto[] }) {
  const [formData, setFormData] = useState({
    rating: feedback?.rating || 5,
    comment: feedback?.comment || '',
    appointmentId: feedback?.appointmentId || (appointments.length > 0 ? appointments[0].id : 0)
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [appointmentOptions, setAppointmentOptions] = useState<{ id: number; label: string }[]>([]);

  useEffect(() => {
    // Initialize default appointment if none selected
    if (appointments.length > 0 && formData.appointmentId === 0) {
      setFormData(prev => ({ ...prev, appointmentId: appointments[0].id }));
    }

    // Map appointment options
    const options = appointments.map(appt => {
      const doctor = appt.doctorName || 'Unknown Doctor';
      const type = appt.appointmentTypeName || 'Appointment';
      const dateObj = new Date(appt.dateTime);
      const date = dateObj.toLocaleDateString();
      const time = dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      return {
        id: appt.id,
        label: `${doctor} — ${type} on ${date} at ${time}`
      };
    });

    setAppointmentOptions(options);
  }, [appointments, formData.appointmentId]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: field === 'rating' || field === 'appointmentId' ? parseInt(value) : value
    }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (formData.rating < 1 || formData.rating > 5) newErrors.rating = 'Rating must be between 1-5';
    if (!formData.comment.trim()) newErrors.comment = 'Comment is required';
    if (!formData.appointmentId) newErrors.appointmentId = 'Appointment is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      if (feedback?.id) {
        await apiClient.put(`/api/feedbacks/${feedback.id}`, formData);
        toast.success('Feedback updated successfully');
      } else {
        await apiClient.post('/api/feedbacks', formData);
        toast.success('Feedback created successfully');
      }
      onSuccess();
    } catch (error) {
      console.error('Error saving feedback:', error);
      toast.error('Failed to save feedback');
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (rating: number) => {
    return '★'.repeat(rating) + '☆'.repeat(5 - rating);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 relative">
        <div className="flex justify-between items-center border-b pb-4 mb-4">
          <h2 className="text-xl font-semibold">
            {feedback?.id ? 'Edit Feedback' : 'Add New Feedback'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
            disabled={loading}
          >
            <FiX size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-sm">
          {/* Rating Field */}
          <div>
            <label htmlFor="rating" className="block font-medium mb-1">
              Rating <span className="text-red-600">*</span>
            </label>
            <select
              id="rating"
              value={formData.rating}
              onChange={(e) => handleInputChange('rating', e.target.value)}
              className={`w-full border ${errors.rating ? 'border-red-500' : 'border-gray-300'} rounded px-3 py-2`}
              required
            >
              {[1, 2, 3, 4, 5].map((rating) => (
                <option key={rating} value={rating}>
                  {renderStars(rating)} ({rating}/5)
                </option>
              ))}
            </select>
            {errors.rating && (
              <p className="text-red-500 text-xs mt-1">{errors.rating}</p>
            )}
          </div>

          {/* Appointment Field */}
          <div>
            <label htmlFor="appointment" className="block font-medium mb-1">
              Appointment <span className="text-red-600">*</span>
            </label>
            <select
              id="appointment"
              value={formData.appointmentId}
              onChange={(e) => handleInputChange('appointmentId', e.target.value)}
              className={`w-full border ${errors.appointmentId ? 'border-red-500' : 'border-gray-300'} rounded px-3 py-2`}
              required
            >
              {appointmentOptions.map((appt) => (
                <option key={appt.id} value={appt.id}>
                  {appt.label}
                </option>
              ))}
            </select>
            {errors.appointmentId && (
              <p className="text-red-500 text-xs mt-1">{errors.appointmentId}</p>
            )}
          </div>

          {/* Comment Field */}
          <div>
            <label htmlFor="comment" className="block font-medium mb-1">
              Comment <span className="text-red-600">*</span>
            </label>
            <textarea
              id="comment"
              value={formData.comment}
              onChange={(e) => handleInputChange('comment', e.target.value)}
              rows={4}
              className={`w-full border ${errors.comment ? 'border-red-500' : 'border-gray-300'} rounded px-3 py-2`}
              placeholder="Share your feedback about the appointment..."
              required
            />
            {errors.comment && (
              <p className="text-red-500 text-xs mt-1">{errors.comment}</p>
            )}
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
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  {feedback?.id ? 'Updating...' : 'Submitting...'}
                </span>
              ) : feedback?.id ? 'Update Feedback' : 'Submit'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
