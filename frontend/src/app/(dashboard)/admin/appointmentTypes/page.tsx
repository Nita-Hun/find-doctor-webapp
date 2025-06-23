'use client';

import { useEffect, useState, Fragment } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Dialog, Transition } from '@headlessui/react';

interface AppointmentType {
  id: number;
  name: string;
  price: number;
  createdAt: string;
  updatedAt: string;
}

export default function AppointmentTypePage() {
  const [types, setTypes] = useState<AppointmentType[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ name: '', price: '' });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const fetchTypes = async () => {
    try {
      const res = await axios.get(`http://localhost:8080/api/appointment-types`, {
        params: { page, size: 5 },
      });
      setTypes(res.data.content || []);
      setTotalPages(res.data.totalPages || 1);
    } catch {
      toast.error('Failed to fetch appointment types');
    }
  };

  useEffect(() => {
    fetchTypes();
  }, [page]);

  const openModal = (type?: AppointmentType) => {
    if (type) {
      setForm({ name: type.name, price: type.price.toString() });
      setEditingId(type.id);
    } else {
      setForm({ name: '', price: '' });
      setEditingId(null);
    }
    setModalOpen(true);
  };

  const handleSubmit = async () => {
    const payload = {
      name: form.name.trim(),
      price: parseFloat(form.price),
    };

    if (!payload.name) {
      toast.error('Name is required');
      return;
    }

    if (isNaN(payload.price) || payload.price < 0) {
      toast.error('Price must be a valid number and >= 0');
      return;
    }

    try {
      if (editingId) {
        await axios.put(`http://localhost:8080/api/appointment-types/${editingId}`, payload);
        toast.success('Updated successfully');
      } else {
        await axios.post(`http://localhost:8080/api/appointment-types`, payload);
        toast.success('Created successfully');
        setPage(0);
      }

      setModalOpen(false);
      await new Promise((resolve) => setTimeout(resolve, 500));
      await fetchTypes();
    } catch (error: any) {
      if (error.response?.status === 400) {
        const errors = error.response.data;
        Object.values(errors).forEach((msg) => toast.error(String(msg)));
      } else {
        toast.error('Operation failed');
      }
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`http://localhost:8080/api/appointment-types/${id}`);
      toast.success('Deleted');
      fetchTypes();
    } catch {
      toast.error('Delete failed');
    }
  };

  return (
    <div className="p-6 ml-64">
      <h1 className="text-2xl font-bold mb-4">Appointment Types</h1>
      <button
        onClick={() => openModal()}
        className="bg-blue-600 text-white px-4 py-2 rounded mb-4"
      >
        + Add Appointment Type
      </button>

      <table className="w-full bg-white rounded shadow text-left">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-3">#</th>
            <th className="p-3">Name</th>
            <th className="p-3">Price</th>
            <th className="p-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {types.map((type, index) => (
            <tr key={type.id} className="border-t">
              <td className="p-3">{index + 1 + page * 5}</td>
              <td className="p-3">{type.name}</td>
              <td className="p-3">${type.price.toFixed(2)}</td>
              <td className="p-3 space-x-2">
                <button onClick={() => openModal(type)} className="text-yellow-600">Edit</button>
                <button onClick={() => handleDelete(type.id)} className="text-red-600">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="flex justify-end mt-4 space-x-2">
        <button
          disabled={page === 0}
          onClick={() => setPage(page - 1)}
          className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
        >
          Prev
        </button>
        <button
          disabled={page >= totalPages - 1}
          onClick={() => setPage(page + 1)}
          className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>

      {/* Modal */}
      <Transition appear show={modalOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={() => setModalOpen(false)}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 shadow-xl">
                <Dialog.Title className="text-lg font-medium text-gray-900 mb-4">
                  {editingId ? 'Edit' : 'Add'} Appointment Type
                </Dialog.Title>
                <input
                  type="text"
                  placeholder="Name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full border px-3 py-2 mb-3"
                />
                <input
                  type="number"
                  step="0.01"
                  placeholder="Price"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                  className="w-full border px-3 py-2 mb-4"
                />
                <div className="flex justify-end space-x-2">
                  <button
                    onClick={() => setModalOpen(false)}
                    className="bg-gray-300 text-black px-4 py-2 rounded"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmit}
                    className="bg-blue-600 text-white px-4 py-2 rounded"
                  >
                    {editingId ? 'Update' : 'Create'}
                  </button>
                </div>
              </Dialog.Panel>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
}
