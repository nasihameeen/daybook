
'use client';

import { useState } from 'react';

interface DocumentDetailsProps {
  documentNumber: string;
  setDocumentNumber: (value: string) => void;
  documentDate: string;
  setDocumentDate: (value: string) => void;
  partyName: string;
  setPartyName: (value: string) => void;
  currency: string;
  setCurrency: (value: string) => void;
  totalAmount: string;
  setTotalAmount: (value: string) => void;
  isVatInclusive: boolean;
  setIsVatInclusive: (value: boolean) => void;
}

export default function DocumentDetails({
  documentNumber,
  setDocumentNumber,
  documentDate,
  setDocumentDate,
  partyName,
  setPartyName,
  currency,
  setCurrency,
  totalAmount,
  setTotalAmount,
  isVatInclusive,
  setIsVatInclusive
}: DocumentDetailsProps) {
  const [isCurrencyOpen, setIsCurrencyOpen] = useState(false);
  const [isPartyOpen, setIsPartyOpen] = useState(false);
  const [partySearchTerm, setPartySearchTerm] = useState('');

  const currencies = [
    { code: 'USD', name: 'US Dollar', symbol: '$' },
    { code: 'EUR', name: 'Euro', symbol: '€' },
    { code: 'GBP', name: 'British Pound', symbol: '£' },
    { code: 'JPY', name: 'Japanese Yen', symbol: '¥' },
    { code: 'AUD', name: 'Australian Dollar', symbol: 'A$' },
    { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$' },
    { code: 'CHF', name: 'Swiss Franc', symbol: 'Fr' },
    { code: 'CNY', name: 'Chinese Yuan', symbol: '¥' },
    { code: 'INR', name: 'Indian Rupee', symbol: '₹' },
    { code: 'SGD', name: 'Singapore Dollar', symbol: 'S$' }
  ];

  const parties = [
    { id: '1', name: 'ABC Suppliers Ltd', type: 'supplier' },
    { id: '2', name: 'XYZ Customer Corp', type: 'customer' },
    { id: '3', name: 'Global Materials Inc', type: 'supplier' },
    { id: '4', name: 'Tech Solutions Ltd', type: 'customer' },
    { id: '5', name: 'Premium Vendors Co', type: 'supplier' },
    { id: '6', name: 'Metro Distribution', type: 'supplier' },
    { id: '7', name: 'Elite Services Group', type: 'customer' },
    { id: '8', name: 'Industrial Components', type: 'supplier' },
    { id: '9', name: 'Retail Chain Stores', type: 'customer' },
    { id: '10', name: 'Quality Manufacturers', type: 'supplier' }
  ];

  const filteredParties = parties.filter(party =>
    party.name.toLowerCase().includes(partySearchTerm.toLowerCase())
  );

  const selectedCurrency = currencies.find(curr => curr.code === currency);

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Document Details</h2>

      <div className="space-y-4">
        {/* Document Number and Date - Single Line */}
        <div className="grid grid-cols-2 gap-3">
          {/* Document Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Document Number</label>
            <input
              type="text"
              value={documentNumber}
              onChange={(e) => setDocumentNumber(e.target.value)}
              placeholder="INV-2024-001"
              className="w-full px-4 py-3 bg-gray-50 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Document Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Date of Document *</label>
            <input
              type="date"
              value={documentDate}
              onChange={(e) => setDocumentDate(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Party Name */}
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-2">Party Name (Customer or Supplier) *</label>
          <button
            onClick={() => setIsPartyOpen(!isPartyOpen)}
            className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors"
          >
            <span className={`text-sm ${partyName ? 'text-gray-900' : 'text-gray-500'}`}>
              {partyName || 'Select or enter party name'}
            </span>
            <i className={`ri-arrow-down-s-line text-gray-500 transition-transform ${isPartyOpen ? 'rotate-180' : ''}`}></i>
          </button>

          {isPartyOpen && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
              <div className="p-3 border-b border-gray-100">
                <div className="relative">
                  <i className="ri-search-line absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                  <input
                    type="text"
                    placeholder="Search or add new party..."
                    value={partySearchTerm}
                    onChange={(e) => setPartySearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-gray-50 rounded-lg border-none text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="max-h-48 overflow-y-auto">
                {/* Add new party option */}
                {partySearchTerm && !filteredParties.some(party => party.name.toLowerCase() === partySearchTerm.toLowerCase()) && (
                  <button
                    onClick={() => {
                      setPartyName(partySearchTerm);
                      setIsPartyOpen(false);
                      setPartySearchTerm('');
                    }}
                    className="w-full flex items-center px-4 py-3 hover:bg-blue-50 transition-colors border-b border-gray-100"
                  >
                    <i className="ri-add-line text-blue-600 mr-3"></i>
                    <span className="text-sm text-blue-600">Add "{partySearchTerm}" as new party</span>
                  </button>
                )}

                {/* Existing parties */}
                {filteredParties.map((party) => (
                  <button
                    key={party.id}
                    onClick={() => {
                      setPartyName(party.name);
                      setIsPartyOpen(false);
                      setPartySearchTerm('');
                    }}
                    className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors"
                  >
                    <div className="text-left">
                      <div className="text-sm font-medium text-gray-900">{party.name}</div>
                      <div className="text-xs text-gray-500 capitalize">{party.type}</div>
                    </div>
                    {party.name === partyName && (
                      <i className="ri-check-line text-blue-500"></i>
                    )}
                  </button>
                ))}

                {filteredParties.length === 0 && !partySearchTerm && (
                  <div className="px-4 py-3 text-sm text-gray-500 text-center">
                    No parties found
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Currency and Total Amount */}
        <div className="grid grid-cols-5 gap-3">
          {/* Currency */}
          <div className="col-span-2 relative">
            <label className="block text-sm font-medium text-gray-700 mb-2">Currency *</label>
            <button
              onClick={() => setIsCurrencyOpen(!isCurrencyOpen)}
              className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors"
            >
              <span className="text-sm text-gray-900">
                {selectedCurrency ? `${selectedCurrency.symbol} ${selectedCurrency.code}` : 'USD'}
              </span>
              <i className={`ri-arrow-down-s-line text-gray-500 transition-transform ${isCurrencyOpen ? 'rotate-180' : ''}`}></i>
            </button>

            {isCurrencyOpen && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-lg border border-gray-200 z-10 max-h-48 overflow-y-auto">
                {currencies.map((curr) => (
                  <button
                    key={curr.code}
                    onClick={() => {
                      setCurrency(curr.code);
                      setIsCurrencyOpen(false);
                    }}
                    className="w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-900">{curr.symbol} {curr.code}</span>
                      <span className="text-xs text-gray-500">{curr.name}</span>
                    </div>
                    {curr.code === currency && (
                      <i className="ri-check-line text-blue-500 absolute right-2 top-1/2 transform -translate-y-1/2"></i>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Total Amount */}
          <div className="col-span-3">
            <label className="block text-sm font-medium text-gray-700 mb-2">Total Amount *</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
                {selectedCurrency?.symbol || '$'}
              </span>
              <input
                type="number"
                step="0.01"
                min="0"
                value={totalAmount}
                onChange={(e) => setTotalAmount(e.target.value)}
                placeholder="0.00"
                className="w-full pl-8 pr-4 py-3 bg-gray-50 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* VAT Inclusive/Exclusive */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Amount includes VAT/Tax?</label>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setIsVatInclusive(true)}
              className={`flex items-center justify-center px-4 py-3 rounded-lg border-2 transition-colors ${
                isVatInclusive
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-200 bg-gray-50 text-gray-600 hover:bg-gray-100'
              }`}
            >
              <i className="ri-checkbox-circle-line mr-2"></i>
              <span className="text-sm font-medium">Yes (Inclusive)</span>
            </button>
            <button
              onClick={() => setIsVatInclusive(false)}
              className={`flex items-center justify-center px-4 py-3 rounded-lg border-2 transition-colors ${
                !isVatInclusive
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-200 bg-gray-50 text-gray-600 hover:bg-gray-100'
              }`}
            >
              <i className="ri-close-circle-line mr-2"></i>
              <span className="text-sm font-medium">No (Exclusive)</span>
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Select whether the total amount includes or excludes VAT/tax
          </p>
        </div>
      </div>
    </div>
  );
}
