import { useEffect, useState } from "react";
import { apiClient } from '@/lib/api-client';

export interface UserProfile {
  role: "ADMIN" | "DOCTOR" | "PATIENT";
  profilePhotoUrl: string;
}

export function useUserProfile() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      setUser(null);
      return;
    }

    setLoading(true);
    apiClient
      .get<UserProfile>("/api/auth/me")
      .then((res) => setUser(res.data))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return { user, loading, refetch: fetchUser };
}
