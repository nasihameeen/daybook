
'use client';

import { useState } from 'react';

interface DocumentClassificationProps {
  documentType: string;
  setDocumentType: (value: string) => void;
  category: string;
  setCategory: (value: string) => void;
  subcategory: string;
  setSubcategory: (value: string) => void;
  incomeExpense: string;
  setIncomeExpense: (value: string) => void;
  internalReferenceNumber: string;
  setInternalReferenceNumber: (value: string) => void;
}

export default function DocumentClassification({
  documentType,
  setDocumentType,
  category,
  setCategory,
  subcategory,
  setSubcategory,
  incomeExpense,
  setIncomeExpense,
  internalReferenceNumber,
  setInternalReferenceNumber
}: DocumentClassificationProps) {
  const [isDocumentTypeOpen, setIsDocumentTypeOpen] = useState(false);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isSubcategoryOpen, setIsSubcategoryOpen] = useState(false);

  const documentNatures = ['Sales', 'Purchase', 'Expense'];

  const documentTypeMap: { [key: string]: string[] } = {
    'Sales': ['Invoice', 'Credit Note', 'Debit Note', 'Delivery Note', 'Sales Order', 'Receipt', 'Quotation'],
    'Purchase': ['Invoice', 'Credit Note', 'Debit Note', 'Delivery Note', 'Purchase Order', 'Receipt', 'Bill of Lading'],
    'Expense': ['Salary Slip', 'Wages', 'Reimbursement', 'Cost of Goods', 'Utilities Bill', 'Rent Receipt', 'Travel Expense', 'Office Supplies', 'Professional Services', 'Marketing Expense', 'B2C Invoice', 'Cash Receipt', 'Petty Cash Voucher']
  };

  const categories = [
    'Sales & Revenue',
    'Purchases & Procurement',
    'Expenses',
    'Banking & Finance',
    'Tax & Compliance',
    'HR & Payroll',
    'Legal & Contracts',
    'Insurance',
    'Inventory',
    'Fixed Assets',
    'Other'
  ];

  const subcategoryMap: { [key: string]: string[] } = {
    'Sales & Revenue': ['Customer Invoices', 'Sales Orders', 'Delivery Notes', 'Credit Notes', 'Sales Returns'],
    'Purchases & Procurement': ['Supplier Invoices', 'Purchase Orders', 'Goods Receipts', 'Purchase Returns', 'Vendor Agreements'],
    'Expenses': ['Travel & Entertainment', 'Office Supplies', 'Utilities', 'Rent & Facilities', 'Professional Services', 'Marketing', 'Other Operating Expenses'],
    'Banking & Finance': ['Bank Statements', 'Loan Documents', 'Interest Payments', 'Bank Fees', 'Investment Documents'],
    'Tax & Compliance': ['VAT Returns', 'Income Tax', 'Sales Tax', 'Property Tax', 'Regulatory Filings'],
    'HR & Payroll': ['Salary Slips', 'Employee Contracts', 'Benefits', 'Reimbursements', 'Training Expenses'],
    'Legal & Contracts': ['Service Agreements', 'NDAs', 'Legal Notices', 'Court Documents', 'Intellectual Property'],
    'Insurance': ['Policy Documents', 'Claims', 'Premium Payments', 'Coverage Certificates'],
    'Inventory': ['Stock Reports', 'Warehouse Receipts', 'Inventory Adjustments', 'Cycle Counts'],
    'Fixed Assets': ['Asset Purchases', 'Depreciation', 'Maintenance', 'Disposal', 'Asset Transfers'],
    'Other': ['Miscellaneous', 'Uncategorized', 'Reference Documents']
  };

  const getDocumentTypes = () => {
    return documentTypeMap[incomeExpense] || [];
  };

  const getSubcategories = () => {
    return subcategoryMap[category] || [];
  };

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Document Classification</h2>
      
      <div className="space-y-4">
        {/* Document Nature */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Document Nature *</label>
          <div className="grid grid-cols-3 gap-3">
            {documentNatures.map((nature) => (
              <button
                key={nature}
                onClick={() => {
                  setIncomeExpense(nature);
                  setDocumentType(''); // Reset document type when nature changes
                }}
                className={`flex items-center justify-center px-4 py-3 rounded-lg border-2 transition-colors ${
                  incomeExpense === nature
                    ? nature === 'Sales' 
                      ? 'border-green-500 bg-green-50 text-green-700'
                      : nature === 'Purchase'
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-red-500 bg-red-50 text-red-700'
                    : 'border-gray-200 bg-gray-50 text-gray-600 hover:bg-gray-100'
                }`}
              >
                <i className={`${
                  nature === 'Sales' ? 'ri-arrow-up-line' :
                  nature === 'Purchase' ? 'ri-shopping-cart-line' :
                  'ri-money-dollar-circle-line'
                } mr-2`}></i>
                <span className="text-sm font-medium">{nature}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Document Type */}
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-2">Document Type *</label>
          <button
            onClick={() => setIsDocumentTypeOpen(!isDocumentTypeOpen)}
            disabled={!incomeExpense}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-lg border border-gray-200 transition-colors ${
              incomeExpense 
                ? 'bg-gray-50 hover:bg-gray-100' 
                : 'bg-gray-100 cursor-not-allowed'
            }`}
          >
            <span className={`text-sm ${documentType ? 'text-gray-900' : 'text-gray-500'}`}>
              {documentType || (incomeExpense ? 'Select document type' : 'Select nature first')}
            </span>
            <i className={`ri-arrow-down-s-line text-gray-500 transition-transform ${isDocumentTypeOpen ? 'rotate-180' : ''}`}></i>
          </button>

          {isDocumentTypeOpen && incomeExpense && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-lg border border-gray-200 z-10 max-h-48 overflow-y-auto">
              {getDocumentTypes().map((type) => (
                <button
                  key={type}
                  onClick={() => {
                    setDocumentType(type);
                    setIsDocumentTypeOpen(false);
                  }}
                  className="w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors"
                >
                  <span className="text-sm text-gray-700">{type}</span>
                  {type === documentType && (
                    <i className="ri-check-line text-blue-500 float-right"></i>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Category and Subcategory - Single Line */}
        <div className="grid grid-cols-2 gap-3">
          {/* Category */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
            <button
              onClick={() => setIsCategoryOpen(!isCategoryOpen)}
              className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors"
            >
              <span className={`text-sm ${category ? 'text-gray-900' : 'text-gray-500'}`}>
                {category || 'Select category'}
              </span>
              <i className={`ri-arrow-down-s-line text-gray-500 transition-transform ${isCategoryOpen ? 'rotate-180' : ''}`}></i>
            </button>

            {isCategoryOpen && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-lg border border-gray-200 z-10 max-h-48 overflow-y-auto">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => {
                      setCategory(cat);
                      setSubcategory(''); // Reset subcategory when category changes
                      setIsCategoryOpen(false);
                    }}
                    className="w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors"
                  >
                    <span className="text-sm text-gray-700">{cat}</span>
                    {cat === category && (
                      <i className="ri-check-line text-blue-500 float-right"></i>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Subcategory */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-2">Subcategory *</label>
            <button
              onClick={() => setIsSubcategoryOpen(!isSubcategoryOpen)}
              disabled={!category}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-lg border border-gray-200 transition-colors ${
                category 
                  ? 'bg-gray-50 hover:bg-gray-100' 
                  : 'bg-gray-100 cursor-not-allowed'
              }`}
            >
              <span className={`text-sm ${subcategory ? 'text-gray-900' : 'text-gray-500'}`}>
                {subcategory || (category ? 'Select subcategory' : 'Select category first')}
              </span>
              <i className={`ri-arrow-down-s-line text-gray-500 transition-transform ${isSubcategoryOpen ? 'rotate-180' : ''}`}></i>
            </button>

            {isSubcategoryOpen && category && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-lg border border-gray-200 z-10 max-h-48 overflow-y-auto">
                {getSubcategories().map((subcat) => (
                  <button
                    key={subcat}
                    onClick={() => {
                      setSubcategory(subcat);
                      setIsSubcategoryOpen(false);
                    }}
                    className="w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors"
                  >
                    <span className="text-sm text-gray-700">{subcat}</span>
                    {subcat === subcategory && (
                      <i className="ri-check-line text-blue-500 float-right"></i>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Internal Reference Number */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Internal Reference Number</label>
          <input
            type="text"
            value={internalReferenceNumber}
            onChange={(e) => setInternalReferenceNumber(e.target.value)}
            placeholder="e.g., PO-2024-001, SO-2024-123"
            className="w-full px-4 py-3 bg-gray-50 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <p className="text-xs text-gray-500 mt-1">
            Enter the related internal document number (Purchase Order, Sales Order, etc.)
          </p>
        </div>
      </div>
    </div>
  );
}
