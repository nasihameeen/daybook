'use client';

import { useState, useMemo } from 'react';
import Header from '@/components/Header';
import TabBar from '@/components/TabBar';
import DocumentCard from './DocumentCard';
import DocumentDetailModal from './DocumentDetailModal';

interface Document {
  id: string;
  documentNumber: string;
  documentType: string;
  documentNature: 'Sales' | 'Purchase' | 'Expense';
  partnerName: string;
  partnerType: 'customer' | 'supplier' | 'employee';
  amount: number;
  currency: string;
  uploadDate: string;
  documentDate: string;
  status: 'pending' | 'approved' | 'rejected' | 'processing';
  correctedBy?: string;
  correctorDesignation?: string;
  category: string;
  subcategory: string;
  internalReference?: string;
  vatInclusive: boolean;
  outstandingAmount: number;
  fileType: 'pdf' | 'image' | 'other';
  fileName: string;
  fileSize: number;
  preview?: string;
}

export default function FilesPage() {
  const [selectedTimeRange, setSelectedTimeRange] = useState('30');
  const [selectedPartner, setSelectedPartner] = useState('');
  const [selectedDocumentTypes, setSelectedDocumentTypes] = useState<string[]>([]);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [selectedNatures, setSelectedNatures] = useState<string[]>([]);
  const [amountRange, setAmountRange] = useState({ min: '', max: '' });
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [sortBy, setSortBy] = useState('uploadDate');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);

  // Mock user role - in real app, get from auth context
  const userRole = 'accountant'; // 'user' | 'accountant' | 'manager' | 'owner'

  // Generate 50 sample documents with realistic data
  const generateSampleDocuments = (): Document[] => {
    const partners = [
      'Premium Retail Solutions Ltd', 'Global Office Supplies Inc', 'Metro Power & Gas Company',
      'TechSoft Solutions Ltd', 'Downtown Restaurant Group', 'Professional Cleaning Services',
      'Michael Rodriguez', 'Lisa Chen', 'Sarah Johnson', 'Elite Manufacturing Corp',
      'City Bank Services', 'Prime Logistics Ltd', 'Advanced Tech Systems', 'Green Energy Co',
      'Quality Assurance Inc', 'Digital Marketing Pro', 'Secure Storage Ltd', 'Fast Transport Co',
      'Creative Design Studio', 'Business Consulting Group', 'Medical Supplies Corp', 'Food Distribution Ltd',
      'Construction Materials Inc', 'Insurance Services Co', 'Legal Advisory Group', 'Training Solutions Ltd',
      'Equipment Rental Co', 'Software Development Inc', 'Marketing Agency Ltd', 'Financial Services Group'
    ];

    const documentTypes = [
      'Sales Invoice', 'Purchase Order', 'Utility Bill', 'Salary Slip', 'Vendor Invoice',
      'Cash Receipt', 'Travel Expense', 'Service Invoice', 'Equipment Purchase', 'Rent Payment',
      'Insurance Premium', 'Legal Fee', 'Consulting Fee', 'Software License', 'Marketing Invoice',
      'Training Cost', 'Maintenance Bill', 'Fuel Receipt', 'Office Supplies', 'Communication Bill'
    ];

    const categories = [
      'Sales & Revenue', 'Purchases & Procurement', 'Utilities & Services', 'HR & Payroll',
      'IT & Technology', 'Travel & Entertainment', 'Facilities & Maintenance', 'Marketing & Advertising',
      'Legal & Professional', 'Insurance & Risk', 'Training & Development', 'Equipment & Assets'
    ];

    const documents: Document[] = [];
    const now = new Date();

    for (let i = 1; i <= 50; i++) {
      // Generate dates within the last 30 days with realistic distribution
      const daysAgo = Math.floor(Math.random() * 30);
      const uploadDate = new Date(now.getTime() - (daysAgo * 24 * 60 * 60 * 1000));
      const documentDate = new Date(uploadDate.getTime() - (Math.random() * 5 * 24 * 60 * 60 * 1000));

      const partnerName = partners[Math.floor(Math.random() * partners.length)];
      const documentType = documentTypes[Math.floor(Math.random() * documentTypes.length)];
      const category = categories[Math.floor(Math.random() * categories.length)];
      
      const isEmployee = ['Michael Rodriguez', 'Lisa Chen', 'Sarah Johnson'].includes(partnerName);
      const partnerType = isEmployee ? 'employee' : (Math.random() > 0.5 ? 'supplier' : 'customer');
      
      const documentNature = isEmployee ? 'Expense' : 
        (partnerType === 'customer' ? 'Sales' : 
         (Math.random() > 0.3 ? 'Purchase' : 'Expense'));

      const amount = Math.round((Math.random() * 50000 + 100) * 100) / 100;
      const outstandingAmount = Math.random() > 0.7 ? Math.round(amount * Math.random() * 100) / 100 : 0;
      
      const statuses: ('pending' | 'approved' | 'rejected' | 'processing')[] = 
        ['pending', 'approved', 'rejected', 'processing'];
      const status = statuses[Math.floor(Math.random() * statuses.length)];

      const fileTypes: ('pdf' | 'image' | 'other')[] = ['pdf', 'image', 'other'];
      const fileType = fileTypes[Math.floor(Math.random() * fileTypes.length)];

      // Some documents have corrections
      const hasCorrectionr = Math.random() > 0.8;

      documents.push({
        id: i.toString(),
        documentNumber: `${documentNature.substring(0, 3).toUpperCase()}-2024-${i.toString().padStart(3, '0')}`,
        documentType,
        documentNature,
        partnerName,
        partnerType,
        amount,
        currency: 'USD',
        uploadDate: uploadDate.toISOString(),
        documentDate: documentDate.toISOString().split('T')[0],
        status,
        correctedBy: hasCorrectionr ? 'Sarah Johnson' : undefined,
        correctorDesignation: hasCorrectionr ? 'Senior Accountant' : undefined,
        category,
        subcategory: `${category} - ${documentType}`,
        internalReference: Math.random() > 0.5 ? `REF-2024-${i.toString().padStart(3, '0')}` : undefined,
        vatInclusive: Math.random() > 0.5,
        outstandingAmount,
        fileType,
        fileName: `${documentType.toLowerCase().replace(/\s+/g, '_')}_${i}.${fileType === 'image' ? 'jpg' : 'pdf'}`,
        fileSize: Math.floor(Math.random() * 2000000 + 50000),
        preview: Math.random() > 0.7 ? `https://readdy.ai/api/search-image?query=business%20document%20$%7BdocumentType.toLowerCase%28%29%7D%2C%20professional%20format%2C%20company%20letterhead%2C%20clean%20layout%2C%20white%20background&width=400&height=300&seq=doc${i}&orientation=landscape` : undefined
      });
    }

    return documents.sort((a, b) => new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime());
  };

  const documents = useMemo(() => generateSampleDocuments(), []);
  const partners = Array.from(new Set(documents.map(doc => doc.partnerName))).sort();
  const documentTypes = Array.from(new Set(documents.map(doc => doc.documentType))).sort();

  const statusOptions = [
    { value: 'pending', label: 'Pending', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'approved', label: 'Approved', color: 'bg-green-100 text-green-800' },
    { value: 'rejected', label: 'Rejected', color: 'bg-red-100 text-red-800' },
    { value: 'processing', label: 'Processing', color: 'bg-blue-100 text-blue-800' }
  ];

  const natureOptions = [
    { value: 'Sales', label: 'Sales', color: 'text-green-600 bg-green-50' },
    { value: 'Purchase', label: 'Purchase', color: 'text-blue-600 bg-blue-50' },
    { value: 'Expense', label: 'Expense', color: 'text-red-600 bg-red-50' }
  ];

  const timeRangeOptions = [
    { value: 'today', label: 'Today' },
    { value: '7', label: 'Last 7 Days' },
    { value: 'thisMonth', label: 'This Month' },
    { value: '30', label: '30 Days' },
    { value: '60', label: '60 Days' },
    { value: '90', label: '90 Days' }
  ];

  const filteredDocuments = useMemo(() => {
    let filtered = documents;

    // Time range filter
    const now = new Date();
    const timeRanges = {
      'today': 1,
      '7': 7,
      '30': 30,
      '60': 60,
      '90': 90,
      'thisMonth': 'thisMonth'
    };

    if (selectedTimeRange && selectedTimeRange !== 'all') {
      const range = timeRanges[selectedTimeRange as keyof typeof timeRanges];
      
      if (range === 'thisMonth') {
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        filtered = filtered.filter(doc => new Date(doc.uploadDate) >= startOfMonth);
      } else if (typeof range === 'number') {
        const cutoffDate = new Date(now.getTime() - (range * 24 * 60 * 60 * 1000));
        filtered = filtered.filter(doc => new Date(doc.uploadDate) >= cutoffDate);
      }
    }

    // Single partner filter
    if (selectedPartner) {
      filtered = filtered.filter(doc => doc.partnerName === selectedPartner);
    }

    // Multi-select filters
    if (selectedDocumentTypes.length > 0) {
      filtered = filtered.filter(doc => selectedDocumentTypes.includes(doc.documentType));
    }
    if (selectedStatuses.length > 0) {
      filtered = filtered.filter(doc => selectedStatuses.includes(doc.status));
    }
    if (selectedNatures.length > 0) {
      filtered = filtered.filter(doc => selectedNatures.includes(doc.documentNature));
    }

    // Amount range filter
    if (amountRange.min) {
      filtered = filtered.filter(doc => doc.amount >= parseFloat(amountRange.min));
    }
    if (amountRange.max) {
      filtered = filtered.filter(doc => doc.amount <= parseFloat(amountRange.max));
    }

    // Sort documents
    filtered.sort((a, b) => {
      let aValue: string | number;
      let bValue: string | number;

      switch (sortBy) {
        case 'uploadDate':
          aValue = new Date(a.uploadDate).getTime();
          bValue = new Date(b.uploadDate).getTime();
          break;
        case 'amount':
          aValue = a.amount;
          bValue = b.amount;
          break;
        case 'partnerName':
          aValue = a.partnerName.toLowerCase();
          bValue = b.partnerName.toLowerCase();
          break;
        case 'documentNumber':
          aValue = a.documentNumber.toLowerCase();
          bValue = b.documentNumber.toLowerCase();
          break;
        default:
          aValue = a.uploadDate;
          bValue = b.uploadDate;
      }

      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [documents, selectedTimeRange, selectedPartner, selectedDocumentTypes, selectedStatuses, selectedNatures, amountRange, sortBy, sortOrder]);

  // Group documents by time periods
  const groupedDocuments = useMemo(() => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);
    const lastWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    const last30Days = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

    const groups = {
      today: [] as Document[],
      yesterday: [] as Document[],
      lastWeek: [] as Document[],
      last30Days: [] as Document[]
    };

    filteredDocuments.forEach(doc => {
      const docDate = new Date(doc.uploadDate);
      const docDay = new Date(docDate.getFullYear(), docDate.getMonth(), docDate.getDate());

      if (docDay.getTime() === today.getTime()) {
        groups.today.push(doc);
      } else if (docDay.getTime() === yesterday.getTime()) {
        groups.yesterday.push(doc);
      } else if (docDay >= lastWeek) {
        groups.lastWeek.push(doc);
      } else if (docDay >= last30Days) {
        groups.last30Days.push(doc);
      }
    });

    return groups;
  }, [filteredDocuments]);

  const clearAllFilters = () => {
    setSelectedPartner('');
    setSelectedDocumentTypes([]);
    setSelectedStatuses([]);
    setSelectedNatures([]);
    setAmountRange({ min: '', max: '' });
    setSelectedTimeRange('30');
  };

  const activeFiltersCount = [
    selectedPartner,
    ...selectedDocumentTypes,
    ...selectedStatuses,
    ...selectedNatures,
    amountRange.min,
    amountRange.max
  ].filter(Boolean).length;

  const toggleMultiSelect = (value: string, selectedArray: string[], setSelectedArray: (arr: string[]) => void) => {
    if (selectedArray.includes(value)) {
      setSelectedArray(selectedArray.filter(item => item !== value));
    } else {
      setSelectedArray([...selectedArray, value]);
    }
  };

  const handleDocumentClick = (document: Document) => {
    setSelectedDocument(document);
  };

  const handleCloseModal = () => {
    setSelectedDocument(null);
  };

  return (
    <>
      <Header />
      <main className="pt-20 pb-20 px-4 min-h-screen bg-gray-50">
        <div className="space-y-3">
          {/* Header with Time Range Selection */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Files</h1>
              <p className="text-sm text-gray-600 mt-1">
                {filteredDocuments.length} documents
              </p>
            </div>
            
            {/* Time Range Dropdown */}
            <div className="relative">
              <button
                onClick={() => setOpenDropdown(openDropdown === 'timeRange' ? null : 'timeRange')}
                className="flex items-center justify-between px-4 py-2 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors text-sm min-w-32 shadow-sm"
              >
                <span className="font-medium">
                  {timeRangeOptions.find(t => t.value === selectedTimeRange)?.label || '30 Days'}
                </span>
                <i className={`ri-arrow-down-s-line text-gray-500 ml-2 transition-transform ${
                  openDropdown === 'timeRange' ? 'rotate-180' : ''
                }`}></i>
              </button>

              {openDropdown === 'timeRange' && (
                <div className="absolute top-full right-0 mt-1 bg-white rounded-lg shadow-lg border border-gray-200 z-20">
                  {timeRangeOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => {
                        setSelectedTimeRange(option.value);
                        setOpenDropdown(null);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-gray-50 transition-colors text-sm whitespace-nowrap"
                    >
                      {option.label}
                      {option.value === selectedTimeRange && (
                        <i className="ri-check-line text-blue-500 float-right ml-4"></i>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Filter Bar */}
          <div className="bg-white rounded-xl p-2 shadow-sm">
            <div className="flex items-center gap-2">
              {/* Partner Selection (3/4 width) */}
              <div className="flex-[3] relative">
                <button
                  onClick={() => setOpenDropdown(openDropdown === 'partners' ? null : 'partners')}
                  className="w-full flex items-center justify-between px-3 py-2 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors text-sm"
                >
                  <span className="truncate">
                    {selectedPartner || 'All Partners'}
                  </span>
                  <i className={`ri-arrow-down-s-line text-gray-500 ml-2 flex-shrink-0 transition-transform ${
                    openDropdown === 'partners' ? 'rotate-180' : ''
                  }`}></i>
                </button>

                {openDropdown === 'partners' && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-lg border border-gray-200 z-20 max-h-48 overflow-y-auto">
                    <button
                      onClick={() => {
                        setSelectedPartner('');
                        setOpenDropdown(null);
                      }}
                      className="w-full text-left px-3 py-2 hover:bg-gray-50 transition-colors text-sm border-b border-gray-100"
                    >
                      All Partners
                      {!selectedPartner && <i className="ri-check-line text-blue-500 float-right"></i>}
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

              {/* Advanced Filter Button (1/4 width) */}
              <div className="flex-1 flex justify-end">
                <button
                  onClick={() => setShowAdvancedFilters(true)}
                  className="flex items-center px-3 py-2 text-sm text-blue-600 hover:text-blue-700 font-medium hover:bg-blue-50 rounded-lg transition-colors"
                >
                  <i className="ri-filter-3-line mr-1"></i>
                  Filters
                  {activeFiltersCount > 0 && (
                    <span className="ml-1 px-1.5 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full">
                      {activeFiltersCount}
                    </span>
                  )}
                </button>
              </div>
            </div>

            {activeFiltersCount > 0 && (
              <div className="mt-2 pt-2 border-t border-gray-100 flex justify-end">
                <button
                  onClick={clearAllFilters}
                  className="flex items-center px-2 py-1 text-xs text-red-600 hover:text-red-700 font-medium hover:bg-red-50 rounded-lg transition-colors"
                >
                  <i className="ri-close-line mr-1"></i>
                  Clear All
                </button>
              </div>
            )}
          </div>

          {/* Documents List - Grouped by Time */}
          <div className="space-y-4">
            {/* Today */}
            {groupedDocuments.today.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-2 px-1">
                  Today ({groupedDocuments.today.length})
                </h3>
                <div className="space-y-2">
                  {groupedDocuments.today.map((document) => (
                    <DocumentCard 
                      key={document.id} 
                      document={document} 
                      onDocumentClick={handleDocumentClick}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Yesterday */}
            {groupedDocuments.yesterday.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-2 px-1">
                  Yesterday ({groupedDocuments.yesterday.length})
                </h3>
                <div className="space-y-2">
                  {groupedDocuments.yesterday.map((document) => (
                    <DocumentCard 
                      key={document.id} 
                      document={document} 
                      onDocumentClick={handleDocumentClick}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Last Week */}
            {groupedDocuments.lastWeek.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-2 px-1">
                  Last Week ({groupedDocuments.lastWeek.length})
                </h3>
                <div className="space-y-2">
                  {groupedDocuments.lastWeek.map((document) => (
                    <DocumentCard 
                      key={document.id} 
                      document={document} 
                      onDocumentClick={handleDocumentClick}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Last 30 Days */}
            {groupedDocuments.last30Days.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-2 px-1">
                  Last 30 Days ({groupedDocuments.last30Days.length})
                </h3>
                <div className="space-y-2">
                  {groupedDocuments.last30Days.map((document) => (
                    <DocumentCard 
                      key={document.id} 
                      document={document} 
                      onDocumentClick={handleDocumentClick}
                    />
                  ))}
                </div>
              </div>
            )}

            {filteredDocuments.length === 0 && (
              <div className="bg-white rounded-xl p-8 shadow-sm text-center">
                <i className="ri-file-search-line text-4xl text-gray-400 mb-4"></i>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Documents Found</h3>
                <p className="text-gray-600 mb-4">
                  {activeFiltersCount > 0 
                    ? 'Try adjusting your filters'
                    : 'No documents have been uploaded yet'
                  }
                </p>
                {activeFiltersCount > 0 && (
                  <button
                    onClick={clearAllFilters}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    Clear All Filters
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Advanced Filters Modal */}
        {showAdvancedFilters && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl p-6 w-full max-w-md max-h-[80vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Advanced Filters</h2>
                <button
                  onClick={() => setShowAdvancedFilters(false)}
                  className="p-1 hover:bg-gray-100 rounded"
                >
                  <i className="ri-close-line text-gray-500"></i>
                </button>
              </div>

              <div className="space-y-4">
                {/* Document Types */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Document Types</label>
                  <div className="space-y-2 max-h-32 overflow-y-auto">
                    {documentTypes.map((type) => (
                      <label key={type} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={selectedDocumentTypes.includes(type)}
                          onChange={() => toggleMultiSelect(type, selectedDocumentTypes, setSelectedDocumentTypes)}
                          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <span className="ml-2 text-sm text-gray-700">{type}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Status */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <div className="space-y-2">
                    {statusOptions.map((status) => (
                      <label key={status.value} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={selectedStatuses.includes(status.value)}
                          onChange={() => toggleMultiSelect(status.value, selectedStatuses, setSelectedStatuses)}
                          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <span className={`ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${status.color}`}>
                          {status.label}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Nature */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Document Nature</label>
                  <div className="space-y-2">
                    {natureOptions.map((nature) => (
                      <label key={nature.value} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={selectedNatures.includes(nature.value)}
                          onChange={() => toggleMultiSelect(nature.value, selectedNatures, setSelectedNatures)}
                          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <span className={`ml-2 inline-flex items-center px-2 py-0.5 rounded-full font-medium ${nature.color}`}>
                          {nature.label}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Amount Range */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Amount Range</label>
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

                {/* Sort Options */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="uploadDate">Upload Date</option>
                    <option value="amount">Amount</option>
                    <option value="partnerName">Partner Name</option>
                    <option value="documentNumber">Document Number</option>
                  </select>
                  
                  <div className="mt-2">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={sortOrder === 'desc'}
                        onChange={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">Descending Order</span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="flex space-x-3 mt-6 pt-4 border-t border-gray-200">
                <button
                  onClick={clearAllFilters}
                  className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Clear All
                </button>
                <button
                  onClick={() => setShowAdvancedFilters(false)}
                  className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Document Detail Modal */}
        <DocumentDetailModal
          document={selectedDocument}
          onClose={handleCloseModal}
          userRole={userRole}
        />
      </main>
      <TabBar />
      
      {/* Click outside handler */}
      {openDropdown && (
        <div 
          className="fixed inset-0 z-10" 
          onClick={() => setOpenDropdown(null)}
        />
      )}
    </>
  );
}