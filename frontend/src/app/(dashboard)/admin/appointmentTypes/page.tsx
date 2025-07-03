'use client';

import { useEffect, useState } from 'react';
import { apiClient } from '@/lib/api-client';
import toast from 'react-hot-toast';
import AppointmentTypeFormModal from '@/components/AppointmentTypeFormModal';
import AppointmentTypesTable from '@/components/AppointmentTypeTable';
import TableSearch from '@/components/TableSearch';
import PageHeader from '@/components/PageHeader';
import LoadingState from '@/components/LoadingState';
import ErrorState from '@/components/ErrorState';
import EmptyState from '@/components/EmptyState';
import Pagination from '@/components/Pagination';

interface AppointmentType {
  id: number;
  name: string;
  price: number;
  createdAt?: string;
  updatedAt?: string;
}

export default function AppointmentTypesPage() {
  const [types, setTypes] = useState<AppointmentType[]>([]);
  const [selectedType, setSelectedType] = useState<AppointmentType | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [totalItems, setTotalItems] = useState(0);

  const pageSize = 5;

  const fetchTypes = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiClient.get('/api/appointment-types');
      const typesData = Array.isArray(response.data) 
        ? response.data 
        : response.data?.content || response.data?.types || [];
      
      if (Array.isArray(typesData)) {
        setTypes(typesData);
      } else {
        setError('Invalid data format received from server');
        setTypes([]);
      }
    } catch (error) {
      console.error('Error fetching appointment types:', error);
      setError('Failed to load appointment types. Please try again.');
      setTypes([]);
      toast.error('Failed to fetch appointment types');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTypes();
  }, [refreshKey]);

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this appointment type?')) {
      try {
        await apiClient.delete(`/api/appointment-types/${id}`);
        toast.success('Appointment type deleted successfully');
        setRefreshKey(prev => prev + 1);
      } catch (error) {
        console.error('Error deleting appointment type:', error);
        toast.error('Failed to delete appointment type');
      }
    }
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    setCurrentPage(1);
  };

  const filteredTypes = types.filter(type => 
    type.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    type.price.toString().includes(searchTerm)
  );

  const totalPages = Math.ceil(filteredTypes.length / pageSize);
  const paginatedTypes = filteredTypes.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handleSuccess = () => {
    setRefreshKey(prev => prev + 1);
    setShowModal(false);
    setSelectedType(null);
    setCurrentPage(1);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <PageHeader 
        title="Appointment Types" 
        onAddClick={() => {
          setSelectedType(null);
          setShowModal(true);
        }} 
      />

      <TableSearch 
        searchTerm={searchTerm} 
        onSearch={handleSearch} 
        placeholder="Search by name or price..." 
      />

      {isLoading && <LoadingState />}

      {error && !isLoading && (
        <ErrorState 
          error={error} 
          onRetry={() => setRefreshKey(prev => prev + 1)} 
        />
      )}

      {!isLoading && !error && filteredTypes.length === 0 && (
        <EmptyState 
          searchTerm={searchTerm}
          onAddClick={() => {
            setSearchTerm('');
            setSelectedType(null);
            setShowModal(true);
          }}
        />
      )}

      {!isLoading && !error && filteredTypes.length > 0 && (
        <>
          <AppointmentTypesTable 
            types={paginatedTypes}
            onEdit={(type) => {
              setSelectedType(type);
              setShowModal(true);
            }}
            onDelete={handleDelete}
          />
          
          <Pagination 
            currentPage={currentPage}
            totalPages={totalItems}
            onPageChange={setCurrentPage}
            totalItems={filteredTypes.length}
            pageSize={pageSize}
          />
        </>
      )}

      {showModal && (
        <AppointmentTypeFormModal
          appointmentType={selectedType}
          onClose={() => setShowModal(false)}
          onSuccess={handleSuccess}
        />
      )}
    </div>
  );
}