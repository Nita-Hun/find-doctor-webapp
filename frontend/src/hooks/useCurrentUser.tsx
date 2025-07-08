'use client';
import { useEffect, useState } from 'react';
import { apiClient } from '@/lib/api-client';

export interface CurrentUser {
  id: number;
  username: string;
  role: 'ADMIN' | 'DOCTOR' | 'PATIENT';
}

export default function useCurrentUser() {
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await apiClient.get<CurrentUser>('/api/auth/me');
        setUser(res.data);
      } catch (error) {
        console.error('Failed to load current user', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  return { user, loading };
}
