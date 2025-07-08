// 'use client';
// import { useEffect, useState } from 'react';

// interface Appointment {
//   id: number;
//   patientName: string;
//   dateTime: string;
//   status: string;
// }

// export default function DoctorDashboard() {
//   const [appointments, setAppointments] = useState<Appointment[]>([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     async function fetchAppointments() {
//       // call your backend API to fetch doctor's upcoming appointments
//       const res = await fetch('/api/doctor/appointments/upcoming');
//       const data = await res.json();
//       setAppointments(data);
//       setLoading(false);
//     }
//     fetchAppointments();
//   }, []);

//   if (loading) return <p>Loading appointments...</p>;

//   return (
//     <div className="p-6">
//       <h1 className="text-3xl font-bold mb-6">Welcome, Doctor</h1>

//       <section className="mb-6 grid grid-cols-2 gap-4">
//         <div className="p-4 bg-green-100 rounded shadow">
//           <h2 className="text-lg font-semibold">Upcoming Appointments</h2>
//           <p className="text-4xl">{appointments.length}</p>
//           <a href="/doctor/appointments" className="text-blue-600 underline mt-2 inline-block">View All</a>
//         </div>
//         <div className="p-4 bg-yellow-100 rounded shadow">
//           <h2 className="text-lg font-semibold">Notifications</h2>
//           <p>No new notifications</p>
//         </div>
//       </section>

//       <section>
//         <h2 className="text-xl font-semibold mb-4">Upcoming Appointments</h2>
//         <table className="w-full border-collapse">
//           <thead>
//             <tr className="bg-gray-200">
//               <th className="border p-2 text-left">Patient</th>
//               <th className="border p-2 text-left">Date & Time</th>
//               <th className="border p-2 text-left">Status</th>
//             </tr>
//           </thead>
//           <tbody>
//             {appointments.length === 0 ? (
//               <tr><td colSpan={3} className="p-4 text-center">No upcoming appointments</td></tr>
//             ) : (
//               appointments.map((appt) => (
//                 <tr key={appt.id} className="hover:bg-gray-100">
//                   <td className="border p-2">{appt.patientName}</td>
//                   <td className="border p-2">{new Date(appt.dateTime).toLocaleString()}</td>
//                   <td className="border p-2">{appt.status}</td>
//                 </tr>
//               ))
//             )}
//           </tbody>
//         </table>
//       </section>
//     </div>
//   );
// }
