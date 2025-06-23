'use client';

import { BellIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';

export default function Topbar() {
  return (
    <div className="bg-white shadow-sm px-6 py-4 flex justify-between items-center">
      <div>
        <input
          type="text"
          placeholder="Search..."
          className="border border-gray-300 rounded px-3 py-1 text-sm focus:outline-none"
        />
      </div>
      <div className="flex items-center gap-4">
        <BellIcon className="h-6 w-6 text-gray-500" />
        <div className="flex items-center gap-2">
          <Image src="/assets/images/avatar-user.png" alt="avatar" width={32} height={32} className="rounded-full" />
          <div className="text-sm">
            <p className="font-medium">Nita</p>
            <p className="text-gray-500">Admin</p>
          </div>
        </div>
      </div>
    </div>
  );
}