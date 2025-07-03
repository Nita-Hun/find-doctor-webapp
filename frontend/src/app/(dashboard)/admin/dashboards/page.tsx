'use client';

import { useEffect, useState } from 'react';
import { apiClient } from '@/lib/api-client';
import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis,
  Tooltip, ResponsiveContainer, CartesianGrid, Legend,
  LineChart, Line, AreaChart, Area
} from 'recharts';
import { FiUsers, FiCalendar, FiActivity, FiDollarSign } from 'react-icons/fi';
import { FaUserMd, FaClinicMedical } from 'react-icons/fa';

// Modern color palette
const COLORS = ['#6366F1', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];
const SECONDARY_COLORS = ['#A5B4FC', '#6EE7B7', '#FCD34D', '#FCA5A5', '#C4B5FD'];


interface Appointment {
  id: number;
  patientName: string;
  doctorName: string;
  dateTime: string;
  type: string;
  status?: string;
}
export default function AdminDashboard() {
  const [stats, setStats] = useState({
    doctors: 0,
    patients: 0,
    appointments: 0,
    specializations: 0,
    revenue: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [upcomingAppointments, setUpcomingAppointments] = useState<Appointment[]>([]);

  // Sample data - replace with your API data
  const genderData = [
    { name: 'Male', value: 300 },
    { name: 'Female', value: 200 },
    { name: 'Other', value: 50 },
  ];

  const weeklyAppointments = [
    { day: 'Mon', appointments: 12, revenue: 1200 },
    { day: 'Tue', appointments: 18, revenue: 1800 },
    { day: 'Wed', appointments: 10, revenue: 1000 },
    { day: 'Thu', appointments: 15, revenue: 1500 },
    { day: 'Fri', appointments: 8, revenue: 800 },
    { day: 'Sat', appointments: 5, revenue: 500 },
  ];

  const monthlyRevenue = [
    { month: 'Jan', revenue: 4500 },
    { month: 'Feb', revenue: 5200 },
    { month: 'Mar', revenue: 4800 },
    { month: 'Apr', revenue: 6100 },
    { month: 'May', revenue: 5900 },
    { month: 'Jun', revenue: 6800 },
  ];

  const patientVisits = [
    { month: 'Jan', new: 120, returning: 80 },
    { month: 'Feb', new: 150, returning: 95 },
    { month: 'Mar', new: 180, returning: 110 },
    { month: 'Apr', new: 200, returning: 130 },
    { month: 'May', new: 220, returning: 150 },
    { month: 'Jun', new: 250, returning: 180 },
  ];

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Replace with your actual API endpoints
        const [countsRes, revenueRes] = await Promise.all([
          apiClient.get('/api/dashboard/counts'),
          apiClient.get('/api/dashboard/revenue')
        ]);
        
        setStats({
          doctors: countsRes.data.doctors,
          patients: countsRes.data.patients,
          appointments: countsRes.data.appointments,
          specializations: countsRes.data.specializations,
          revenue: revenueRes.data.total || 0
        });
      } catch (err) {
        console.error('Failed to fetch dashboard data', err);
        setError('Could not load data. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
          <div className="text-sm text-gray-500">
            Last updated: {new Date().toLocaleDateString()}
          </div>
        </div>

        {loading && (
          <div className="py-12 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading dashboard data...</p>
          </div>
        )}

        {error && (
          <div className="py-6 px-4 bg-red-50 rounded-lg text-red-600 text-center">
            {error}
          </div>
        )}

        {!loading && !error && (
          <>
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
              <SummaryCard 
                icon={<FaUserMd className="text-indigo-500" size={24} />}
                label="Doctors"
                value={stats.doctors}
                change="+12%"
              />
              <SummaryCard 
                icon={<FiUsers className="text-green-500" size={24} />}
                label="Patients"
                value={stats.patients}
                change="+24%"
              />
              <SummaryCard 
                icon={<FiCalendar className="text-yellow-500" size={24} />}
                label="Appointments"
                value={stats.appointments}
                change="+8%"
              />
              <SummaryCard 
                icon={<FaClinicMedical className="text-purple-500" size={24} />}
                label="Specializations"
                value={stats.specializations}
                change="+5%"
              />
              <SummaryCard 
                icon={<FiDollarSign className="text-blue-500" size={24} />}
                label="Revenue"
                value={`$${(stats.revenue / 1000).toFixed(1)}k`}
                change="+18%"
              />
            </div>

            {/* Main Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              {/* Patient Demographics */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Upcoming Appointments</h2>
                <div className="h-64 overflow-y-auto">
                  {/* Sample data - replace with your API data */}
                  {[
                    {
                      id: 1,
                      patient: "John Smith",
                      doctor: "Dr. Sarah Johnson",
                      dateTime: "2023-06-15T10:30:00",
                      type: "Annual Checkup"
                    },
                    {
                      id: 2,
                      patient: "Emily Davis",
                      doctor: "Dr. Michael Chen",
                      dateTime: "2023-06-15T14:00:00",
                      type: "Follow-up"
                    },
                    {
                      id: 3,
                      patient: "Robert Wilson",
                      doctor: "Dr. Emily Wilson",
                      dateTime: "2023-06-16T09:15:00",
                      type: "Consultation"
                    },
                    {
                      id: 4,
                      patient: "Maria Garcia",
                      doctor: "Dr. Sarah Johnson",
                      dateTime: "2023-06-16T11:45:00",
                      type: "Vaccination"
                    },
                    {
                      id: 5,
                      patient: "David Lee",
                      doctor: "Dr. Michael Chen",
                      dateTime: "2023-06-17T13:30:00",
                      type: "Physical Exam"
                    },
                    {
                      id: 6,
                      patient: "Jennifer Brown",
                      doctor: "Dr. Emily Wilson",
                      dateTime: "2023-06-18T15:00:00",
                      type: "Follow-up"
                    }
                  ].map(appointment => (
                    <div key={appointment.id} className="py-3 border-b border-gray-100 last:border-0">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium text-gray-800">{appointment.patient}</p>
                          <p className="text-sm text-gray-500">{appointment.type}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-gray-800">
                            {new Date(appointment.dateTime).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric'
                            })}
                          </p>
                          <p className="text-sm text-gray-500">
                            {new Date(appointment.dateTime).toLocaleTimeString('en-US', {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>
                      </div>
                      <div className="mt-1 flex items-center">
                        <span className="text-xs text-gray-400">With:</span>
                        <span className="ml-1 text-xs font-medium text-indigo-600">
                          {appointment.doctor}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
                <button className="mt-4 text-sm text-indigo-600 hover:text-indigo-800 font-medium">
                  View all appointments →
                </button>
              </div>

              {/* Weekly Activity */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 lg:col-span-2">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Weekly Activity</h2>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={weeklyAppointments}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                      <XAxis 
                        dataKey="day" 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fill: '#6B7280' }}
                      />
                      <YAxis 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fill: '#6B7280' }}
                      />
                      <Tooltip 
                        contentStyle={{
                          borderRadius: '8px',
                          border: 'none',
                          boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                        }}
                      />
                      <Legend 
                        layout="horizontal" 
                        verticalAlign="top" 
                        align="right"
                        wrapperStyle={{ paddingBottom: '20px' }}
                      />
                      <Bar 
                        dataKey="appointments" 
                        name="Appointments" 
                        fill="#6366F1" 
                        radius={[4, 4, 0, 0]}
                      />
                      <Bar 
                        dataKey="revenue" 
                        name="Revenue ($)" 
                        fill="#10B981" 
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Revenue & Patient Visits */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* Revenue Trend */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold text-gray-800">Revenue Trend</h2>
                  <select className="text-sm border border-gray-200 rounded-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-indigo-100">
                    <option>Last 6 Months</option>
                    <option>Last Year</option>
                    <option>Last 2 Years</option>
                  </select>
                </div>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={monthlyRevenue}>
                      <defs>
                        <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10B981" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                      <XAxis 
                        dataKey="month" 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fill: '#6B7280' }}
                      />
                      <YAxis 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fill: '#6B7280' }}
                        tickFormatter={(value) => `$${value / 1000}k`}
                      />
                      <Tooltip 
                        formatter={(value) => [`$${value}`, 'Revenue']}
                        labelFormatter={(label) => `Month: ${label}`}
                        contentStyle={{
                          borderRadius: '8px',
                          border: 'none',
                          boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                        }}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="revenue" 
                        stroke="#10B981" 
                        fillOpacity={1} 
                        fill="url(#colorRevenue)" 
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Patient Visits */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold text-gray-800">Patient Visits</h2>
                  <select className="text-sm border border-gray-200 rounded-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-indigo-100">
                    <option>Last 6 Months</option>
                    <option>Last Year</option>
                    <option>Last 2 Years</option>
                  </select>
                </div>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={patientVisits}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                      <XAxis 
                        dataKey="month" 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fill: '#6B7280' }}
                      />
                      <YAxis 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fill: '#6B7280' }}
                      />
                      <Tooltip 
                        contentStyle={{
                          borderRadius: '8px',
                          border: 'none',
                          boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                        }}
                      />
                      <Legend 
                        layout="horizontal" 
                        verticalAlign="top" 
                        align="right"
                        wrapperStyle={{ paddingBottom: '20px' }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="new" 
                        name="New Patients" 
                        stroke="#6366F1" 
                        strokeWidth={2}
                        dot={{ r: 4 }}
                        activeDot={{ r: 6 }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="returning" 
                        name="Returning Patients" 
                        stroke="#F59E0B" 
                        strokeWidth={2}
                        dot={{ r: 4 }}
                        activeDot={{ r: 6 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Recent Activity & Top Doctors */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              {/* Recent Activity */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 lg:col-span-2">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Recent Activity</h2>
                <div className="space-y-4">
                  <ActivityItem 
                    icon={<FiCalendar className="text-indigo-500" />}
                    title="New appointment scheduled"
                    description="Dr. Smith with John Doe for Annual Checkup"
                    time="2 hours ago"
                  />
                  <ActivityItem 
                    icon={<FiUsers className="text-green-500" />}
                    title="New patient registered"
                    description="Jane Smith joined the clinic"
                    time="5 hours ago"
                  />
                  <ActivityItem 
                    icon={<FaUserMd className="text-blue-500" />}
                    title="New doctor onboarded"
                    description="Dr. Johnson joined Cardiology"
                    time="1 day ago"
                  />
                  <ActivityItem 
                    icon={<FiDollarSign className="text-purple-500" />}
                    title="Payment received"
                    description="$250 for appointment #A10025"
                    time="2 days ago"
                  />
                </div>
                <button className="mt-4 text-sm text-indigo-600 hover:text-indigo-800 font-medium">
                  View all activity →
                </button>
              </div>

              {/* Top Performing Doctors */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Top Performing Doctors</h2>
                <div className="space-y-4">
                  <DoctorItem 
                    name="Dr. Sarah Johnson"
                    specialty="Cardiology"
                    appointments={42}
                    revenue={12500}
                    avatar="/avatars/doctor1.jpg"
                  />
                  <DoctorItem 
                    name="Dr. Michael Chen"
                    specialty="Neurology"
                    appointments={38}
                    revenue={11200}
                    avatar="/avatars/doctor2.jpg"
                  />
                  <DoctorItem 
                    name="Dr. Emily Wilson"
                    specialty="Pediatrics"
                    appointments={35}
                    revenue={9800}
                    avatar="/avatars/doctor3.jpg"
                  />
                </div>
                <button className="mt-4 text-sm text-indigo-600 hover:text-indigo-800 font-medium">
                  View all doctors →
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// Improved Summary Card Component
function SummaryCard({ icon, label, value, change }: { 
  icon: React.ReactNode; 
  label: string; 
  value: string | number;
  change?: string;
}) {
  return (
    <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-indigo-50">
          {icon}
        </div>
        <span className={`text-sm font-medium ${
          change?.startsWith('+') ? 'text-green-500' : 'text-red-500'
        }`}>
          {change}
        </span>
      </div>
      <div className="mt-4">
        <h3 className="text-sm font-medium text-gray-500">{label}</h3>
        <p className="text-2xl font-semibold text-gray-800 mt-1">{value}</p>
      </div>
    </div>
  );
}

// Activity Item Component
function ActivityItem({ icon, title, description, time }: {
  icon: React.ReactNode;
  title: string;
  description: string;
  time: string;
}) {
  return (
    <div className="flex items-start">
      <div className="flex-shrink-0 mt-1 mr-3">
        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-50">
          {icon}
        </div>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-800">{title}</p>
        <p className="text-sm text-gray-500 truncate">{description}</p>
        <p className="text-xs text-gray-400 mt-1">{time}</p>
      </div>
    </div>
  );
}

// Doctor Item Component
function DoctorItem({ name, specialty, appointments, revenue, avatar }: {
  name: string;
  specialty: string;
  appointments: number;
  revenue: number;
  avatar: string;
}) {
  return (
    <div className="flex items-center">
      <img 
        src={avatar} 
        alt={name}
        className="w-10 h-10 rounded-full object-cover mr-3"
      />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-800 truncate">{name}</p>
        <p className="text-xs text-gray-500">{specialty}</p>
      </div>
      <div className="text-right">
        <p className="text-sm font-medium text-gray-800">{appointments} apps</p>
        <p className="text-xs text-gray-500">${revenue.toLocaleString()}</p>
      </div>
    </div>
  );
}