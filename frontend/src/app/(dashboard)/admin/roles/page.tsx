'use client';

import { useEffect, useState } from 'react';
import { apiClient } from '@/lib/api-client';
import Link from 'next/link';
import toast from 'react-hot-toast';

interface RoleMetadataDto {
  role: string;
  description: string;
  status: boolean;
  createdAt: string;
}

export default function RolesPage() {
  const [roles, setRoles] = useState<RoleMetadataDto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get<RoleMetadataDto[]>('/api/roles');
      setRoles(res.data);
    } catch (error: any) {
      toast.error(error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-semibold mb-4">Role Configuration</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <table className="min-w-full bg-white border">
          <thead>
            <tr className="bg-gray-100">
              <th className="text-left p-2">Role</th>
              <th className="text-left p-2">Description</th>
              <th className="text-left p-2">Status</th>
              <th className="text-left p-2">Created At</th>
              <th className="text-left p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {roles.map((r) => (
              <tr key={r.role} className="border-t">
                <td className="p-2">{r.role}</td>
                <td className="p-2">{r.description}</td>
                <td className="p-2">
                  <span
                    className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                      r.status ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}
                  >
                    {r.status ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="p-2">{new Date(r.createdAt).toLocaleString()}</td>
                <td className="p-2">
                  <Link
                    href={`/admin/roles/${r.role}`}
                    className="text-blue-600 hover:underline"
                  >
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
