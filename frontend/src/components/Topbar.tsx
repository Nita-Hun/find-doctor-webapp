"use client";

import Image from "next/image";
import { useUserProfile } from "@/hooks/userProfile";
import { useRef, useState, useEffect } from "react";
import { Menu } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import toast from "react-hot-toast";
import { apiClient } from "@/lib/api-client";
import { useRouter } from "next/navigation";

export default function Topbar() {
  const { user, loading, refetch } = useUserProfile();
  const inputFileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [cacheBuster, setCacheBuster] = useState("");
  const router = useRouter();

  // Refresh cache when the component mounts or user updates
  useEffect(() => {
    setCacheBuster(`?t=${Date.now()}`);
  }, [user]);

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
        "/api/auth/upload-profile-photo",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("Profile photo updated");

      // Refresh profile and force reload of image
      await refetch();
      setCacheBuster(`?t=${Date.now()}`);
    } catch (error: any) {
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setUploading(false);
      if (inputFileRef.current) inputFileRef.current.value = "";
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  const BACKEND_URL = "http://localhost:8080";

  // Make sure to restart `npm run dev` if you change next.config.js remotePatterns
  const photoSrc =
    user && user.profilePhotoUrl
      ? `${BACKEND_URL}${user.profilePhotoUrl}${cacheBuster}`
    : "/assets/images/default-admin.png";

  return (
    <div className="bg-white shadow-sm px-6 py-4 flex justify-end items-center">
      <input
        ref={inputFileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />

      {loading ? (
        <div className="text-sm text-gray-500">Loading...</div>
      ) : (
        <Menu as="div" className="relative inline-block text-left">
          <div>
            <Menu.Button className="flex items-center gap-2 focus:outline-none">
              <div
                className={`relative w-8 h-8 ${
                  uploading ? "cursor-wait" : "cursor-pointer"
                }`}
                onClick={handlePhotoClick}
                title="Click to update profile photo"
              >
                <Image
                  src={photoSrc}
                  alt="Profile"
                  width={40}
                  height={40}
                  unoptimized
                  className="rounded-full object-cover"
                />

                {uploading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-white/70 rounded-full">
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
              <span className="text-sm font-medium text-gray-700">
                Welcome, {user?.role || "User"}
              </span>
              <ChevronDownIcon className="w-4 h-4 text-gray-500" />
            </Menu.Button>
          </div>

          <Menu.Items className="absolute right-0 mt-2 w-40 origin-top-right bg-white border border-gray-200 divide-y divide-gray-100 rounded-md shadow-lg focus:outline-none z-50">
            <div className="py-1">
              <Menu.Item>
                {({ active }) => (
                  <button
                    onClick={() => router.push("/admin/profiles")}
                    className={`${
                      active ? "bg-gray-100" : ""
                    } flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700`}
                  >
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.5 20.25a8.25 8.25 0 1115 0H4.5z"
                      />
                    </svg>
                    Profile
                  </button>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <button
                    onClick={handleLogout}
                    className={`${
                      active ? "bg-gray-100" : ""
                    } flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700`}
                  >
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6A2.25 2.25 0 005.25 5.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3-3H9m0 0l3-3m-3 3l3 3"
                      />
                    </svg>
                    Logout
                  </button>
                )}
              </Menu.Item>
            </div>
          </Menu.Items>
        </Menu>
      )}
    </div>
  );
}
