import { FiPlus } from 'react-icons/fi';

interface EmptyStateProps {
  searchTerm: string;
  onAddClick: () => void;
}

export default function EmptyState({ searchTerm, onAddClick }: EmptyStateProps) {
  return (
    <div className="bg-white p-8 rounded-lg shadow text-center">
      <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
      </svg>
      <h3 className="mt-2 text-lg font-medium text-gray-900">
        {searchTerm ? 'No matching appointment types found' : 'No appointment types available'}
      </h3>
      <p className="mt-1 text-sm text-gray-500">
        {searchTerm ? 'Try adjusting your search' : 'Get started by adding a new appointment type'}
      </p>
      <div className="mt-6">
        <button
          onClick={onAddClick}
          className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
        >
          <FiPlus className="-ml-1 mr-2 h-5 w-5" />
          Add Appointment Type
        </button>
      </div>
    </div>
  );
}