'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import {
  UserCircleIcon,
  UsersIcon,
  CalendarDaysIcon,
  BriefcaseIcon,
  ClipboardDocumentListIcon,
  Cog6ToothIcon,
  CurrencyDollarIcon,
  ListBulletIcon,
} from '@heroicons/react/24/outline';

import { ComponentType, SVGProps } from 'react';
import useCurrentUser from '@/hooks/useCurrentUser';
import { FileEditIcon, FolderCodeIcon, HospitalIcon, LayoutDashboardIcon, TypeIcon, TypeOutlineIcon } from 'lucide-react';

interface MenuItem {
  label: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  href?: string;
  children?: MenuItem[];
}

const adminItems: MenuItem[] = [
  { label: 'Dashboards', icon: LayoutDashboardIcon, href: '/admin/dashboards' },
  { label: 'Doctors', icon: UserCircleIcon, href: '/admin/doctors' },

  

  { label: 'Patients', icon: UsersIcon, href: '/admin/patients' },
  { label: 'Appointments', icon: CalendarDaysIcon, href: '/admin/appointments' },
  { label: 'Specializations', icon: BriefcaseIcon, href: '/admin/specializations' },
  { label: 'Hospitals', icon: HospitalIcon, href: '/admin/hospitals' },
  { label: 'Feedbacks', icon: FileEditIcon, href: '/admin/feedbacks' },
  { label: 'Appointment Types', icon: ClipboardDocumentListIcon, href: '/admin/appointmentTypes' },
  
  {
    label: 'Transactions',
    icon: ListBulletIcon,
    children: [
      { label: 'Payments', icon: CurrencyDollarIcon, href: '/admin/payments' },
      { label: 'Payment Historys', icon: CalendarDaysIcon, href: '/admin/paymentViews' },
      
    ],
  },
  // Configuration parent with children
  {
    label: 'Settings',
    icon: Cog6ToothIcon,
    children: [
      { label: 'Users', icon: UsersIcon, href: '/admin/users' },
      { label: 'Roles', icon: UserCircleIcon, href: '/admin/roles' },
    ],
  },
];

const doctorItems: MenuItem[] = [
  { label: 'Dashboards', icon: ClipboardDocumentListIcon, href: '/doctor/dashboards' },
  { label: 'My Appointments', icon: CalendarDaysIcon, href: '/doctor/appointments' },
  { label: 'My Patients', icon: UsersIcon, href: '/doctor/patients' },
];

const patientItems: MenuItem[] = [
  { label: 'My Appointments', icon: CalendarDaysIcon, href: '/patient/appointments' },
  { label: 'My Profile', icon: UserCircleIcon, href: '/patient/profile' },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { user, loading } = useCurrentUser();
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({});

  if (loading) {
    return (
      <nav className="p-4">
        <div className="text-sm text-gray-500">Loading menu...</div>
      </nav>
    );
  }

  const role = user?.role;
  let menuItems: MenuItem[] = [];

  if (role === 'ADMIN') menuItems = adminItems;
  else if (role === 'DOCTOR') menuItems = doctorItems;
  else if (role === 'PATIENT') menuItems = patientItems;

  const toggleMenu = (label: string) => {
    setOpenMenus((prev) => ({
      ...prev,
      [label]: !prev[label],
    }));
  };

  const renderMenuItem = (item: MenuItem, level = 0) => {
    const hasChildren = item.children && item.children.length > 0;
    const isOpen = openMenus[item.label];

    // Active if exact match or starts with href + /
    const isActive =
      item.href
        ? pathname === item.href || pathname.startsWith(item.href + '/')
        : false;

    const Icon = item.icon;

    return (
      <div key={item.label}>
        <div
          onClick={() => hasChildren ? toggleMenu(item.label) : undefined}
          className={`flex items-center gap-3 p-2 rounded-md cursor-pointer text-sm
            ${isActive ? 'bg-gray-200 font-semibold' : 'hover:bg-gray-100'}
          `}
          style={{ paddingLeft: `${level * 20}px` }}
        >
          <Icon className="h-5 w-5" />
          {item.href && !hasChildren ? (
            <Link href={item.href} passHref>
              <span className="hidden lg:inline">{item.label}</span>
            </Link>
          ) : (
            <span className="hidden lg:inline">{item.label}</span>
          )}
          {hasChildren && (
            <svg
              className={`ml-auto h-4 w-4 transition-transform duration-200 ${
                isOpen ? 'rotate-90' : ''
              }`}
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          )}
        </div>
        {hasChildren && isOpen && (
          <div>
            {item.children!.map((child) => renderMenuItem(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <nav className="p-4 space-y-2 overflow-y-auto">
      {menuItems.map((item) => renderMenuItem(item))}
    </nav>
  );
}
