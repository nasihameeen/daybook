
'use client';

import { useState } from 'react';
import { Transaction } from './page';

interface TransactionEntryProps {
  type: 'purchase' | 'sale' | 'expense';
  transactions: Transaction[];
  onAddTransaction: (transaction: Omit<Transaction, 'id' | 'time'>) => void;
  isEditable: boolean;
  getAccountIcon: (account: string) => string;
  getAccountColor: (account: string) => string;
}

export default function TransactionEntry({ 
  type, 
  transactions, 
  onAddTransaction, 
  isEditable,
  getAccountIcon,
  getAccountColor 
}: TransactionEntryProps) {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    amount: '',
    partner: '',
    account: 'cash' as 'cash' | 'bank' | 'credit_card' | 'upi',
    description: '',
    isPaid: true
  });

  const resetForm = () => {
    setFormData({
      amount: '',
      partner: '',
      account: 'cash',
      description: '',
      isPaid: true
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.amount || !formData.partner) {
      alert('Please fill in amount and partner name');
      return;
    }

    onAddTransaction({
      type: type === 'purchase' ? 'purchase' : type === 'sale' ? 'sale' : 'expense',
      amount: parseFloat(formData.amount),
      partner: formData.partner,
      account: formData.account,
      description: formData.description,
      isPaid: formData.isPaid,
      isFromUpload: false // Manual entry
    });

    resetForm();
    setShowForm(false);
  };

  const getTypeInfo = () => {
    switch (type) {
      case 'purchase':
        return {
          title: 'Purchase',
          icon: 'ri-shopping-cart-line',
          color: 'text-orange-600',
          bgColor: 'bg-orange-50',
          description: 'From uploaded invoices and manual entries'
        };
      case 'sale':
        return {
          title: 'Sale',
          icon: 'ri-store-line',
          color: 'text-green-600',
          bgColor: 'bg-green-50',
          description: 'Manual entry from billing system reports'
        };
      case 'expense':
        return {
          title: 'Expense',
          icon: 'ri-wallet-line',
          color: 'text-red-600',
          bgColor: 'bg-red-50',
          description: 'From uploaded bills and employee payments'
        };
      default:
        return {
          title: 'Transactions',
          icon: 'ri-exchange-line',
          color: 'text-gray-600',
          bgColor: 'bg-gray-50',
          description: 'Record transactions'
        };
    }
  };

  const typeInfo = getTypeInfo();

  const getTotalPaid = () => {
    return transactions.filter(t => t.isPaid !== false).reduce((sum, t) => sum + t.amount, 0);
  };

  const getTotalUnpaid = () => {
    return transactions.filter(t => t.isPaid === false).reduce((sum, t) => sum + t.amount, 0);
  };

  const fromUploadCount = transactions.filter(t => t.isFromUpload).length;
  const manualEntryCount = transactions.filter(t => !t.isFromUpload).length;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <div className={`w-10 h-10 ${typeInfo.bgColor} rounded-full flex items-center justify-center mr-3`}>
              <i className={`${typeInfo.icon} ${typeInfo.color}`}></i>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">{typeInfo.title}</h2>
              <p className="text-sm text-gray-600">{typeInfo.description}</p>
            </div>
          </div>
          
          {/* Only allow manual entry for sales, purchases and expenses come from uploads */}
          {isEditable && type === 'sale' && (
            <button
              onClick={() => setShowForm(!showForm)}
              className={`flex items-center px-3 py-2 rounded-lg font-medium transition-colors ${
                showForm 
                  ? 'bg-gray-100 text-gray-600' 
                  : `${typeInfo.bgColor} ${typeInfo.color}`
              }`}
            >
              <i className={`${showForm ? 'ri-close-line' : 'ri-add-line'} mr-1`}></i>
              <span className="text-sm">{showForm ? 'Cancel' : 'Add Sale'}</span>
            </button>
          )}
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 gap-3 mb-3">
          <div className="bg-green-50 rounded-lg p-3">
            <p className="text-sm text-green-700">Paid Amount</p>
            <p className="text-lg font-bold text-green-900">₹{getTotalPaid().toLocaleString()}</p>
            <p className="text-xs text-green-600">{transactions.filter(t => t.isPaid !== false).length} transactions</p>
          </div>
          {type === 'purchase' && (
            <div className="bg-orange-50 rounded-lg p-3">
              <p className="text-sm text-orange-700">Unpaid Amount</p>
              <p className="text-lg font-bold text-orange-900">₹{getTotalUnpaid().toLocaleString()}</p>
              <p className="text-xs text-orange-600">{transactions.filter(t => t.isPaid === false).length} pending</p>
            </div>
          )}
        </div>

        {/* Data Source Info */}
        {transactions.length > 0 && (
          <div className="bg-blue-50 rounded-lg p-3">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center">
                <i className="ri-upload-cloud-line text-blue-600 mr-2"></i>
                <span className="text-blue-900 font-medium">From Uploads: {fromUploadCount}</span>
              </div>
              {type === 'sale' && (
                <div className="flex items-center">
                  <i className="ri-edit-line text-green-600 mr-2"></i>
                  <span className="text-green-900 font-medium">Manual Entry: {manualEntryCount}</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Add Transaction Form - Only for Sales */}
      {showForm && isEditable && type === 'sale' && (
        <div className="bg-white rounded-xl p-4 shadow-sm border-2 border-blue-200">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Amount *</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">₹</span>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.amount}
                    onChange={(e) => setFormData({...formData, amount: e.target.value})}
                    placeholder="0.00"
                    className="w-full pl-8 pr-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Payment Method</label>
                <select
                  value={formData.account}
                  onChange={(e) => setFormData({...formData, account: e.target.value as any})}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="cash">Cash</option>
                  <option value="bank">Bank</option>
                  <option value="credit_card">Credit Card</option>
                  <option value="upi">UPI</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Customer Name *</label>
              <input
                type="text"
                value={formData.partner}
                onChange={(e) => setFormData({...formData, partner: e.target.value})}
                placeholder="Enter customer name or 'Walk-in Customer'"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Bill Number / Description</label>
              <input
                type="text"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                placeholder="Bill #001, Product details, etc."
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => {
                  resetForm();
                  setShowForm(false);
                }}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
              >
                Add Sale
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Info for Non-Sales */}
      {type !== 'sale' && (
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center p-3 bg-blue-50 rounded-lg">
            <i className="ri-information-line text-blue-600 mr-2"></i>
            <p className="text-sm text-blue-900">
              {type === 'purchase' ? 'Purchase data is automatically fetched from uploaded invoices and bills.' : 
               'Expense data is automatically fetched from uploaded bills and employee payment documents.'}
            </p>
          </div>
        </div>
      )}

      {/* Transactions List */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {transactions.length === 0 ? (
          <div className="p-8 text-center">
            <div className={`w-16 h-16 ${typeInfo.bgColor} rounded-full flex items-center justify-center mx-auto mb-3`}>
              <i className={`${typeInfo.icon} ${typeInfo.color} text-2xl`}></i>
            </div>
            <p className="text-gray-500">No {typeInfo.title.toLowerCase()} recorded yet</p>
            <p className="text-sm text-gray-400 mt-1">
              {type === 'sale' ? 'Add your first sale to get started' : 
               type === 'purchase' ? 'Upload purchase invoices to see them here' :
               'Upload expense bills to see them here'}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {transactions.map((transaction, index) => (
              <div key={transaction.id} className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        transaction.isPaid === false ? 'bg-orange-100' : 'bg-green-100'
                      }`}>
                        <i className={`${getAccountIcon(transaction.account)} ${getAccountColor(transaction.account)} text-sm`}></i>
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <p className="text-sm font-medium text-gray-900">{transaction.partner}</p>
                        {transaction.isPaid === false && (
                          <span className="px-2 py-0.5 bg-orange-100 text-orange-700 text-xs rounded-full">
                            Unpaid
                          </span>
                        )}
                        {transaction.isFromUpload && (
                          <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full">
                            Uploaded
                          </span>
                        )}
                      </div>
                      <div className="flex items-center space-x-2 mt-1">
                        <p className="text-xs text-gray-500">{transaction.time}</p>
                        {transaction.description && (
                          <>
                            <span className="text-xs text-gray-300">•</span>
                            <p className="text-xs text-gray-500">{transaction.description}</p>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-sm font-bold ${
                      transaction.isPaid === false ? 'text-orange-600' : 'text-gray-900'
                    }`}>
                      ₹{transaction.amount.toLocaleString()}
                    </p>
                    <p className={`text-xs ${getAccountColor(transaction.account)}`}>
                      {transaction.account.replace('_', ' ').toUpperCase()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {!isEditable && transactions.length > 0 && (
        <div className="bg-yellow-50 rounded-lg p-3">
          <div className="flex items-center">
            <i className="ri-lock-line text-yellow-600 mr-2"></i>
            <p className="text-sm text-yellow-800">
              Day is closed. Only accountants can make changes.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
