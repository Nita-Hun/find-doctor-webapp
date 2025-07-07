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
  PowerIcon,
} from '@heroicons/react/24/outline';

const menuItems = [
  { label: 'Dashboards', icon: <ClipboardDocumentListIcon className="h-5 w-5" />, href: '/admin/dashboards' },
  { label: 'Doctors', icon: <UserCircleIcon className="h-5 w-5" />, href: '/admin/doctors' },
  { label: 'Users', icon: <Cog6ToothIcon className="h-5 w-5" />, href: '/admin/users' },
  { label: 'Patients', icon: <UsersIcon className="h-5 w-5" />, href: '/admin/patients' },
  { label: 'Appointments', icon: <CalendarDaysIcon className="h-5 w-5" />, href: '/admin/appointments' },
  { label: 'Specializations', icon: <BriefcaseIcon className="h-5 w-5" />, href: '/admin/specializations' },
  { label: 'Hospitals', icon: <ClipboardDocumentListIcon className="h-5 w-5" />, href: '/admin/hospitals' },
  { label: 'Feedbacks', icon: <ClipboardDocumentListIcon className="h-5 w-5" />, href: '/admin/feedbacks' },
  { label: 'Appointment Types', icon: <ClipboardDocumentListIcon className="h-5 w-5" />, href: '/admin/appointmentTypes' },
  { label: 'Payments', icon: <ClipboardDocumentListIcon className="h-5 w-5" />, href: '/admin/payments' },
  { label: 'Payment History', icon: <ClipboardDocumentListIcon className="h-5 w-5" />, href: '/admin/paymentViews' },
  { label: 'Settings', icon: <Cog6ToothIcon className="h-5 w-5" />, href: '/admin/settings' },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <nav className="p-4 space-y-2 overflow-y-auto">
      {menuItems.map((item) => {
        const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
        return (
          <Link key={item.label} href={item.href} passHref>
            <div
              aria-current={isActive ? 'page' : undefined}
              className={`flex items-center gap-3 p-2 rounded-md cursor-pointer text-sm
                ${isActive ? 'bg-gray-200 font-semibold' : 'hover:bg-gray-100'}
              `}
            >
              {item.icon}
              <span className="hidden lg:inline">{item.label}</span>
            </div>
          </Link>
        );
      })}

      <hr className="my-2" />

      <Link href="/logout">
        <div className="flex items-center gap-3 p-2 text-sm hover:bg-gray-100 rounded-md text-red-500">
          <PowerIcon className="h-5 w-5" />
          <span className="hidden lg:inline">Logout</span>
        </div>
      </Link>
    </nav>
  );
}
