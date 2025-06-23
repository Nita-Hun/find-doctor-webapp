'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

type Props = {
  hospital: any;
  onClose: () => void;
  onSuccess: () => void;
};

export default function HospitalFormModal({ hospital, onClose, onSuccess }: Props) {
  const [form, setForm] = useState({ name: '', phone: '', address: '' });

  useEffect(() => {
    if (hospital) {
      setForm({
        name: hospital.name,
        phone: hospital.phone,
        address: hospital.address,
      });
    }
  }, [hospital]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (!form.name || !form.phone || !form.address) {
      toast.error('All fields are required');
      return;
    }

    try {
      if (hospital?.id) {
        await axios.post(`http://localhost:8080/api/hospitals/${hospital.id}`, form);
        toast.success('Hospital updated');
      } else {
        await axios.post('http://localhost:8080/api/hospitals', form);
        toast.success('Hospital created');
      }

      onSuccess();
    } catch (err) {
      toast.error('Save failed');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white p-6 w-full max-w-md rounded space-y-4">
        <h2 className="text-lg font-semibold">{hospital ? 'Edit' : 'Add'} Hospital</h2>
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Hospital Name"
          className="w-full p-2 border rounded"
        />
        <input
          name="phone"
          value={form.phone}
          onChange={handleChange}
          placeholder="Phone"
          className="w-full p-2 border rounded"
        />
        <input
          name="address"
          value={form.address}
          onChange={handleChange}
          placeholder="Address"
          className="w-full p-2 border rounded"
        />
        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 border rounded">Cancel</button>
          <button onClick={handleSubmit} className="px-4 py-2 bg-blue-600 text-white rounded">
            {hospital ? 'Update' : 'Create'}
          </button>
        </div>
      </div>
    </div>
  );
}
