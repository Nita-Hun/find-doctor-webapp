// app/admin/layout.tsx or wherever your layout file is
'use client';

import Logo from '@/components/Logo';
import Sidebar from '@/components/Sidebar';
import Topbar from '@components/Topbar';
import Link from 'next/link';

export default function DashboardLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <aside className="w-[17%] md:w-[8%] lg:w-[16%] xl:w-[17%] bg-white shadow-md">
        <Link href="/" className="flex items-center justify-center lg:justify-start gap-2 p-4">
          <Logo />
        </Link>
        <Sidebar />
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col bg-gray-100">
        {/* Topbar */}
        <Topbar />

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}
