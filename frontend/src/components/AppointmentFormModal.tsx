'use client';

import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { apiClient } from '@/lib/api-client';
import { Appointment, SelectOption, AppointmentFormModalProps } from '@/types/Appointment';
import { FiX } from 'react-icons/fi';

export default function AppointmentFormModal({ appointment, onClose, onSuccess }: AppointmentFormModalProps) {
  // Controlled state for the form fields, initialized from appointment or defaults
  const [doctorId, setDoctorId] = useState<number>(appointment?.doctorId ?? 0);
  const [patientId, setPatientId] = useState<number>(appointment?.patientId ?? 0);
  const [appointmentTypeId, setAppointmentTypeId] = useState<number>(appointment?.appointmentTypeId ?? 0);
  const [dateTime, setDateTime] = useState<string>(appointment?.dateTime ?? '');
  const [note, setNote] = useState<string>(appointment?.note ?? '');
  const [attachment, setAttachment] = useState<File | null>(null);


  // Dropdown options
  const [doctors, setDoctors] = useState<SelectOption[]>([]);
  const [patients, setPatients] = useState<SelectOption[]>([]);
  const [appointmentTypes, setAppointmentTypes] = useState<SelectOption[]>([]);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchDropdownData() {
      try {
        const [doctorsRes, patientsRes, typesRes] = await Promise.all([
          apiClient.get('/api/doctors'),
          apiClient.get('/api/patients'),
          apiClient.get('/api/appointment-types'),
        ]);

        // Normalize and sort by full name (A-Z)
        const normalizeOptions = (data: any[], nameKeys: [string, string]) =>
          data
            .map(d => ({ id: d.id, name: `${d[nameKeys[0]]} ${d[nameKeys[1]]}`.trim() }))
            .sort((a, b) => a.name.localeCompare(b.name));

        setDoctors(normalizeOptions(doctorsRes.data.content ?? doctorsRes.data, ['firstname', 'lastname']));
        setPatients(normalizeOptions(patientsRes.data.content ?? patientsRes.data, ['firstname', 'lastname']));
        setAppointmentTypes(
          (typesRes.data.content ?? typesRes.data)
            .map((t: any) => ({ id: t.id, name: t.name }))
            .sort((a: any, b: any) => a.name.localeCompare(b.name))
        );
      } catch (error) {
        toast.error('Failed to load form data');
      }
    }

    fetchDropdownData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!doctorId || !patientId || !appointmentTypeId || !dateTime) {
      toast.error('Please fill all required fields');
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('doctorId', doctorId.toString());
      formData.append('patientId', patientId.toString());
      formData.append('appointmentTypeId', appointmentTypeId.toString());
      formData.append('dateTime', dateTime);
      formData.append('note', note);
      if (attachment) formData.append('attachment', attachment);

      if (appointment?.id) {
        await apiClient.put(`/api/appointments/${appointment.id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        toast.success('Appointment updated successfully');
      } else {
        await apiClient.post('/api/appointments', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        toast.success('Appointment created successfully');
      }
      onSuccess();
    } catch (error) {
      toast.error('Failed to save appointment');
      console.error(error);
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
                {appointment ? 'Edit Appointment' : 'Add New Appointment'}
              </h2>
              <button 
                onClick={onClose} 
                className="text-gray-500 hover:text-gray-700"
              >
                <FiX size={24} />
              </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4 text-sm" noValidate>
          {/* Doctor */}
          <div>
            <label htmlFor="doctor" className="block font-medium mb-1">
              Doctor <span className="text-red-600">*</span>
            </label>
            <select
              id="doctor"
              value={doctorId}
              onChange={(e) => setDoctorId(Number(e.target.value))}
              className="w-full border border-gray-300 rounded px-3 py-2"
              required
            >
              <option value={0} disabled>
                Select doctor
              </option>
              {doctors.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>
          </div>

          {/* Patient */}
          <div>
            <label htmlFor="patient" className="block font-medium mb-1">
              Patient <span className="text-red-600">*</span>
            </label>
            <select
              id="patient"
              value={patientId}
              onChange={(e) => setPatientId(Number(e.target.value))}
              className="w-full border border-gray-300 rounded px-3 py-2"
              required
            >
              <option value={0} disabled>
                Select patient
              </option>
              {patients.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          {/* Appointment Type */}
          <div>
            <label htmlFor="appointmentType" className="block font-medium mb-1">
              Appointment Type <span className="text-red-600">*</span>
            </label>
            <select
              id="appointmentType"
              value={appointmentTypeId}
              onChange={(e) => setAppointmentTypeId(Number(e.target.value))}
              className="w-full border border-gray-300 rounded px-3 py-2"
              required
            >
              <option value={0} disabled>
                Select type
              </option>
              {appointmentTypes.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
          </div>

          {/* Date & Time */}
          <div>
            <label htmlFor="dateTime" className="block font-medium mb-1">
              Date & Time <span className="text-red-600">*</span>
            </label>
            <input
              id="dateTime"
              type="datetime-local"
              value={dateTime}
              onChange={(e) => setDateTime(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2"
              required
            />
          </div>

          {/* Note */}
          <div>
            <label htmlFor="note" className="block font-medium mb-1">
              Note <span className="text-red-600">*</span>
            </label>
            <textarea
              id="note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={3}
              className="w-full border border-gray-300 rounded px-3 py-2"
              placeholder="Additional notes..."
            />
          </div>

          {/* Attachment */}
          <div>
            <label htmlFor="attachment" className="block font-medium mb-1">
              Attachment
            </label>
            <input
              id="attachment"
              type="file"
              onChange={(e) => {
                const files = e.target.files;
                setAttachment(files && files.length > 0 ? files[0] : null);
              }}
              className="w-full"
              accept="image/*,.pdf,.doc,.docx"
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
              {loading ? 'Saving...' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
