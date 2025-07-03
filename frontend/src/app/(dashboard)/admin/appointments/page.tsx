'use client';

import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import AppointmentFormModal from '@/components/AppointmentFormModal';
import Pagination from '@/components/Pagination';
import LoadingState from '@/components/LoadingState';
import ErrorState from '@/components/ErrorState';
import { apiClient } from '@/lib/api-client';

interface AppointmentDto {
  id: number;
  doctorId: number;
  patientId: number;
  appointmentTypeId: number;
  dateTime: string;
  status: string;
  attachment?: string;
  doctorName?: string;
  patientName?: string;
  typeName?: string;
  doctorImage?: string;
  patientImage?: string;
}

const statusColors: Record<string, string> = {
  scheduled: 'bg-blue-100 text-blue-800',
  completed: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
  noshow: 'bg-yellow-100 text-yellow-800',
};

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<AppointmentDto[]>([]);
  const [selectedAppointment, setSelectedAppointment] = useState<AppointmentDto | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [totalItems, setTotalItems] = useState(0);

  const pageSize = 5;

  const fetchAppointments = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiClient.get('/api/appointments', {
        params: {
          page: currentPage - 1,
          size: pageSize,
          search: searchTerm,
          status: statusFilter,
        },
      });
      const {content: appointments, totalElements} = response.data;
      const data = response.data;

      const enhancedAppointments = await Promise.all(
        appointments.map(async (appt: AppointmentDto) => {
          if (!appt.doctorName || !appt.patientName || !appt.typeName) {
            try {
              const [doctorRes, patientRes, typeRes] = await Promise.all([
                apiClient.get(`/api/doctors/${appt.doctorId}`),
                apiClient.get(`/api/patients/${appt.patientId}`),
                apiClient.get(`/api/appointment-types/${appt.appointmentTypeId}`),
              ]);
              return {
                ...appt,
                doctorName: doctorRes.data.name || `${doctorRes.data.firstname} ${doctorRes.data.lastname}`,
                patientName: patientRes.data.name || `${patientRes.data.firstname} ${patientRes.data.lastname}`,
                typeName: typeRes.data.name,
                doctorImage: doctorRes.data.image,
                patientImage: patientRes.data.image,
              };
            } catch {
              return {
                ...appt,
                doctorName: `Doctor ${appt.doctorId}`,
                patientName: `Patient ${appt.patientId}`,
                typeName: `Type ${appt.appointmentTypeId}`,
              };
            }
          }
          return appt;
        })
      );

      setAppointments(enhancedAppointments);
      setTotalItems(totalElements);
      setIsLoading(false);
      setError(null);
    } catch (err: any) {
      console.error('Error fetching appointments:', err);
      setError('Failed to load appointments. Please try again.');
      toast.error('Failed to fetch appointments');
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, [refreshKey, currentPage, searchTerm, statusFilter, pageSize]);

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this appointment?')) {
      try {
        await apiClient.delete(`/api/appointments/${id}`);
        toast.success('Appointment deleted successfully');
        setRefreshKey(prev => prev + 1);
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

  const handleStatusFilter = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStatusFilter(e.target.value);
    setCurrentPage(1);
  };

  const filteredAppointments = appointments.filter(appt => {
    const search = searchTerm.toLowerCase();
    return (
      (appt.doctorName?.toLowerCase().includes(search) ?? false) ||
      (appt.patientName?.toLowerCase().includes(search) ?? false) ||
      (appt.typeName?.toLowerCase().includes(search) ?? false)
    );
  })

  const handleSuccess = () => {
    setRefreshKey(prev => prev + 1);
    setShowModal(false);
    setSelectedAppointment(null);
    setCurrentPage(1);
  };

  const formatDate = (dateString?: string | null) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    if(isNaN(date.getTime())) return 'N/A';
    
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
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
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
        >
          + Add New Appointment
        </button>
      </div>

      {/* Search & Filter */}
      <div className="mb-6 bg-white p-4 rounded-lg shadow">
        <div className="flex flex-col md:flex-row gap-4">
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearch}
            placeholder="Search by doctor, patient, or type..."
            className="flex-grow p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <div className="flex items-center gap-2">
            <label htmlFor="statusFilter" className="text-gray-600">Status:</label>
            <select
              id="statusFilter"
              value={statusFilter}
              onChange={handleStatusFilter}
              className="p-2 border border-gray-300 rounded-md"
            >
              <option value="">All</option>
              <option value="scheduled">Scheduled</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
              <option value="noshow">No Show</option>
            </select>
          </div>
        </div>
      </div>

      {/* Loading */}
      {isLoading && <LoadingState />}

      {/* Error */}
      {error && !isLoading && (
        <ErrorState error={error} onRetry={() => setRefreshKey(prev => prev + 1)} />
      )}

      {/* Empty state */}
      {!isLoading && !error && filteredAppointments.length === 0 && (
        <div className="bg-white p-8 rounded-lg shadow text-center">
          <h3 className="text-lg font-medium text-gray-900">
            {searchTerm || statusFilter ? 'No matching appointments found' : 'No appointments scheduled'}
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm || statusFilter ? 'Try adjusting your search or filter' : 'Get started by adding a new appointment'}
          </p>
          <div className="mt-6">
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedAppointment(null);
                setShowModal(true);
              }}
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
            >
              + Add Appointment
            </button>
          </div>
        </div>
      )}

      {/* Table */}
      {!isLoading && !error && filteredAppointments.length > 0 && (
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Doctor
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Patient
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date & Time
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {appointments.map((appt) => (
                  <tr key={appt.id} className="hover:bg-gray-50">
                    {/* Doctor Column */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                          {appt.doctorImage ? (
                            <img
                              src={appt.doctorImage}
                              alt={appt.doctorName}
                              className="h-10 w-10 rounded-full object-cover"
                            />
                          ) : (
                            <span className="text-blue-600 font-medium">
                              {appt.doctorName?.charAt(0) || 'D'}
                            </span>
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {appt.doctorName || `Doctor ${appt.doctorId}`}
                          </div>
                          <div className="text-sm text-gray-500">
                            ID: {appt.doctorId}
                          </div>
                        </div>
                      </div>
                    </td>
                    
                    {/* Patient Column */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                          {appt.patientImage ? (
                            <img
                              src={appt.patientImage}
                              alt={appt.patientName}
                              className="h-10 w-10 rounded-full object-cover"
                            />
                          ) : (
                            <span className="text-green-600 font-medium">
                              {appt.patientName?.charAt(0) || 'P'}
                            </span>
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {appt.patientName || `Patient ${appt.patientId}`}
                          </div>
                          <div className="text-sm text-gray-500">
                            ID: {appt.patientId}
                          </div>
                        </div>
                      </div>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {appt.typeName}
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(appt.dateTime)}
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${statusColors[appt.status.toLowerCase()] || 'bg-gray-100 text-gray-800'}`}>
                        {appt.status.replace('_', ' ')}
                      </span>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => {
                          setSelectedAppointment(appt);
                          setShowModal(true);
                        }}
                        className="text-blue-600 hover:text-blue-900 mr-4"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(appt.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <Pagination 
              currentPage={currentPage}
              totalPages={Math.ceil(totalItems / pageSize)}
              onPageChange={setCurrentPage}
              totalItems={filteredAppointments.length}
              pageSize={pageSize}
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