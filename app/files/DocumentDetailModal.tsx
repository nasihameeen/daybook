
'use client';

import { useState } from 'react';

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

interface AccountingDetails {
  glAccount: string;
  chartOfAccount: string;
  accountAssignment: string;
  balanceSheetCategory: string;
  plCategory: string;
  assetCategory: string;
  costCenter: string;
  department: string;
  project: string;
  taxCode: string;
  vatRate: number;
  paymentTerms: string;
  dueDate: string;
  notes: string;
}

interface DocumentDetailModalProps {
  document: Document | null;
  onClose: () => void;
  userRole: 'user' | 'accountant' | 'manager' | 'owner';
}

export default function DocumentDetailModal({ document, onClose, userRole }: DocumentDetailModalProps) {
  const [activeTab, setActiveTab] = useState('basic');
  const [isEditing, setIsEditing] = useState(false);

  // Mock accounting details - in real app, fetch from API
  const [accountingDetails, setAccountingDetails] = useState<AccountingDetails>({
    glAccount: '1200 - Accounts Receivable',
    chartOfAccount: 'Assets > Current Assets > Receivables',
    accountAssignment: 'Revenue Recognition',
    balanceSheetCategory: 'Current Assets',
    plCategory: 'Operating Revenue',
    assetCategory: 'Not Applicable',
    costCenter: 'CC-001 - Sales Department',
    department: 'Sales',
    project: 'PRJ-2024-Q1',
    taxCode: 'VAT-STD',
    vatRate: 20,
    paymentTerms: 'Net 30 Days',
    dueDate: '2024-02-15',
    notes: 'Standard sales transaction with 30-day payment terms'
  });

  if (!document) return null;

  const canEdit = userRole === 'accountant';
  const canView = ['accountant', 'manager', 'owner'].includes(userRole);

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

  const statusConfig = getStatusConfig(document.status);

  const tabs = [
    { id: 'basic', label: 'Basic Info', icon: 'ri-file-text-line' },
    ...(canView ? [{ id: 'accounting', label: 'Accounting', icon: 'ri-calculator-line' }] : []),
    { id: 'history', label: 'History', icon: 'ri-history-line' }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white w-full h-full overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
              <i className="ri-arrow-left-line text-xl text-gray-600"></i>
            </button>
            <div>
              <h1 className="text-lg font-semibold text-gray-900">
                {document.documentNature} {document.documentType}
              </h1>
              <p className="text-sm text-gray-600">{document.documentNumber}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${statusConfig.color}`}>
              <i className={`${statusConfig.icon} mr-1`}></i>
              {statusConfig.label}
            </span>
            {canEdit && (
              <button
                onClick={() => setIsEditing(!isEditing)}
                className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                  isEditing 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {isEditing ? 'Save' : 'Edit'}
              </button>
            )}
          </div>
        </div>

        {/* Correction Notice */}
        {document.correctedBy && (
          <div className="mx-4 mt-4 p-3 bg-orange-50 border border-orange-200 rounded-lg">
            <div className="flex items-start space-x-2">
              <i className="ri-edit-line text-orange-500 mt-0.5"></i>
              <div>
                <h3 className="text-sm font-medium text-orange-800">Document Corrected</h3>
                <p className="text-sm text-orange-700 mt-1">
                  This document has been corrected by {document.correctedBy} ({document.correctorDesignation})
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="border-b border-gray-200 mx-4 mt-4">
          <div className="flex space-x-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 pb-3 border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <i className={tab.icon}></i>
                <span className="text-sm font-medium">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="p-4 space-y-6">
          {activeTab === 'basic' && (
            <div className="space-y-6">
              {/* Document Preview */}
              {document.preview && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-gray-900 mb-3">Document Preview</h3>
                  <img 
                    src={document.preview} 
                    alt="Document preview" 
                    className="w-full max-w-md mx-auto rounded-lg shadow"
                  />
                </div>
              )}

              {/* Basic Information Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-gray-900 border-b border-gray-200 pb-2">
                    Document Details
                  </h3>
                  
                  <div className="space-y-3">
                    <div>
                      <label className="text-xs font-medium text-gray-500">Document Number</label>
                      <p className="text-sm text-gray-900 mt-1">{document.documentNumber}</p>
                    </div>
                    
                    <div>
                      <label className="text-xs font-medium text-gray-500">Document Type</label>
                      <p className="text-sm text-gray-900 mt-1">{document.documentNature} {document.documentType}</p>
                    </div>
                    
                    <div>
                      <label className="text-xs font-medium text-gray-500">Category</label>
                      <p className="text-sm text-gray-900 mt-1">{document.category}</p>
                    </div>
                    
                    <div>
                      <label className="text-xs font-medium text-gray-500">Subcategory</label>
                      <p className="text-sm text-gray-900 mt-1">{document.subcategory}</p>
                    </div>
                    
                    {document.internalReference && (
                      <div>
                        <label className="text-xs font-medium text-gray-500">Internal Reference</label>
                        <p className="text-sm text-gray-900 mt-1">{document.internalReference}</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-gray-900 border-b border-gray-200 pb-2">
                    Partner & Amount
                  </h3>
                  
                  <div className="space-y-3">
                    <div>
                      <label className="text-xs font-medium text-gray-500">Partner Name</label>
                      <p className="text-sm text-gray-900 mt-1">{document.partnerName}</p>
                    </div>
                    
                    <div>
                      <label className="text-xs font-medium text-gray-500">Partner Type</label>
                      <p className="text-sm text-gray-900 mt-1 capitalize">{document.partnerType}</p>
                    </div>
                    
                    <div>
                      <label className="text-xs font-medium text-gray-500">Total Amount</label>
                      <p className="text-lg font-bold text-gray-900 mt-1">
                        {document.currency} {document.amount.toLocaleString()}
                      </p>
                    </div>
                    
                    {document.outstandingAmount > 0 && (
                      <div>
                        <label className="text-xs font-medium text-gray-500">Outstanding Amount</label>
                        <p className="text-sm text-orange-600 font-medium mt-1">
                          {document.currency} {document.outstandingAmount.toLocaleString()}
                        </p>
                      </div>
                    )}
                    
                    <div>
                      <label className="text-xs font-medium text-gray-500">VAT Status</label>
                      <p className="text-sm text-gray-900 mt-1">
                        {document.vatInclusive ? 'VAT Inclusive' : 'VAT Exclusive'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Dates */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-gray-900 border-b border-gray-200 pb-2">
                    Important Dates
                  </h3>
                  
                  <div className="space-y-3">
                    <div>
                      <label className="text-xs font-medium text-gray-500">Document Date</label>
                      <p className="text-sm text-gray-900 mt-1">
                        {new Date(document.documentDate).toLocaleDateString()}
                      </p>
                    </div>
                    
                    <div>
                      <label className="text-xs font-medium text-gray-500">Upload Date</label>
                      <p className="text-sm text-gray-900 mt-1">
                        {new Date(document.uploadDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-gray-900 border-b border-gray-200 pb-2">
                    File Information
                  </h3>
                  
                  <div className="space-y-3">
                    <div>
                      <label className="text-xs font-medium text-gray-500">File Name</label>
                      <p className="text-sm text-gray-900 mt-1">{document.fileName}</p>
                    </div>
                    
                    <div>
                      <label className="text-xs font-medium text-gray-500">File Size</label>
                      <p className="text-sm text-gray-900 mt-1">
                        {(document.fileSize / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                    
                    <div>
                      <label className="text-xs font-medium text-gray-500">File Type</label>
                      <p className="text-sm text-gray-900 mt-1 uppercase">{document.fileType}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'accounting' && canView && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-gray-900 border-b border-gray-200 pb-2">
                    General Ledger & Chart of Accounts
                  </h3>
                  
                  <div className="space-y-3">
                    <div>
                      <label className="text-xs font-medium text-gray-500">GL Account</label>
                      {isEditing && canEdit ? (
                        <select className="w-full mt-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm">
                          <option>1200 - Accounts Receivable</option>
                          <option>2100 - Accounts Payable</option>
                          <option>4100 - Sales Revenue</option>
                          <option>5100 - Cost of Goods Sold</option>
                        </select>
                      ) : (
                        <p className="text-sm text-gray-900 mt-1">{accountingDetails.glAccount}</p>
                      )}
                    </div>
                    
                    <div>
                      <label className="text-xs font-medium text-gray-500">Chart of Account</label>
                      <p className="text-sm text-gray-900 mt-1">{accountingDetails.chartOfAccount}</p>
                    </div>
                    
                    <div>
                      <label className="text-xs font-medium text-gray-500">Account Assignment</label>
                      {isEditing && canEdit ? (
                        <input 
                          type="text" 
                          value={accountingDetails.accountAssignment}
                          className="w-full mt-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm"
                        />
                      ) : (
                        <p className="text-sm text-gray-900 mt-1">{accountingDetails.accountAssignment}</p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-gray-900 border-b border-gray-200 pb-2">
                    Financial Statement Classification
                  </h3>
                  
                  <div className="space-y-3">
                    <div>
                      <label className="text-xs font-medium text-gray-500">Balance Sheet Category</label>
                      <p className="text-sm text-gray-900 mt-1">{accountingDetails.balanceSheetCategory}</p>
                    </div>
                    
                    <div>
                      <label className="text-xs font-medium text-gray-500">P&L Category</label>
                      <p className="text-sm text-gray-900 mt-1">{accountingDetails.plCategory}</p>
                    </div>
                    
                    <div>
                      <label className="text-xs font-medium text-gray-500">Asset Category</label>
                      <p className="text-sm text-gray-900 mt-1">{accountingDetails.assetCategory}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-gray-900 border-b border-gray-200 pb-2">
                    Cost Centers & Projects
                  </h3>
                  
                  <div className="space-y-3">
                    <div>
                      <label className="text-xs font-medium text-gray-500">Cost Center</label>
                      {isEditing && canEdit ? (
                        <select className="w-full mt-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm">
                          <option>CC-001 - Sales Department</option>
                          <option>CC-002 - Marketing Department</option>
                          <option>CC-003 - Operations</option>
                        </select>
                      ) : (
                        <p className="text-sm text-gray-900 mt-1">{accountingDetails.costCenter}</p>
                      )}
                    </div>
                    
                    <div>
                      <label className="text-xs font-medium text-gray-500">Department</label>
                      <p className="text-sm text-gray-900 mt-1">{accountingDetails.department}</p>
                    </div>
                    
                    <div>
                      <label className="text-xs font-medium text-gray-500">Project</label>
                      {isEditing && canEdit ? (
                        <select className="w-full mt-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm">
                          <option>PRJ-2024-Q1</option>
                          <option>PRJ-2024-Q2</option>
                          <option>PRJ-EXPANSION</option>
                        </select>
                      ) : (
                        <p className="text-sm text-gray-900 mt-1">{accountingDetails.project}</p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-gray-900 border-b border-gray-200 pb-2">
                    Tax & Payment Information
                  </h3>
                  
                  <div className="space-y-3">
                    <div>
                      <label className="text-xs font-medium text-gray-500">Tax Code</label>
                      <p className="text-sm text-gray-900 mt-1">{accountingDetails.taxCode}</p>
                    </div>
                    
                    <div>
                      <label className="text-xs font-medium text-gray-500">VAT Rate</label>
                      <p className="text-sm text-gray-900 mt-1">{accountingDetails.vatRate}%</p>
                    </div>
                    
                    <div>
                      <label className="text-xs font-medium text-gray-500">Payment Terms</label>
                      <p className="text-sm text-gray-900 mt-1">{accountingDetails.paymentTerms}</p>
                    </div>
                    
                    <div>
                      <label className="text-xs font-medium text-gray-500">Due Date</label>
                      <p className="text-sm text-gray-900 mt-1">
                        {new Date(accountingDetails.dueDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Notes */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-gray-900 border-b border-gray-200 pb-2">
                  Accounting Notes
                </h3>
                {isEditing && canEdit ? (
                  <textarea
                    value={accountingDetails.notes}
                    onChange={(e) => setAccountingDetails({...accountingDetails, notes: e.target.value})}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm"
                    rows={3}
                  />
                ) : (
                  <p className="text-sm text-gray-700">{accountingDetails.notes}</p>
                )}
              </div>
            </div>
          )}

          {activeTab === 'history' && (
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-gray-900 border-b border-gray-200 pb-2">
                Document History
              </h3>
              
              <div className="space-y-3">
                <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                    <i className="ri-upload-line text-white text-sm"></i>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-medium text-gray-900">Document Uploaded</h4>
                      <span className="text-xs text-gray-500">
                        {new Date(document.uploadDate).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">Document uploaded by user</p>
                  </div>
                </div>

                {document.correctedBy && (
                  <div className="flex items-start space-x-3 p-3 bg-orange-50 rounded-lg">
                    <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                      <i className="ri-edit-line text-white text-sm"></i>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-medium text-gray-900">Document Corrected</h4>
                        <span className="text-xs text-gray-500">
                          {new Date().toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        Corrected by {document.correctedBy} ({document.correctorDesignation})
                      </p>
                    </div>
                  </div>
                )}

                <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    document.status === 'approved' ? 'bg-green-500' :
                    document.status === 'pending' ? 'bg-yellow-500' :
                    document.status === 'rejected' ? 'bg-red-500' : 'bg-blue-500'
                  }`}>
                    <i className={`${statusConfig.icon} text-white text-sm`}></i>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-medium text-gray-900">Status: {statusConfig.label}</h4>
                      <span className="text-xs text-gray-500">
                        {new Date().toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">Current document status</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
