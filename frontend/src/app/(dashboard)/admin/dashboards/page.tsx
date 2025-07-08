'use client';

import { useEffect, useState } from 'react';
import { apiClient } from '@/lib/api-client';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend,
  AreaChart, Area, LineChart, Line
} from 'recharts';
import { FaUserMd, FaClinicMedical, FaRegCalendarAlt } from 'react-icons/fa';
import { FiUsers, FiCalendar, FiDollarSign, FiClock } from 'react-icons/fi';
import { IoMdPulse } from 'react-icons/io';
import { BsActivity } from 'react-icons/bs';
import {useRouter} from 'next/navigation';
import { Router } from 'lucide-react';

export default function AdminDashboard() {
  const [counts, setCounts] = useState({
    doctors: 0,
    patients: 0,
    appointments: 0,
    specializations: 0,
  });
  const [stats, setStats] = useState<any>(null);
  const [revenueData, setRevenueData] = useState<any[]>([]);
  const [upcomingAppointments, setUpcomingAppointments] = useState<any[]>([]);
  const [weeklyAppointments, setWeeklyAppointments] = useState<any[]>([]);
  const [recentActivities, setRecentActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchData() {
      try {
        const [
          countsRes,
          revenueRes,
          statsRes,
          upcomingRes,
          weeklyRes,
          recentRes
        ] = await Promise.all([
          apiClient.get('/api/dashboards/counts'),
          apiClient.get('/api/dashboards/revenue'),
          apiClient.get('/api/dashboards/stats'),
          apiClient.get('/api/dashboards/appointments/upcoming'),
          apiClient.get('/api/dashboards/appointments/weekly'),
          apiClient.get('/api/dashboards/activity/recent')
        ]);

        setCounts(countsRes.data);
        setRevenueData(revenueRes.data);
        setStats(statsRes.data);
        setUpcomingAppointments(upcomingRes.data);
        setWeeklyAppointments(weeklyRes.data);
        setRecentActivities(recentRes.data);
      } catch (err) {
        console.error(err);
        setError('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="animate-pulse flex flex-col items-center">
        <div className="h-12 w-12 bg-indigo-200 rounded-full mb-4"></div>
        <div className="h-4 bg-gray-200 rounded w-48"></div>
      </div>
    </div>
  );
  
  if (error) return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="p-6 bg-white rounded-xl shadow-sm max-w-md text-center">
        <div className="text-red-500 text-2xl mb-4">⚠️</div>
        <h2 className="text-xl font-semibold text-gray-800 mb-2">Error Loading Dashboard</h2>
        <p className="text-gray-600">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          Retry
        </button>
      </div>
    </div>
  );

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <Header />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <SummaryCard 
            icon={<FaUserMd size={20} />} 
            label="Doctors" 
            value={counts.doctors} 
            trend="up"
            trendValue="12%"
            color="indigo"
          />
          <SummaryCard 
            icon={<FiUsers size={20} />} 
            label="Patients" 
            value={counts.patients} 
            trend="up"
            trendValue="24%"
            color="emerald"
          />
          <SummaryCard 
            icon={<FiCalendar size={20} />} 
            label="Appointments" 
            value={counts.appointments} 
            trend="down"
            trendValue="8%"
            color="amber"
          />
          <SummaryCard 
            icon={<FaClinicMedical size={20} />} 
            label="Specializations" 
            value={counts.specializations} 
            trend="neutral"
            color="violet"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <ChartCard 
            title="Revenue Trend" 
            icon={<FiDollarSign className="text-emerald-500" />}
            subtitle="Last 12 months"
          >
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis 
                  dataKey="month" 
                  tick={{ fill: '#6B7280', fontSize: 12 }}
                  axisLine={{ stroke: '#E5E7EB' }}
                />
                <YAxis 
                  tick={{ fill: '#6B7280', fontSize: 12 }}
                  axisLine={{ stroke: '#E5E7EB' }}
                />
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: '#FFF',
                    border: 'none',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                    fontSize: '12px'
                  }}
                  formatter={(value) => [`$${value}`, 'Revenue']}
                />
                <Area 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#10B981" 
                  fill="url(#colorRevenue)" 
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard 
            title="Weekly Activity" 
            icon={<BsActivity className="text-indigo-500" />}
            subtitle="Current week"
          >
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={weeklyAppointments}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis 
                  dataKey="day" 
                  tick={{ fill: '#6B7280', fontSize: 12 }}
                  axisLine={{ stroke: '#E5E7EB' }}
                />
                <YAxis 
                  tick={{ fill: '#6B7280', fontSize: 12 }}
                  axisLine={{ stroke: '#E5E7EB' }}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: '#FFF',
                    border: 'none',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                    fontSize: '12px'
                  }}
                />
                <Bar 
                  dataKey="appointments" 
                  name="Appointments" 
                  fill="#6366F1" 
                  radius={[4, 4, 0, 0]}
                />
                <Bar 
                  dataKey="completed" 
                  name="Completed" 
                  fill="#10B981" 
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <UpcomingAppointments appointments={upcomingAppointments} />
          <RecentActivity activities={recentActivities} />
          <StatsCard stats={stats} />
        </div>
      </div>
    </div>
  );
}

// Components
function Header() {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Dashboard Overview</h1>
        <p className="text-gray-500 mt-1">Welcome back! Here's what's happening with your clinic today.</p>
      </div>
      <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-lg shadow-xs border border-gray-100">
        <FiClock className="text-gray-400" />
        <span className="text-sm font-medium text-gray-600">
          {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
        </span>
      </div>
    </div>
  );
}

function SummaryCard({ icon, label, value, trend, trendValue, color }: { 
  icon: React.ReactNode; 
  label: string; 
  value: number;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  color: 'indigo' | 'emerald' | 'amber' | 'violet';
}) {
  const colorClasses = {
    indigo: 'bg-indigo-100 text-indigo-600',
    emerald: 'bg-emerald-100 text-emerald-600',
    amber: 'bg-amber-100 text-amber-600',
    violet: 'bg-violet-100 text-violet-600'
  };

  const trendClasses = {
    up: 'text-emerald-500',
    down: 'text-red-500',
    neutral: 'text-gray-500'
  };

  const trendIcons = {
    up: '↑',
    down: '↓',
    neutral: '→'
  };

  return (
    <div className="bg-white rounded-xl p-5 shadow-xs border border-gray-100 hover:shadow-sm transition-all duration-200">
      <div className="flex justify-between">
        <div className={`flex items-center justify-center w-12 h-12 rounded-lg ${colorClasses[color]}`}>
          {icon}
        </div>
        
        {trend && (
          <div className={`text-xs font-medium ${trendClasses[trend]}`}>
            {trendIcons[trend]} {trendValue}
          </div>
        )}
      </div>
      
      <div className="mt-4">
        <h3 className="text-sm font-medium text-gray-500">{label}</h3>
        <p className="text-2xl font-semibold text-gray-800 mt-1">
          {value.toLocaleString()}
        </p>
      </div>
    </div>
  );
}

function ChartCard({ title, subtitle, icon, children }: { 
  title: string; 
  subtitle?: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-xs border border-gray-100">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
          {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
        </div>
        {icon && (
          <div className="p-2 bg-gray-50 rounded-lg">
            {icon}
          </div>
        )}
      </div>
      {children}
    </div>
  );
}

function UpcomingAppointments({ appointments }: { appointments: any[] }) {
  const router = useRouter(); 
  return (
    <div className="bg-white rounded-xl p-6 shadow-xs border border-gray-100">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold text-gray-800">Upcoming Appointments</h2>
        <button
          onClick={() => router.push('/admin/appointments')}
          className="text-xs font-medium text-indigo-600 hover:text-indigo-700"
        >
          View All
        </button>
      </div>
      
      <div className="space-y-4">
        {appointments.length === 0 ? (
          <div className="text-center py-8">
            <FaRegCalendarAlt className="mx-auto text-gray-300 text-3xl mb-2" />
            <p className="text-gray-500">No upcoming appointments</p>
          </div>
        ) : (
          appointments.slice(0, 5).map(appt => (
            <div key={appt.id} className="flex items-start gap-4 p-3 hover:bg-gray-50 rounded-lg transition-colors">
              <div className={`p-2 rounded-lg ${appt.status === 'confirmed' ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'}`}>
                <FiCalendar size={16} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between">
                    <h3 className="font-medium text-gray-800 truncate">{appt.patientName}</h3>
                    <span className="text-xs text-gray-500">
                      {new Date(appt.dateTime).toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' })}
                      {' • '}
                      {new Date(appt.dateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                <p className="text-sm text-gray-500 truncate">{appt.typeName}</p>
                <div className="mt-1 flex items-center gap-1">
                  <span className="text-xs text-gray-400">With</span>
                  <span className="text-xs font-medium text-indigo-600">{appt.doctorName}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function RecentActivity({ activities }: { activities: any[] }) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-xs border border-gray-100">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold text-gray-800">Recent Activity</h2>
        <button className="text-xs font-medium text-indigo-600 hover:text-indigo-700">
          View All
        </button>
      </div>
      
      <div className="space-y-4">
        {activities.length === 0 ? (
          <div className="text-center py-8">
            <IoMdPulse className="mx-auto text-gray-300 text-3xl mb-2" />
            <p className="text-gray-500">No recent activity</p>
          </div>
        ) : (
          activities.slice(0, 5).map((activity, index) => (
            <div key={index} className="flex gap-3">
              <div className="flex-shrink-0 mt-1">
                <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
              </div>
              <div>
                <p className="text-sm text-gray-800">{activity.description}</p>
                <p className="text-xs text-gray-400 mt-1">
                  {new Date(activity.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function StatsCard({ stats }: { stats: any }) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-xs border border-gray-100">
      <h2 className="text-lg font-semibold text-gray-800 mb-6">Clinic Stats</h2>
      
      <div className="space-y-5">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600">
              <FiDollarSign size={16} />
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Total Revenue</h3>
              <p className="text-lg font-semibold text-gray-800">
                ${stats?.totalRevenue ? Number(stats.totalRevenue).toLocaleString() : '0'}
              </p>
            </div>
          </div>
          <span className="text-xs font-medium text-emerald-500">↑ 12%</span>
        </div>
        
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-100 rounded-lg text-emerald-600">
              <FiCalendar size={16} />
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Avg. Appointments</h3>
              <p className="text-lg font-semibold text-gray-800">
                {stats?.avgAppointments || '0'}/day
              </p>
            </div>
          </div>
          <span className="text-xs font-medium text-emerald-500">↑ 5%</span>
        </div>
        
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-100 rounded-lg text-amber-600">
              <FaUserMd size={16} />
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Patient Growth</h3>
              <p className="text-lg font-semibold text-gray-800">
                {stats?.patientGrowth || '0'}%
              </p>
            </div>
          </div>
          <span className="text-xs font-medium text-red-500">↓ 2%</span>
        </div>
      </div>
    </div>
  );
}