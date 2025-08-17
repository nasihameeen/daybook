
'use client';

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

interface DocumentCardProps {
  document: Document;
  onDocumentClick: (document: Document) => void;
}

export default function DocumentCard({ document, onDocumentClick }: DocumentCardProps) {
  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'approved':
        return { color: 'bg-green-100 text-green-700', icon: 'ri-check-line', label: 'Approved' };
      case 'pending':
        return { color: 'bg-yellow-100 text-yellow-700', icon: 'ri-time-line', label: 'Pending' };
      case 'rejected':
        return { color: 'bg-red-100 text-red-700', icon: 'ri-close-line', label: 'Rejected' };
      case 'processing':
        return { color: 'bg-blue-100 text-blue-700', icon: 'ri-loader-4-line', label: 'Processing' };
      default:
        return { color: 'bg-gray-100 text-gray-700', icon: 'ri-question-line', label: 'Unknown' };
    }
  };

  const getPartnerTypeIcon = (type: string, category: string) => {
    // Check if it's a utility bill
    if (category.toLowerCase().includes('utility') || category.toLowerCase().includes('utilities')) {
      return { icon: 'ri-flashlight-line', color: 'text-orange-600 bg-orange-100' };
    }
    
    switch (type) {
      case 'customer':
        return { icon: 'ri-user-heart-line', color: 'text-green-600 bg-green-100' };
      case 'supplier':
        return { icon: 'ri-building-line', color: 'text-blue-600 bg-blue-100' };
      case 'employee':
        return { icon: 'ri-user-line', color: 'text-purple-600 bg-purple-100' };
      default:
        return { icon: 'ri-user-line', color: 'text-gray-600 bg-gray-100' };
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: '2-digit'
    });
  };

  const statusConfig = getStatusConfig(document.status);
  const partnerIcon = getPartnerTypeIcon(document.partnerType, document.category);

  // Create document display name from nature and type
  const documentDisplayName = `${document.documentNature} ${document.documentType}`;

  return (
    <div 
      className="bg-white rounded-lg border border-gray-200 p-3 hover:shadow-sm transition-shadow cursor-pointer"
      onClick={() => onDocumentClick(document)}
    >
      {/* First Line: Document Name + Status + Corrected Indicator */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2 flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-gray-900 truncate mr-2">
            {documentDisplayName}
          </h3>
          {document.correctedBy && (
            <div className="flex-shrink-0">
              <i className="ri-edit-line text-orange-500 text-sm" title="Document has been corrected"></i>
            </div>
          )}
        </div>
        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${statusConfig.color} flex-shrink-0`}>
          <i className={`${statusConfig.icon} mr-1`}></i>
          {statusConfig.label}
        </span>
      </div>

      {/* Second Line: Partner Info + Date + Amount */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2 flex-1 min-w-0">
          {/* Partner Icon */}
          <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${partnerIcon.color}`}>
            <i className={`${partnerIcon.icon} text-sm`}></i>
          </div>
          
          {/* Partner Name + Date */}
          <div className="flex flex-col min-w-0 flex-1">
            <span className="text-sm font-medium text-gray-900 truncate">
              {document.partnerName}
            </span>
            <span className="text-xs text-gray-500">
              {formatDate(document.documentDate)}
            </span>
          </div>
        </div>

        {/* Amount */}
        <div className="text-right flex-shrink-0 ml-3">
          <div className="text-sm font-bold text-gray-900">
            {document.currency} {document.amount.toLocaleString()}
          </div>
          {document.outstandingAmount > 0 && (
            <div className="text-xs text-orange-600">
              Due: {document.currency} {document.outstandingAmount.toLocaleString()}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
