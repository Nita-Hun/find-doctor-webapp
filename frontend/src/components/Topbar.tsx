"use client";

import Image from "next/image";
import { useUserProfile } from "@/hooks/userProfile";
import { BellIcon } from "@heroicons/react/24/outline";
import { useRef, useState, useEffect } from "react";
import toast from "react-hot-toast";
import { apiClient } from "@/lib/api-client";

export default function Topbar() {
  const { user, loading, refetch } = useUserProfile();
  const inputFileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  // State for cache buster string (empty initially for SSR)
  const [cacheBuster, setCacheBuster] = useState("");

  // Set cacheBuster only on client side after mount
  useEffect(() => {
    setCacheBuster(`?t=${Date.now()}`);
  }, []);

  const handlePhotoClick = () => {
    if (!uploading) {
      inputFileRef.current?.click();
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) return;

    const file = e.target.files[0];

    if (file.size > 2 * 1024 * 1024) {
      toast.error("File too large (max 2MB).");
      return;
    }

    if (!file.type.startsWith("image/")) {
      toast.error("Invalid file type. Please select an image.");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("You must be logged in.");
      return;
    }

    setUploading(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      await apiClient.post(
        "/api/auth/users/upload-profile-photo",
      );
      toast.success("Profile photo updated");
      await refetch();
    } catch (error: any) {
      const message = error.response?.data?.message || error.message;
      toast.error(message);
    } finally {
      setUploading(false);
      if (inputFileRef.current) inputFileRef.current.value = "";
    }
  };

  return (
    <div className="bg-white shadow-sm px-6 py-4 flex justify-between items-center">
      <input
        ref={inputFileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />

      <div>
        <input
          type="text"
          placeholder="Search..."
          className="border border-gray-300 rounded px-3 py-1 text-sm focus:outline-none"
        />
      </div>

      <div className="flex items-center gap-4">
        <BellIcon className="h-6 w-6 text-gray-500" />

        {loading ? (
          <div className="text-sm text-gray-500">Loading...</div>
        ) : (
          <div
            className={`relative flex items-center gap-2 ${
              uploading ? "cursor-wait" : "cursor-pointer"
            }`}
            onClick={handlePhotoClick}
            title="Click to update profile photo"
          >
            <div className="relative w-8 h-8">
              <Image
                src={user?.profilePhotoUrl || "/default-avatar.png"}
                alt="Profile"
                width={40}
                height={40}
                className="rounded-full"
              />
              {uploading && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <svg
                    className="animate-spin h-4 w-4 text-gray-500"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z"
                    ></path>
                  </svg>
                </div>
              )}
            </div>

            <div className="text-sm">
              <p className="text-gray-500">{user?.role || "Visitor"}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
