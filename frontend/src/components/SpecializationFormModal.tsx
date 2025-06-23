'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

type Props = {
  specialization: any;
  onClose: () => void;
  onSuccess: () => void;
};

export default function SpecializationFormModal({ specialization, onClose, onSuccess }: Props) {
  const [name, setName] = useState('');

  useEffect(() => {
    if (specialization) setName(specialization.name);
    else setName('');
  }, [specialization]);

  const handleSubmit = async () => {
    if (!name.trim()) {
      toast.error('Name is required');
      return;
    }

    try {
      if (specialization?.id) {
        await axios.post(`http://localhost:8080/api/specializations/${specialization.id}`, { name });
        toast.success('Specialization updated');
      } else {
        await axios.post('http://localhost:8080/api/specializations', { name });
        toast.success('Specialization created');
      }

      onSuccess();
    } catch (err) {
      toast.error('Save failed');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white p-6 w-full max-w-md rounded space-y-4">
        <h2 className="text-lg font-semibold">{specialization ? 'Edit' : 'Add'} Specialization</h2>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Specialization Name"
          className="w-full p-2 border rounded"
        />
        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 border rounded">Cancel</button>
          <button onClick={handleSubmit} className="px-4 py-2 bg-blue-600 text-white rounded">
            {specialization ? 'Update' : 'Create'}
          </button>
        </div>
      </div>
    </div>
  );
}
