interface ProfileCardProps {
  doctor: {
    name: string;
    specialization: string;
    rating: number;
    ratingCount: number;
    // photoUrl?: string;  // remove or make optional
  };
}

export default function ProfileCard({ doctor }: ProfileCardProps) {
  return (
    <div className="flex flex-col items-start space-y-2">
      {/* Optionally, remove the image tag if you have one */}
      {/* <img src={doctor.photoUrl} alt={doctor.name} className="w-16 h-16 rounded-full" /> */}

      <h3 className="text-xl font-bold">{doctor.name}</h3>
      <p className="text-gray-600">{doctor.specialization}</p>
      <p>
        Rating: {doctor.rating.toFixed(1)} ({doctor.ratingCount} reviews)
      </p>
    </div>
  );
}
