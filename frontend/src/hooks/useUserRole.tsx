'use client';

import { useState, useEffect } from 'react';

export function useUserRole(): "ADMIN" | "DOCTOR" | "PATIENT" {
  const [role, setRole] = useState<"ADMIN" | "DOCTOR" | "PATIENT">("PATIENT");

  useEffect(() => {
    const storedRole = localStorage.getItem('role');
    console.log("Loaded role from storage:", storedRole);
    if (storedRole === "ADMIN" || storedRole === "DOCTOR" || storedRole === "PATIENT") {
      setRole(storedRole);
    }
  }, []);

  return role;
}
