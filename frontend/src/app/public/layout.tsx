'use client';

import { Inter } from 'next/font/google'; // your context
import PublicNavbar from '@/components/PublicNavbar';
import AuthNavbar from '@/components/AuthNavbar';
import { AuthProvider, useAuth } from '@/hooks/authContext';


const inter = Inter({ subsets: ['latin'] });

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <InnerLayout>{children}</InnerLayout>
    </AuthProvider>
  );
}

// This component must also be marked as client
function InnerLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();

  return (
    <div className={`${inter.className}`}>
      {isAuthenticated ? <AuthNavbar /> : <PublicNavbar />}
      <main>{children}</main>
    </div>
  );
}
