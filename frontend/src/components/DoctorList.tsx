// // components/DoctorList.tsx
// export default function DoctorList({ colleagues }: { colleagues: any[] }) {
//   return (
//     <div>
//       <h4 className="text-md font-semibold mb-2">Doctor List</h4>
//       <ul className="space-y-2">
//         {colleagues.slice(0, 4).map((doc) => (
//           <li key={doc.id} className="flex items-center space-x-2">
//             <img
//               src={doc.photoUrl}
//               alt={doc.name}
//               className="w-8 h-8 rounded-full object-cover"
//             />
//             <div>
//               <p className="text-sm font-medium">{doc.name}</p>
//               <p className="text-xs text-gray-500">{doc.specialization}</p>
//             </div>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// }
