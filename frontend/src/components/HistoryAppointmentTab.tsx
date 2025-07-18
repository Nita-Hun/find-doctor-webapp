"use client";

import { useEffect, useState } from "react";
import { AppointmentDto } from "@/types/Appointment";
import { apiClient } from "@/lib/api-client";
import { CalendarDaysIcon, ClipboardListIcon } from "lucide-react";
import toast from "react-hot-toast";

interface PagedResponse<T> {
  content: T[];
  page: {
    totalPages: number;
  };
}

const statusColors: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-800 border-yellow-300",
  CONFIRMED: "bg-blue-100 text-blue-800 border-blue-300",
  CANCELED: "bg-red-100 text-red-800 border-red-300",
  COMPLETED: "bg-green-100 text-green-800 border-green-300",
};

function formatDate(dateTimeString: string): string {
  const date = new Date(dateTimeString);
  return date.toLocaleString("en-US", {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function HistoryAppointments() {
  const [appointments, setAppointments] = useState<AppointmentDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(6);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    fetchAppointments();
  }, [currentPage]);

  async function fetchAppointments() {
    setIsLoading(true);
    setError(null);
    try {
      const res = await apiClient.get<PagedResponse<AppointmentDto>>("/api/appointments/my/history", {
        params: {
          page: currentPage - 1,
          size: pageSize,
        },
      });
      const completed = res.data.content.filter((a) => a.status === "COMPLETED");
      setAppointments(completed);
      setTotalPages(res.data.page.totalPages);
      if (completed.length === 0 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      }
    } catch (err) {
      console.error(err);
      setError("Failed to load appointment history.");
      toast.error("Failed to load history.");
    } finally {
      setIsLoading(false);
    }
  }

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div className="text-red-600">{error}</div>;
  if (appointments.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 space-y-4 bg-gray-50 rounded-lg">
        <CalendarDaysIcon className="w-12 h-12 text-gray-400" />
        <p className="text-gray-500 text-lg">No completed appointments yet</p>
        <p className="text-gray-400 text-sm">You will see completed appointments here</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {appointments.map((appointment) => (
          <div
            key={appointment.id}
            className="border rounded-xl overflow-hidden shadow-sm bg-white"
          >
            <div className="p-5">
              <div className="flex justify-between items-start gap-3">
                <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">
                  {appointment.doctorName || "N/A"}
                </h3>
                <span
                  className={`px-3 py-1 text-xs font-medium rounded-full border ${
                    statusColors[appointment.status]
                  }`}
                >
                  {appointment.status}
                </span>
              </div>

              <div className="mt-4 space-y-2 text-sm text-gray-600">
                <div className="flex items-center">
                  <CalendarDaysIcon className="w-4 h-4 mr-2 text-gray-400" />
                  <span>{formatDate(appointment.dateTime)}</span>
                </div>
                <div className="flex items-center">
                  <ClipboardListIcon className="w-4 h-4 mr-2 text-gray-400" />
                  <span>{appointment.appointmentTypeName || "Checkup"}</span>
                </div>

                {appointment.doctorHospitalName && (
                  <div className="flex items-start text-gray-600">
                    <svg className="w-4 h-4 mt-0.5 mr-2 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    <span>{appointment.doctorHospitalName}</span>
                  </div>
                )}

                {appointment.doctorHospitalPhone && (
                  <div className="flex items-start text-gray-600">
                    <svg className="w-4 h-4 mt-0.5 mr-2 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <span>{appointment.doctorHospitalPhone}</span>
                  </div>
                )}

              </div>
            </div>
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="mt-8 flex items-center justify-between">
          <button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
          >
            Previous
          </button>
          <span className="text-sm text-gray-600">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
