import { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

interface Feedback {
  id?: number;
  rating: number;
  comment: string;
  appointmentId: number;
  createdAt?: string;
  updatedAt?: string;
  doctorName?: string;
  doctorId?: number;
}

interface Appointment {
  id: number;
  doctor?: {
    id: number;
    name: string;
  };
  doctorName?: string;
  doctorId?: number;
}

interface FeedbackFormModalProps {
  feedback: Feedback | null;
  appointments: Appointment[];
  onClose: () => void;
  onSuccess: () => void;
}

export default function FeedbackFormModal({
  feedback,
  appointments,
  onClose,
  onSuccess
}: FeedbackFormModalProps) {
  const [formData, setFormData] = useState({
    rating: feedback?.rating || 5,
    comment: feedback?.comment || '',
    appointmentId: feedback?.appointmentId || 0
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (feedback?.id) {
        await axios.put(`http://localhost:8080/api/feedbacks/${feedback.id}`, formData);
        toast.success('Feedback updated successfully');
      } else {
        await axios.post('http://localhost:8080/api/feedbacks', formData);
        toast.success('Feedback created successfully');
      }
      onSuccess();
    } catch (error) {
      toast.error('Failed to save feedback');
      console.error(error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">
          {feedback?.id ? 'Edit Feedback' : 'Add New Feedback'}
        </h2>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">
              Rating
            </label>
            <select
              value={formData.rating}
              onChange={(e) => setFormData({...formData, rating: parseInt(e.target.value)})}
              className="w-full p-2 border rounded"
              required
            >
              {[1, 2, 3, 4, 5].map((num) => (
                <option key={num} value={num}>
                  {'★'.repeat(num) + '☆'.repeat(5 - num)} ({num}/5)
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">
              Appointment
            </label>
            <select
              value={formData.appointmentId}
              onChange={(e) => setFormData({...formData, appointmentId: parseInt(e.target.value)})}
              className="w-full p-2 border rounded"
              required
            >
              <option value={0}>Select an appointment</option>
              {appointments.map((appointment) => (
                <option key={appointment.id} value={appointment.id}>
                  {appointment.doctor?.name || (appointment as any)?.doctorName} (ID: {appointment.id})
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">
              Comment
            </label>
            <textarea
              value={formData.comment}
              onChange={(e) => setFormData({...formData, comment: e.target.value})}
              className="w-full p-2 border rounded"
              rows={4}
              required
            />
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}