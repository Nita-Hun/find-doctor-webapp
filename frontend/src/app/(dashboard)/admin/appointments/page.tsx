'use client';

import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import AppointmentFormModal from '@/components/AppointmentFormModal';
import ErrorState from '@/components/ErrorState';
import { apiClient } from '@/lib/api-client';
import { Pencil, Trash2 } from 'lucide-react';
import Pagination from '@/components/Pagination';
import { AppointmentDto} from '@/types/Appointment';
import { PagedResponse } from '@/types/PagedResponse';
import { FiSearch } from 'react-icons/fi';


export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<AppointmentDto[]>([]);
  const [selectedAppointment, setSelectedAppointment] = useState<AppointmentDto | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  // For controlled Go to page input:
  const [gotoPageInput, setGotoPageInput] = useState<string>('');

  const fetchAppointments = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiClient.get<PagedResponse<AppointmentDto>>('/api/appointments', {
        params: {
          page: currentPage - 1, // backend expects 0-based page
          size: pageSize,
          search: searchTerm || undefined,
        },
      });

      const pagedData = response.data;

      if (pagedData.content.length === 0 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
        return;
      }

      const data = response.data;
      setAppointments(pagedData.content);
      setTotalPages(data.page.totalPages);
      setTotalItems(data.page.totalElements);

      setGotoPageInput(''); // Clear input on successful load
    } catch (err: any) {
      console.error('Error fetching appointments:', err);
      setError('Failed to load appointments. Please try again.');
      toast.error('Failed to fetch appointments');
    } finally {
      setIsLoading(false);
    }
  };

    useEffect(() => {
      fetchAppointments();
    }, [refreshKey, currentPage, searchTerm, pageSize]);

    const handleDelete = async (id: number) => {
      if (confirm('Are you sure you want to delete this appointment?')) {
        try {
          await apiClient.delete(`/api/appointments/${id}`);
          toast.success('Appointment deleted successfully');
          setRefreshKey((prev) => prev + 1);
        } catch (error) {
          console.error('Error deleting appointment:', error);
          toast.error('Failed to delete appointment');
        }
      }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleSuccess = () => {
    setRefreshKey((prev) => prev + 1);
    setShowModal(false);
    setSelectedAppointment(null);
  };

  const formatDate = (dateString?: string | null) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'N/A';
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Handle Go button click:
  const handleGotoPage = () => {
    const page = Number(gotoPageInput);
    if (!Number.isInteger(page) || page < 1 || page > totalPages) {
      toast.error(`Please enter a valid page number between 1 and ${totalPages}`);
      return;
    }
    if (page !== currentPage) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold text-gray-800">Appointment Management</h1>
        <button
          onClick={() => {
            setSelectedAppointment(null);
            setShowModal(true);
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors text-sm"
          >
          + Add New Appointment
        </button>
      </div>

      {/* Search and filter bar */}
      <div className="mb-6 bg-white p-4 rounded-lg shadow">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-grow text-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="text-gray-400" />
            </div>
            <input 
              type="text"
              value={searchTerm}
              onChange={handleSearch}
              placeholder="Search appointments..."
              className="pl-10 w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-gray-600 text-sm">Rows per page:</span>
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="p-2 border border-gray-300 rounded-md text-sm"
            >
              {[5, 10, 20, 50, 100].map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Loading state */}
      {isLoading && (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}

      {/* Error state */}
      {error && !isLoading && (
        <ErrorState
          error={error}
          onRetry={() => setRefreshKey((prev) => prev + 1)}
        />
      )}

      {/* Empty state */}
      {!isLoading && !error && appointments.length === 0 && (
        <div className="fixed inset-0 flex items-center justify-center bg-white z-20">
          <div className="max-w-md w-full p-8 rounded-lg shadow text-center">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <h3 className="mt-2 text-lg font-medium text-gray-900">
              {searchTerm ? 'No matching appointments found' : 'No appointments scheduled'}
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm ? 'Try adjusting your search' : 'Get started by adding a new appointment'}
            </p>
            <div className="mt-6">
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedAppointment(null);
                  setShowModal(true);
                }}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-700 hover:bg-blue-400 focus:outline-none"
              >
                <svg
                  className="-ml-1 mr-2 h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
                Add Appointment
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Appointments table */}
      {!isLoading && !error && appointments.length > 0 && (
        <div className="bg-white shadow rounded-lg overflow-hidden flex flex-col h-[500px]">
          <div className="flex-1 overflow-y-auto overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-blue-600 hidden md:table-header-group">
                <tr className="transition-colors duration-150">
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Doctor</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Patient</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Date & Time</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Note</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Attachment</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-white uppercase tracking-wider">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-200 text-sm">
                {appointments.map((a) => (
                  <tr
                    key={a.id}
                    className={`flex flex-col md:table-row md:flex-row bg-white md:bg-transparent mb-4 md:mb-0 rounded-lg md:rounded-none shadow md:shadow-none border border-gray-100 md:border-0 even:bg-blue-100`}
                  >
                    {/* Doctor - Combined ID and Name */}
                    <td className="flex justify-between md:table-cell px-4 py-2 md:px-6 md:py-4">
                      <span className="font-medium text-gray-500 md:hidden">Doctor</span>
                      <div className="flex flex-col">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center overflow-hidden">
                            {a.doctorImage ? (
                              <img src={a.doctorImage} alt="" className="object-cover h-full w-full" />
                            ) : (
                              <span className="text-blue-600 font-semibold">
                                {a.doctorName?.charAt(0)}
                              </span>
                            )}
                          </div>
                          <div>
                            <span className="text-gray-800 block">{a.doctorName}</span>
                            <span className="text-xs text-gray-500">ID: {a.doctorId}</span>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Patient */}
                    <td className="flex justify-between md:table-cell px-4 py-2 md:px-6 md:py-4">
                      <span className="font-medium text-gray-500 md:hidden">Patient</span>
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center overflow-hidden">
                          {a.patientImage ? (
                            <img src={a.patientImage} alt="" className="object-cover h-full w-full" />
                          ) : (
                            <span className="text-green-600 font-semibold">
                              {a.patientName?.charAt(0)}
                            </span>
                          )}
                        </div>
                        <span className="text-gray-800">{a.patientName}</span>
                      </div>
                    </td>

                    {/* Type */}
                    <td className="flex justify-between md:table-cell px-4 py-2 md:px-6 md:py-4">
                      <span className="font-medium text-gray-500 md:hidden">Type</span>
                      <span>{a.appointmentTypeName || 'N/A'}</span>
                    </td>

                    {/* Date & Time */}
                    <td className="flex justify-between md:table-cell px-4 py-2 md:px-6 md:py-4">
                      <span className="font-medium text-gray-500 md:hidden">Date & Time</span>
                      <span>{formatDate(a.dateTime)}</span>
                    </td>

                    {/* Note */}
                    <td className="flex justify-between md:table-cell px-4 py-2 md:px-6 md:py-4">
                      <span className="font-medium text-gray-500 md:hidden">Note</span>
                      <span>{a.note || '-'}</span>
                    </td>

                    {/* Attachment */}
                    <td className="flex justify-between md:table-cell px-4 py-2 md:px-6 md:py-4">
                      <span className="font-medium text-gray-500 md:hidden">Attachment</span>
                      {a.attachment ? (
                        <a
                          href={a.attachment}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 underline"
                        >
                          View
                        </a>
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="flex space-x-2 justify-end gap-2 md:table-cell px-4 py-2 md:px-6 md:py-4">
                      <button
                        onClick={() => {
                          setSelectedAppointment(a);
                          setShowModal(true);
                        }}
                        className="text-blue-600 hover:text-blue-800"
                        title="Edit"
                      >
                        <Pencil size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(a.id)}
                        className="text-red-600 hover:text-red-800"
                        title="Delete"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          <Pagination 
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
          />
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <AppointmentFormModal
          appointment={selectedAppointment ?? undefined}
          onClose={() => setShowModal(false)}
          onSuccess={handleSuccess}
        />
      )}
    </div>
  );
}