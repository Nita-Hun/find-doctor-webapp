import { FiPlus } from 'react-icons/fi';

interface PageHeaderProps {
  title: string;
  onAddClick: () => void;
}

export default function PageHeader({ title, onAddClick }: PageHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
      <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
      <button
        onClick={onAddClick}
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
      >
        <FiPlus className="inline mr-1" /> Add New
      </button>
    </div>
  );
}