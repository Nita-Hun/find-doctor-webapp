// app/dashboard/admin/page.tsx
'use client';

import {
  PieChart, Pie, Cell,
  BarChart, Bar, XAxis, YAxis, Tooltip,
  LineChart, Line, CartesianGrid, Legend, ResponsiveContainer
} from 'recharts';

const COLORS = ['#FFD93D', '#A9D6E5'];

const studentData = [
  { name: 'Boys', value: 1234 },
  { name: 'Girls', value: 1134 }
];

const attendanceData = [
  { day: 'Mon', present: 50, absent: 30 },
  { day: 'Tue', present: 70, absent: 60 },
  { day: 'Wed', present: 90, absent: 70 },
  { day: 'Thu', present: 65, absent: 55 },
  { day: 'Fri', present: 60, absent: 50 }
];

const financeData = [
  { month: 'Jan', income: 2400, expense: 1400 },
  { month: 'Feb', income: 3200, expense: 1800 },
  { month: 'Mar', income: 2800, expense: 2100 },
  { month: 'Apr', income: 3600, expense: 1700 }
];

const events = [
  { title: 'Summer Camp Trip', time: '12:00 PM - 2:00 PM', description: 'Outdoor activities and games for all students.' },
  { title: 'Music Concert', time: '12:00 PM - 3:00 PM', description: 'Classic music concert for all students and teachers.' },
  { title: 'Science Fair', time: '2:00 PM - 4:00 PM', description: 'Traditional science festival for all students.' },
];

const announcements = [
  { title: 'About 4A Math Test', date: '2025-01-02', desc: 'Math test on Jan 2 cancelled. New date will be announced.' },
  { title: 'Field Trip Rescheduled', date: '2025-01-05', desc: 'Trip to London rescheduled. Please check notice.' },
];

export default function AdminDashboard() {
  return (
    <>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <InfoCard label="Doctors" value="132" bg="bg-purple-100" />
        <InfoCard label="Patients" value="421" bg="bg-yellow-100" />
        <InfoCard label="Appointments" value="89" bg="bg-purple-100" />
        <InfoCard label="Specializations" value="12" bg="bg-yellow-100" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="bg-white p-4 rounded-xl shadow col-span-1">
          <h2 className="font-semibold mb-2">Patients Gender</h2>
          <PieChart width={250} height={200}>
            <Pie data={studentData} cx="50%" cy="50%" outerRadius={60} fill="#8884d8" dataKey="value">
              {studentData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
          </PieChart>
        </div>
        <div className="bg-white p-4 rounded-xl shadow col-span-2">
          <h2 className="font-semibold mb-2">Weekly Attendance</h2>
          <BarChart width={500} height={200} data={attendanceData}>
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="present" fill="#FFD93D" />
            <Bar dataKey="absent" fill="#A9D6E5" />
          </BarChart>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="bg-white p-4 rounded-xl shadow">
          <h2 className="font-semibold mb-2">Finance</h2>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={financeData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="income" stroke="#7BDFF2" strokeWidth={2} />
              <Line type="monotone" dataKey="expense" stroke="#B28DFF" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white p-4 rounded-xl shadow">
          <h2 className="font-semibold mb-2">Events</h2>
          <ul className="space-y-3">
            {events.map((e, i) => (
              <li key={i} className="border-l-4 border-blue-500 pl-2">
                <p className="text-sm font-medium">{e.title}</p>
                <p className="text-xs text-gray-500">{e.description}</p>
                <p className="text-xs text-gray-400">{e.time}</p>
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-white p-4 rounded-xl shadow">
          <h2 className="font-semibold mb-2">Announcements</h2>
          <ul className="space-y-3">
            {announcements.map((a, i) => (
              <li key={i} className="border-l-4 border-green-500 pl-2">
                <p className="text-sm font-medium">{a.title}</p>
                <p className="text-xs text-gray-500">{a.desc}</p>
                <p className="text-xs text-gray-400">{a.date}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}

function InfoCard({ label, value, bg }: { label: string; value: string; bg: string }) {
  return (
    <div className={`rounded-xl p-4 shadow ${bg}`}>
      <div className="text-sm text-gray-600">2024/25</div>
      <h3 className="text-xl font-bold">{value}</h3>
      <p className="text-sm text-gray-700">{label}</p>
    </div>
  );
}
