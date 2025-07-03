'use client';

import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { apiClient } from '@/lib/api-client';

interface AppointmentDto {
  id?: number;
  doctorId: number | '';
  patientId: number | '';
  appointmentTypeId: number | '';
  dateTime: string;
  status: string;
  attachment?: string;
}

interface Doctor {
  id: number;
  firstname: string;
  lastname: string;
}

interface Patient {
  id: number;
  firstname: string;
  lastname: string;
}

interface AppointmentType {
  id: number;
  name: string;
}

interface AppointmentFormModalProps {
  appointment?: AppointmentDto | null;
  onClose: () => void;
  onSuccess: () => void;
}

export default function AppointmentFormModal({ appointment, onClose, onSuccess }: AppointmentFormModalProps) {
  const [form, setForm] = useState<AppointmentDto>({
    doctorId: '',
    patientId: '',
    appointmentTypeId: '',
    dateTime: '',
    status: '',
    attachment: '',
    ...appointment,
  });

  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [types, setTypes] = useState<AppointmentType[]>([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [docRes, patRes, typeRes] = await Promise.all([
          apiClient.get('/api/doctors'),
          apiClient.get('/api/patients'),
          apiClient.get('/api/appointment-types'),
        ]);
        setDoctors(docRes.data.content || docRes.data);
        setPatients(patRes.data.content || patRes.data);
        setTypes(typeRes.data.content || typeRes.data);
      } catch {
        toast.error('Failed to load form data');
      }
    };
    loadData();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]:
        name === 'doctorId' ||
        name === 'patientId' ||
        name === 'appointmentTypeId'
          ? Number(value)
          : value,
    }));
  };

  // Upload image handler
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await apiClient.post('/api/appointments/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setForm((prev) => ({ ...prev, attachment: res.data }));
      toast.success('Image uploaded!');
    } catch {
      toast.error('Image upload failed');
    }
  };

  const handleSubmit = async () => {
    // basic validation
    if (
      !form.doctorId ||
      !form.patientId ||
      !form.appointmentTypeId ||
      !form.dateTime ||
      !form.status
    ) {
      toast.error('Please fill all required fields');
      return;
    }

    try {
      if (form.id) {
        await apiClient.put(`/api/appointments/${form.id}`, form);
        toast.success('Appointment updated!');
      } else {
        await apiClient.post('/api/appointments', form);
        toast.success('Appointment created!');
      }
      onSuccess();
      onClose();
    } catch {
      toast.error('Failed to save appointment');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-lg max-h-full overflow-auto">
        <h2 className="text-xl font-semibold mb-4">
          {form.id ? 'Edit' : 'Add'} Appointment
        </h2>

        <div className="space-y-4">
          {/* Doctor */}
          <select
            name="doctorId"
            value={form.doctorId ?? ''}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          >
            <option value="">Select Doctor</option>
            {doctors.map((d) => (
              <option key={d.id} value={d.id}>
                {d.firstname} {d.lastname}
              </option>
            ))}
          </select>

          {/* Patient */}
          <select
            name="patientId"
            value={form.patientId ?? ''}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          >
            <option value="">Select Patient</option>
            {patients.map((p) => (
              <option key={p.id} value={p.id}>
                {p.firstname} {p.lastname}
              </option>
            ))}
          </select>

          {/* Appointment Type */}
          <select
            name="appointmentTypeId"
            value={form.appointmentTypeId ?? ''}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          >
            <option value="">Select Appointment Type</option>
            {types.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>

          {/* Date Time */}
          <input
            type="datetime-local"
            name="dateTime"
            value={form.dateTime ?? ''}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />

          {/* Status */}
          <input
            type="text"
            name="status"
            value={form.status ?? ''}
            onChange={handleChange}
            placeholder="Status"
            className="w-full border p-2 rounded"
          />

          {/* Attachment Upload */}
          <input
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="w-full"
          />

          {/* Attachment preview */}
          {form.attachment && (
            <div className="mt-2">
                <img 
                src={`${form.attachment}`}
                alt="Attachment preview"
                className="w-full max-h-40 object-contain rounded border"
                onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                }}
                />
            </div>
            )}
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded border hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
