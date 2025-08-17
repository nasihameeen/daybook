'use client';

interface SearchBarProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  placeholder?: string;
}

export default function SearchBar({ searchTerm, setSearchTerm, placeholder = "Search documents..." }: SearchBarProps) {
  const clearSearch = () => {
    setSearchTerm('');
  };

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <i className="ri-search-line text-gray-400"></i>
        </div>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder={placeholder}
          className="block w-full pl-10 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        {searchTerm && (
          <button
            onClick={clearSearch}
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
          >
            <i className="ri-close-circle-line text-gray-400 hover:text-gray-600"></i>
          </button>
        )}
      </div>
      
      {searchTerm && (
        <div className="mt-2 text-xs text-gray-600">
          <i className="ri-information-line mr-1"></i>
          Searching in document numbers, partner names, types, categories, and internal references
        </div>
      )}
    </div>
  );
}