'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { apiClient } from '@/lib/api-client';
import toast from 'react-hot-toast';

interface PaymentFormModalProps {
  payment: {
    id?: number;
    appointmentId?: number;
    amount?: number;
    paymentStatus?: string;
    paymentMethod?: string;
  } | null;
  onClose: () => void;
  onSuccess: () => void;
}

interface PaymentFormData {
  appointmentId: number;
  amount: number;
  paymentStatus: string;
  paymentMethod: string;
}

export default function PaymentFormModal({ payment, onClose, onSuccess }: PaymentFormModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<PaymentFormData>({
    defaultValues: {
      appointmentId: payment?.appointmentId || 0,
      amount: payment?.amount || 0,
      paymentStatus: payment?.paymentStatus || 'PENDING',
      paymentMethod: payment?.paymentMethod || '',
    },
  });

  useEffect(() => {
    // Reset form when payment changes (edit or new)
    reset({
      appointmentId: payment?.appointmentId || 0,
      amount: payment?.amount || 0,
      paymentStatus: payment?.paymentStatus || 'PENDING',
      paymentMethod: payment?.paymentMethod || '',
    });
  }, [payment, reset]);

  const onSubmit = async (data: PaymentFormData) => {
    try {
      if (payment?.id) {
        // Update existing payment
        await apiClient.put(`/api/payments/${payment.id}`, data);
        toast.success('Payment updated successfully');
      } else {
        // Create new payment
        await apiClient.post('/api/payments', data);
        toast.success('Payment created successfully');
      }
      onSuccess();
    } catch (error) {
      console.error('Failed to save payment', error);
      toast.error('Failed to save payment');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6 relative">
        <h2 className="text-xl font-semibold mb-4">{payment?.id ? 'Edit Payment' : 'Add Payment'}</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Appointment ID</label>
            <input
              type="number"
              {...register('appointmentId', { required: 'Appointment ID is required', min: 1 })}
              className={`w-full px-3 py-2 border rounded ${errors.appointmentId ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.appointmentId && <p className="text-red-600 text-sm mt-1">{errors.appointmentId.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
            <input
              type="number"
              step="0.01"
              {...register('amount', { required: 'Amount is required', min: 0.01 })}
              className={`w-full px-3 py-2 border rounded ${errors.amount ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.amount && <p className="text-red-600 text-sm mt-1">{errors.amount.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Payment Status</label>
            <select
              {...register('paymentStatus', { required: 'Payment status is required' })}
              className={`w-full px-3 py-2 border rounded ${errors.paymentStatus ? 'border-red-500' : 'border-gray-300'}`}
            >
              <option value="PENDING">Pending</option>
              <option value="COMPLETED">Completed</option>
              <option value="FAILED">Failed</option>
            </select>
            {errors.paymentStatus && <p className="text-red-600 text-sm mt-1">{errors.paymentStatus.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Payment Method</label>
            <input
              type="text"
              {...register('paymentMethod', { required: 'Payment method is required' })}
              className={`w-full px-3 py-2 border rounded ${errors.paymentMethod ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="e.g. Credit Card, Cash"
            />
            {errors.paymentMethod && <p className="text-red-600 text-sm mt-1">{errors.paymentMethod.message}</p>}
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
              disabled={isSubmitting}
            >
              {payment?.id ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
