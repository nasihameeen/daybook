'use client';

import { useState } from 'react';

interface FilterSectionProps {
  partners: string[];
  documentTypes: string[];
  selectedPartner: string;
  setSelectedPartner: (value: string) => void;
  selectedDocumentType: string;
  setSelectedDocumentType: (value: string) => void;
  selectedStatus: string;
  setSelectedStatus: (value: string) => void;
  selectedNature: string;
  setSelectedNature: (value: string) => void;
  amountRange: { min: string; max: string };
  setAmountRange: (value: { min: string; max: string }) => void;
  showAdvancedFilters: boolean;
  setShowAdvancedFilters: (value: boolean) => void;
  activeFiltersCount: number;
  clearAllFilters: () => void;
}

export default function FilterSection({
  partners,
  documentTypes,
  selectedPartner,
  setSelectedPartner,
  selectedDocumentType,
  setSelectedDocumentType,
  selectedStatus,
  setSelectedStatus,
  selectedNature,
  setSelectedNature,
  amountRange,
  setAmountRange,
  showAdvancedFilters,
  setShowAdvancedFilters,
  activeFiltersCount,
  clearAllFilters
}: FilterSectionProps) {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const statusOptions = [
    { value: 'pending', label: 'Pending', color: 'bg-yellow-100 text-yellow-800', icon: 'ri-time-line' },
    { value: 'approved', label: 'Approved', color: 'bg-green-100 text-green-800', icon: 'ri-check-line' },
    { value: 'rejected', label: 'Rejected', color: 'bg-red-100 text-red-800', icon: 'ri-close-line' },
    { value: 'processing', label: 'Processing', color: 'bg-blue-100 text-blue-800', icon: 'ri-loader-4-line' },
    { value: 'corrected', label: 'Corrected', color: 'bg-purple-100 text-purple-800', icon: 'ri-edit-line' }
  ];

  const natureOptions = [
    { value: 'Sales', label: 'Sales', color: 'text-green-600 bg-green-50', icon: 'ri-arrow-up-line' },
    { value: 'Purchase', label: 'Purchase', color: 'text-blue-600 bg-blue-50', icon: 'ri-shopping-cart-line' },
    { value: 'Expense', label: 'Expense', color: 'text-red-600 bg-red-50', icon: 'ri-money-dollar-circle-line' }
  ];

  const toggleDropdown = (dropdown: string) => {
    setOpenDropdown(openDropdown === dropdown ? null : dropdown);
  };

  const QuickFilterButton = ({ 
    isActive, 
    onClick, 
    children, 
    count 
  }: { 
    isActive: boolean; 
    onClick: () => void; 
    children: React.ReactNode;
    count?: number;
  }) => (
    <button
      onClick={onClick}
      className={`relative px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
        isActive
          ? 'bg-blue-500 text-white'
          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
      }`}
    >
      {children}
      {count !== undefined && count > 0 && (
        <span className={`absolute -top-1 -right-1 w-5 h-5 rounded-full text-xs flex items-center justify-center ${
          isActive ? 'bg-white text-blue-500' : 'bg-blue-500 text-white'
        }`}>
          {count}
        </span>
      )}
    </button>
  );

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm space-y-4">
      {/* Quick Filters */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-900">Filters</h3>
        <div className="flex items-center space-x-2">
          {activeFiltersCount > 0 && (
            <button
              onClick={clearAllFilters}
              className="text-xs text-red-600 hover:text-red-700 font-medium"
            >
              Clear All ({activeFiltersCount})
            </button>
          )}
          <button
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            className="flex items-center text-xs text-blue-600 hover:text-blue-700 font-medium"
          >
            Advanced
            <i className={`ri-arrow-${showAdvancedFilters ? 'up' : 'down'}-s-line ml-1`}></i>
          </button>
        </div>
      </div>

      {/* Nature Quick Filters */}
      <div className="flex flex-wrap gap-2">
        {natureOptions.map((nature) => (
          <QuickFilterButton
            key={nature.value}
            isActive={selectedNature === nature.value}
            onClick={() => setSelectedNature(selectedNature === nature.value ? '' : nature.value)}
          >
            <i className={`${nature.icon} mr-1`}></i>
            {nature.label}
          </QuickFilterButton>
        ))}
      </div>

      {/* Status Quick Filters */}
      <div className="flex flex-wrap gap-2">
        {statusOptions.map((status) => (
          <QuickFilterButton
            key={status.value}
            isActive={selectedStatus === status.value}
            onClick={() => setSelectedStatus(selectedStatus === status.value ? '' : status.value)}
          >
            <i className={`${status.icon} mr-1`}></i>
            {status.label}
          </QuickFilterButton>
        ))}
      </div>

      {/* Advanced Filters */}
      {showAdvancedFilters && (
        <div className="pt-4 border-t border-gray-100 space-y-4">
          {/* Partner and Document Type */}
          <div className="grid grid-cols-2 gap-3">
            {/* Partner Filter */}
            <div className="relative">
              <label className="block text-xs font-medium text-gray-700 mb-1">Partner</label>
              <button
                onClick={() => toggleDropdown('partner')}
                className="w-full flex items-center justify-between px-3 py-2 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors"
              >
                <span className={`text-sm ${selectedPartner ? 'text-gray-900' : 'text-gray-500'}`}>
                  {selectedPartner || 'All Partners'}
                </span>
                <i className={`ri-arrow-down-s-line text-gray-500 transition-transform ${
                  openDropdown === 'partner' ? 'rotate-180' : ''
                }`}></i>
              </button>

              {openDropdown === 'partner' && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-lg border border-gray-200 z-10 max-h-48 overflow-y-auto">
                  <button
                    onClick={() => {
                      setSelectedPartner('');
                      setOpenDropdown(null);
                    }}
                    className="w-full text-left px-3 py-2 hover:bg-gray-50 transition-colors text-sm"
                  >
                    All Partners
                  </button>
                  {partners.map((partner) => (
                    <button
                      key={partner}
                      onClick={() => {
                        setSelectedPartner(partner);
                        setOpenDropdown(null);
                      }}
                      className="w-full text-left px-3 py-2 hover:bg-gray-50 transition-colors text-sm"
                    >
                      {partner}
                      {partner === selectedPartner && (
                        <i className="ri-check-line text-blue-500 float-right"></i>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Document Type Filter */}
            <div className="relative">
              <label className="block text-xs font-medium text-gray-700 mb-1">Document Type</label>
              <button
                onClick={() => toggleDropdown('documentType')}
                className="w-full flex items-center justify-between px-3 py-2 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors"
              >
                <span className={`text-sm ${selectedDocumentType ? 'text-gray-900' : 'text-gray-500'}`}>
                  {selectedDocumentType || 'All Types'}
                </span>
                <i className={`ri-arrow-down-s-line text-gray-500 transition-transform ${
                  openDropdown === 'documentType' ? 'rotate-180' : ''
                }`}></i>
              </button>

              {openDropdown === 'documentType' && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-lg border border-gray-200 z-10 max-h-48 overflow-y-auto">
                  <button
                    onClick={() => {
                      setSelectedDocumentType('');
                      setOpenDropdown(null);
                    }}
                    className="w-full text-left px-3 py-2 hover:bg-gray-50 transition-colors text-sm"
                  >
                    All Types
                  </button>
                  {documentTypes.map((type) => (
                    <button
                      key={type}
                      onClick={() => {
                        setSelectedDocumentType(type);
                        setOpenDropdown(null);
                      }}
                      className="w-full text-left px-3 py-2 hover:bg-gray-50 transition-colors text-sm"
                    >
                      {type}
                      {type === selectedDocumentType && (
                        <i className="ri-check-line text-blue-500 float-right"></i>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Amount Range */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Amount Range</label>
            <div className="grid grid-cols-2 gap-2">
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">$</span>
                <input
                  type="number"
                  placeholder="Min"
                  value={amountRange.min}
                  onChange={(e) => setAmountRange({ ...amountRange, min: e.target.value })}
                  className="w-full pl-8 pr-3 py-2 bg-gray-50 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">$</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={amountRange.max}
                  onChange={(e) => setAmountRange({ ...amountRange, max: e.target.value })}
                  className="w-full pl-8 pr-3 py-2 bg-gray-50 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}