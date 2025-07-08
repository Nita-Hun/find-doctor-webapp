// frontend/src/components/UserThumbnail.tsx
import Image from 'next/image';
import { UserDto } from '@/types/UserDto';

interface UserThumbnailProps {
  user: UserDto;
}

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8080';

export default function UserThumbnail({ user }: UserThumbnailProps) {
  const photoUrl = user.profilePhotoUrl
    ? `${backendUrl}${user.profilePhotoUrl}`
    : '/default-profile.png';

  return (
    <div className="w-10 h-10 rounded-full overflow-hidden">
      <Image
        src={photoUrl}
        alt={`${user.email} profile`}
        width={40}
        height={40}
        className="object-cover"
        // Next.js Image requires domains config or unoptimized for external images
        unoptimized={true}
      />
    </div>
  );
}
