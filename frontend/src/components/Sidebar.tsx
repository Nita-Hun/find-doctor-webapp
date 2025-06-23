'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  UserCircleIcon,
  UsersIcon,
  CalendarDaysIcon,
  BriefcaseIcon,
  ClipboardDocumentListIcon,
  Cog6ToothIcon,
  PowerIcon
} from '@heroicons/react/24/outline';

const menuItems = [
  { label: 'Doctors', icon: <UserCircleIcon className="h-5 w-5" />, href: '/admin/doctors' },
  { label: 'Patients', icon: <UsersIcon className="h-5 w-5" />, href: '/admin/patients' },
  { label: 'Appointments', icon: <CalendarDaysIcon className="h-5 w-5" />, href: '/admin/appointments' },
  { label: 'Specializations', icon: <BriefcaseIcon className="h-5 w-5" />, href: '/admin/specializations' },
  { label: 'Hospitals', icon: <ClipboardDocumentListIcon className="h-5 w-5" />, href: '/admin/hospitals' },
  { label: 'Feedbacks', icon: <ClipboardDocumentListIcon className="h-5 w-5" />, href: '/admin/feedback' },
  { label: 'AppointmentTypes', icon: <ClipboardDocumentListIcon className="h-5 w-5" />, href: '/admin/appointmenttype' },
  { label: 'Settings', icon: <Cog6ToothIcon className="h-5 w-5" />, href: '/admin/settings' },


];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="p-4 space-y-4">
      {menuItems.map((item) => (
        <Link key={item.label} href={item.href} passHref>
          <div
            className={`flex items-center gap-3 p-2 rounded-md cursor-pointer hover:bg-gray-100 text-sm ${
              pathname.startsWith(item.href) ? 'bg-gray-200 font-semibold' : ''
            }`}
          >
            {item.icon}
            <span className="hidden lg:inline">{item.label}</span>
          </div>
        </Link>
      ))}
      <hr />
      <Link href="/admin/settings">
        <div className="flex items-center gap-3 p-2 text-sm hover:bg-gray-100 rounded-md">
          <Cog6ToothIcon className="h-5 w-5" />
          <span className="hidden lg:inline">Settings</span>
        </div>
      </Link>
      <Link href="/logout">
        <div className="flex items-center gap-3 p-2 text-sm hover:bg-gray-100 rounded-md text-red-500">
          <PowerIcon className="h-5 w-5" />
          <span className="hidden lg:inline">Logout</span>
        </div>
      </Link>
    </div>
  );
}