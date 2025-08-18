// 'use client';

// import { useState, useEffect } from "react";
// import SpecializationCard from "@/components/SpecializationCard";
// import DoctorCard from "@/components/DoctorCard";

// type Specialization = { id: number; name: string };
// type Doctor = { id: number; name: string; photoUrl: string };

// export default function PatientDashboard() {
//   const [specializations, setSpecializations] = useState<Specialization[]>([]);
//   const [selectedSpecialization, setSelectedSpecialization] = useState<Specialization | null>(null);
//   const [doctors, setDoctors] = useState<Doctor[]>([]);

//   useEffect(() => {
//     fetch("/api/specializations")
//       .then((res) => res.json())
//       .then(setSpecializations)
//       .catch(console.error);
//   }, []);

//   useEffect(() => {
//     if (!selectedSpecialization) {
//       setDoctors([]);
//       return;
//     }
//     fetch(`/api/doctors?specializationId=${selectedSpecialization.id}`)
//       .then((res) => res.json())
//       .then(setDoctors)
//       .catch(console.error);
//   }, [selectedSpecialization]);

//   return (
//     <div className="max-w-5xl mx-auto p-6">
//       <h1 className="text-3xl font-bold mb-6">Welcome to Your Dashboard</h1>

//       {!selectedSpecialization ? (
//         <>
//           <h2 className="text-xl font-semibold mb-4">Select a Specialization</h2>
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//             {specializations.map((spec) => (
//               <div
//                 key={spec.id}
//                 onClick={() => setSelectedSpecialization(spec)}
//                 className="cursor-pointer"
//               >
//                 <SpecializationCard specialization={spec} />
//               </div>
//             ))}
//           </div>
//         </>
//       ) : (
//         <>
//           <button
//             className="mb-4 px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
//             onClick={() => setSelectedSpecialization(null)}
//           >
//             ← Back to Specializations
//           </button>
//           <h2 className="text-xl font-semibold mb-4">
//             Doctors for {selectedSpecialization.name}
//           </h2>
//           {doctors.length === 0 ? (
//             <p>No doctors found for this specialization.</p>
//           ) : (
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//               {doctors.map((doc) => (
//                 <DoctorCard
//                   key={doc.id}
//                   doctor={doc}
//                   specializationId={selectedSpecialization.id}
//                 />
//               ))}
//             </div>
//           )}
//         </>
//       )}
//     </div>
//   );
// }
