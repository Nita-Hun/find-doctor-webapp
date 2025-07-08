'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { apiClient } from '@/lib/api-client';
import toast from 'react-hot-toast';

interface RoleMetadataDto {
  role: string;
  description: string;
  status: boolean;
  createdAt: string;
}

export default function EditRolePage() {
  const { role } = useParams<{ role: string }>();
  const router = useRouter();

  const [data, setData] = useState<RoleMetadataDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchRole();
  }, []);

  const fetchRole = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get<RoleMetadataDto>(`/api/roles/${role}`);
      setData(res.data);
    } catch (error: any) {
      toast.error(error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await apiClient.put(`/api/roles/${role}`, {
        description: data?.description,
        status: data?.status,
      });
      toast.success('Role updated');
      router.push('/admin/roles');
    } catch (error: any) {
      toast.error(error.response?.data || error.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="p-4">Loading...</p>;

  if (!data) return <p className="p-4">Role not found.</p>;

  return (
    <div className="p-4 max-w-lg">
      <h1 className="text-xl font-semibold mb-4">Edit Role: {data.role}</h1>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Description</label>
          <input
            type="text"
            className="mt-1 w-full border p-2 rounded"
            value={data.description}
            onChange={(e) => setData({ ...data, description: e.target.value })}
          />
        </div>
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={data.status}
            onChange={(e) => setData({ ...data, status: e.target.checked })}
          />
          <label>Active</label>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </div>
  );
}
