'use client';

import { useEffect, useState } from 'react';
import { apiClient } from '@/lib/api-client';
import toast from 'react-hot-toast';
import { Doctor, Props } from '@/types/doctor';

export default function DoctorFormModal({ doctor, onClose, onSuccess }: Props) {
  const [form, setForm] = useState<Doctor>(
    doctor ?? {
      firstname: '',
      lastname: '',
      status: 'ACTIVE',
      hospitalId: 0,
      specializationId: 0,
    }
  );

  const [hospitals, setHospitals] = useState<{ id: number; name: string }[]>([]);
  const [specializations, setSpecializations] = useState<{ id: number; name: string }[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    apiClient.get('/api/hospitals').then((res) => setHospitals(res.data));
    apiClient.get('/api/specializations').then((res) => setSpecializations(res.data));
  }, []);

  const isValid = (): boolean => {
    return (
      form.firstname.trim() !== '' &&
      form.lastname.trim() !== '' &&
      (form.status === 'ACTIVE' || form.status === 'INACTIVE') &&
      form.hospitalId !== 0 &&
      form.specializationId !== 0
    );
  };

  const handleSubmit = async () => {
    if (!isValid()) {
      toast.error('Please fill all required fields correctly.');
      return;
    }

    try {
      setLoading(true);
      if (doctor) {
        // Use PUT for update
        await apiClient.put(`/api/doctors/${doctor.id}`, form);
        toast.success('Doctor updated');
      } else {
        await apiClient.post('/api/doctors', form);
        toast.success('Doctor created');
      }
      onSuccess();
      onClose();
    } catch (error) {
      console.error(error);
      toast.error('Failed to save doctor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-lg space-y-4">
        <h2 className="text-lg font-semibold">
          {doctor ? 'Edit Doctor' : 'Add Doctor'}
        </h2>

        <input
          type="text"
          placeholder="First name"
          className="w-full border p-2 rounded"
          value={form.firstname}
          onChange={(e) => setForm({ ...form, firstname: e.target.value })}
        />
        <input
          type="text"
          placeholder="Last name"
          className="w-full border p-2 rounded"
          value={form.lastname}
          onChange={(e) => setForm({ ...form, lastname: e.target.value })}
        />
        <select
          className="w-full border p-2 rounded"
          value={form.status}
          onChange={(e) => setForm({ ...form, status: e.target.value })}
        >
          <option value="ACTIVE">ACTIVE</option>
          <option value="INACTIVE">INACTIVE</option>
        </select>
        <select
          className="w-full border p-2 rounded"
          value={form.specializationId}
          onChange={(e) => setForm({ ...form, specializationId: parseInt(e.target.value, 10) })}
        >
          <option value={0}>Select Specialization</option>
          {specializations.map((s) => (
            <option key={s.id} value={s.id}>{s.name}</option>
          ))}
        </select>
        <select
          className="w-full border p-2 rounded"
          value={form.hospitalId}
          onChange={(e) => setForm({ ...form, hospitalId: parseInt(e.target.value, 10) })}
        >
          <option value={0}>Select Hospital</option>
          {hospitals.map((h) => (
            <option key={h.id} value={h.id}>{h.name}</option>
          ))}
        </select>

        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
            disabled={loading || !isValid()}
          >
            {doctor ? 'Update' : 'Create'}
          </button>
        </div>
      </div>
    </div>
  );
}
