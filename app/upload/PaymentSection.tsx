
'use client';

import { useState } from 'react';

interface Payment {
  id: string;
  amount: string;
  account: string;
}

interface PaymentSectionProps {
  payments: Payment[];
  addPayment: () => void;
  removePayment: (id: string) => void;
  updatePayment: (id: string, field: 'amount' | 'account', value: string) => void;
  getTotalPayments: () => number;
  totalAmount: string;
}

export default function PaymentSection({
  payments,
  addPayment,
  removePayment,
  updatePayment,
  getTotalPayments,
  totalAmount
}: PaymentSectionProps) {
  const [openDropdowns, setOpenDropdowns] = useState<{ [key: string]: boolean }>({});

  const accounts = [
    { value: 'Cash', label: 'Cash', icon: 'ri-money-dollar-circle-line' },
    { value: 'Bank', label: 'Bank Account', icon: 'ri-bank-line' },
    { value: 'Credit Card', label: 'Credit Card', icon: 'ri-bank-card-line' }
  ];

  const toggleDropdown = (paymentId: string) => {
    setOpenDropdowns(prev => ({
      ...prev,
      [paymentId]: !prev[paymentId]
    }));
  };

  const selectAccount = (paymentId: string, account: string) => {
    updatePayment(paymentId, 'account', account);
    setOpenDropdowns(prev => ({
      ...prev,
      [paymentId]: false
    }));
  };

  const getAccountIcon = (account: string) => {
    const accountData = accounts.find(acc => acc.value === account);
    return accountData?.icon || 'ri-money-dollar-circle-line';
  };

  const totalPayments = getTotalPayments();
  const documentTotal = parseFloat(totalAmount) || 0;
  const outstandingAmount = documentTotal - totalPayments;

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Payment Details</h2>
        <button
          onClick={addPayment}
          className="flex items-center px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
        >
          <i className="ri-add-line mr-1"></i>
          <span className="text-sm font-medium">Add Payment</span>
        </button>
      </div>

      <div className="space-y-3">
        {payments.map((payment, index) => (
          <div key={payment.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
            {/* Payment Number */}
            <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-xs font-medium text-blue-600">{index + 1}</span>
            </div>

            {/* Amount Input */}
            <div className="flex-1">
              <label className="block text-xs text-gray-600 mb-1">Amount</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">$</span>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={payment.amount}
                  onChange={(e) => updatePayment(payment.id, 'amount', e.target.value)}
                  placeholder="0.00"
                  className="w-full pl-8 pr-3 py-2 bg-white rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Account Dropdown */}
            <div className="flex-1 relative">
              <label className="block text-xs text-gray-600 mb-1">Account</label>
              <button
                onClick={() => toggleDropdown(payment.id)}
                className="w-full flex items-center justify-between px-3 py-2 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center">
                  <i className={`${getAccountIcon(payment.account)} text-gray-500 mr-2`}></i>
                  <span className="text-sm text-gray-900">{payment.account}</span>
                </div>
                <i className={`ri-arrow-down-s-line text-gray-500 transition-transform ${
                  openDropdowns[payment.id] ? 'rotate-180' : ''
                }`}></i>
              </button>

              {openDropdowns[payment.id] && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                  {accounts.map((account) => (
                    <button
                      key={account.value}
                      onClick={() => selectAccount(payment.id, account.value)}
                      className="w-full flex items-center px-3 py-2 hover:bg-gray-50 transition-colors first:rounded-t-lg last:rounded-b-lg"
                    >
                      <i className={`${account.icon} text-gray-500 mr-2`}></i>
                      <span className="text-sm text-gray-700">{account.label}</span>
                      {account.value === payment.account && (
                        <i className="ri-check-line text-blue-500 ml-auto"></i>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Remove Button */}
            <button
              onClick={() => removePayment(payment.id)}
              disabled={payments.length === 1}
              className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                payments.length === 1
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-red-100 text-red-600 hover:bg-red-200'
              }`}
            >
              <i className="ri-close-line"></i>
            </button>
          </div>
        ))}
      </div>

      {/* Payment Summary */}
      <div className="mt-4 space-y-3">
        {/* Total Payments */}
        <div className="p-3 bg-blue-50 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <i className="ri-calculator-line text-blue-600 mr-2"></i>
              <span className="text-sm font-medium text-blue-900">Total Payments</span>
            </div>
            <span className="text-lg font-bold text-blue-600">
              ${totalPayments.toFixed(2)}
            </span>
          </div>
          
          {payments.length > 1 && (
            <div className="mt-2 text-xs text-blue-700">
              Reconciliation: {payments.length} payment(s) recorded
            </div>
          )}
        </div>

        {/* Outstanding Amount */}
        <div className={`p-3 rounded-lg ${
          outstandingAmount > 0 
            ? 'bg-orange-50' 
            : outstandingAmount < 0 
            ? 'bg-red-50' 
            : 'bg-green-50'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <i className={`${
                outstandingAmount > 0 
                  ? 'ri-time-line text-orange-600' 
                  : outstandingAmount < 0 
                  ? 'ri-error-warning-line text-red-600' 
                  : 'ri-checkbox-circle-line text-green-600'
              } mr-2`}></i>
              <span className={`text-sm font-medium ${
                outstandingAmount > 0 
                  ? 'text-orange-900' 
                  : outstandingAmount < 0 
                  ? 'text-red-900' 
                  : 'text-green-900'
              }`}>
                Outstanding Amount
              </span>
            </div>
            <span className={`text-lg font-bold ${
              outstandingAmount > 0 
                ? 'text-orange-600' 
                : outstandingAmount < 0 
                ? 'text-red-600' 
                : 'text-green-600'
            }`}>
              ${Math.abs(outstandingAmount).toFixed(2)}
            </span>
          </div>
          
          <div className={`mt-2 text-xs ${
            outstandingAmount > 0 
              ? 'text-orange-700' 
              : outstandingAmount < 0 
              ? 'text-red-700' 
              : 'text-green-700'
          }`}>
            {outstandingAmount > 0 
              ? `Due amount: $${outstandingAmount.toFixed(2)} remaining to be paid`
              : outstandingAmount < 0 
              ? `Overpaid by $${Math.abs(outstandingAmount).toFixed(2)}`
              : 'Fully paid - no outstanding balance'
            }
          </div>
        </div>
      </div>

      {/* Payment Instructions */}
      <div className="mt-3 p-3 bg-yellow-50 rounded-lg">
        <div className="flex items-start">
          <i className="ri-information-line text-yellow-600 mr-2 mt-0.5"></i>
          <div className="text-xs text-yellow-800">
            <p className="font-medium mb-1">Payment Reconciliation Tips:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Add multiple payments if the document was paid through different methods</li>
              <li>Outstanding amount shows the difference between document total and payments</li>
              <li>Use appropriate account types for accurate financial reporting</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
