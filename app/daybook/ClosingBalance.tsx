'use client';

import { useState } from 'react';
import { Transaction, DayStatus, DenominationCount } from './page';

interface ClosingBalanceProps {
  dayStatus: DayStatus;
  transactions: Transaction[];
  onCloseDay: (balance: number, denominations: DenominationCount[]) => void;
  calculateTotalsByAccount: (type: 'purchase' | 'sale' | 'expense') => {
    cash: number;
    bank: number;
    credit_card: number;
    upi: number;
    total: number;
  };
  userRole: 'user' | 'accountant' | 'manager'| 'owner';
}

export default function ClosingBalance({ 
  dayStatus, 
  transactions, 
  onCloseDay, 
  calculateTotalsByAccount,
  userRole 
}: ClosingBalanceProps) {
  const [showClosingForm, setShowClosingForm] = useState(false);
  const [denominations, setDenominations] = useState<DenominationCount[]>([
    { denomination: 2000, count: 0, total: 0 },
    { denomination: 500, count: 0, total: 0 },
    { denomination: 200, count: 0, total: 0 },
    { denomination: 100, count: 0, total: 0 },
    { denomination: 50, count: 0, total: 0 },
    { denomination: 20, count: 0, total: 0 },
    { denomination: 10, count: 0, total: 0 },
    { denomination: 5, count: 0, total: 0 },
    { denomination: 2, count: 0, total: 0 },
    { denomination: 1, count: 0, total: 0 }
  ]);

  const salesTotals = calculateTotalsByAccount('sale');
  const purchaseTotals = calculateTotalsByAccount('purchase');
  const expenseTotals = calculateTotalsByAccount('expense');
  
  const expectedCashBalance = dayStatus.openingBalance + salesTotals.cash - purchaseTotals.cash - expenseTotals.cash;

  const updateDenomination = (index: number, count: number) => {
    const newDenominations = [...denominations];
    newDenominations[index] = {
      ...newDenominations[index],
      count: count,
      total: count * newDenominations[index].denomination
    };
    setDenominations(newDenominations);
  };

  const getActualBalance = () => {
    return denominations.reduce((sum, denom) => sum + denom.total, 0);
  };

  const getDifference = () => {
    return getActualBalance() - expectedCashBalance;
  };

  const handleCloseDay = () => {
    const actualBalance = getActualBalance();
    const nonZeroDenominations = denominations.filter(d => d.count > 0);
    onCloseDay(actualBalance, nonZeroDenominations);
    setShowClosingForm(false);
  };

  const getDenominationColor = (denomination: number) => {
    if (denomination >= 500) return 'bg-purple-100 text-purple-800';
    if (denomination >= 100) return 'bg-blue-100 text-blue-800';
    if (denomination >= 20) return 'bg-green-100 text-green-800';
    if (denomination >= 5) return 'bg-orange-100 text-orange-800';
    return 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border-2 border-blue-200">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
            <i className="ri-calculator-line text-blue-600"></i>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Close Business Day</h2>
            <p className="text-sm text-gray-600">Count your cash and close the day</p>
          </div>
        </div>
        
        {!showClosingForm && (
          <button
            onClick={() => setShowClosingForm(true)}
            className="bg-red-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-700 transition-colors"
          >
            Close Day
          </button>
        )}
      </div>

      {/* Expected vs Actual Preview */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-green-50 rounded-lg p-3">
          <p className="text-sm text-green-700">Expected Cash</p>
          <p className="text-xl font-bold text-green-900">₹{expectedCashBalance.toLocaleString()}</p>
          <p className="text-xs text-green-600">Based on transactions</p>
        </div>
        
        <div className="bg-blue-50 rounded-lg p-3">
          <p className="text-sm text-blue-700">Actual Count</p>
          <p className="text-xl font-bold text-blue-900">₹{getActualBalance().toLocaleString()}</p>
          <p className="text-xs text-blue-600">Physical cash count</p>
        </div>
      </div>

      {/* Closing Form */}
      {showClosingForm && (
        <div className="space-y-4 border-t border-gray-200 pt-4">
          <h3 className="text-sm font-medium text-gray-700">Count your closing cash:</h3>
          
          {/* Denomination Grid */}
          <div className="space-y-3">
            {/* Notes */}
            <div className="space-y-2">
              <p className="text-xs text-gray-500 font-medium">Notes</p>
              {denominations.filter(d => d.denomination >= 10).map((denom, index) => (
                <div key={denom.denomination} className="flex items-center space-x-3 p-2 bg-gray-50 rounded-lg">
                  <div className={`px-3 py-1 rounded-full text-xs font-bold ${getDenominationColor(denom.denomination)}`}>
                    ₹{denom.denomination}
                  </div>
                  
                  <div className="flex items-center space-x-2 flex-1">
                    <button
                      onClick={() => updateDenomination(index, Math.max(0, denom.count - 1))}
                      className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300 transition-colors"
                    >
                      <i className="ri-subtract-line text-gray-600"></i>
                    </button>
                    
                    <input
                      type="number"
                      min="0"
                      value={denom.count}
                      onChange={(e) => updateDenomination(index, parseInt(e.target.value) || 0)}
                      className="w-16 text-center py-1 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    
                    <button
                      onClick={() => updateDenomination(index, denom.count + 1)}
                      className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300 transition-colors"
                    >
                      <i className="ri-add-line text-gray-600"></i>
                    </button>
                  </div>
                  
                  <div className="text-right min-w-20">
                    <span className="text-sm font-medium text-gray-900">₹{denom.total.toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Coins */}
            <div className="space-y-2">
              <p className="text-xs text-gray-500 font-medium">Coins</p>
              {denominations.filter(d => d.denomination < 10).map((denom, index) => (
                <div key={denom.denomination} className="flex items-center space-x-3 p-2 bg-gray-50 rounded-lg">
                  <div className={`px-3 py-1 rounded-full text-xs font-bold ${getDenominationColor(denom.denomination)}`}>
                    ₹{denom.denomination}
                  </div>
                  
                  <div className="flex items-center space-x-2 flex-1">
                    <button
                      onClick={() => updateDenomination(denominations.findIndex(d => d.denomination === denom.denomination), Math.max(0, denom.count - 1))}
                      className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300 transition-colors"
                    >
                      <i className="ri-subtract-line text-gray-600"></i>
                    </button>
                    
                    <input
                      type="number"
                      min="0"
                      value={denom.count}
                      onChange={(e) => updateDenomination(denominations.findIndex(d => d.denomination === denom.denomination), parseInt(e.target.value) || 0)}
                      className="w-16 text-center py-1 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    
                    <button
                      onClick={() => updateDenomination(denominations.findIndex(d => d.denomination === denom.denomination), denom.count + 1)}
                      className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300 transition-colors"
                    >
                      <i className="ri-add-line text-gray-600"></i>
                    </button>
                  </div>
                  
                  <div className="text-right min-w-20">
                    <span className="text-sm font-medium text-gray-900">₹{denom.total.toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Difference Indicator */}
          {getActualBalance() !== expectedCashBalance && (
            <div className={`p-3 rounded-lg ${
              getDifference() > 0 ? 'bg-blue-50' : 'bg-orange-50'
            }`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <i className={`${getDifference() > 0 ? 'ri-arrow-up-line text-blue-600' : 'ri-arrow-down-line text-orange-600'} mr-2`}></i>
                  <span className={`text-sm font-medium ${getDifference() > 0 ? 'text-blue-900' : 'text-orange-900'}`}>
                    {getDifference() > 0 ? 'Excess Cash' : 'Short Cash'}
                  </span>
                </div>
                <span className={`text-lg font-bold ${getDifference() > 0 ? 'text-blue-600' : 'text-orange-600'}`}>
                  ₹{Math.abs(getDifference()).toLocaleString()}
                </span>
              </div>
              <p className={`text-xs mt-1 ${getDifference() > 0 ? 'text-blue-700' : 'text-orange-700'}`}>
                {getDifference() > 0 
                  ? 'You have more cash than expected' 
                  : 'You have less cash than expected'
                }
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-3 pt-4">
            <button
              onClick={() => {
                setShowClosingForm(false);
                setDenominations(denominations.map(d => ({...d, count: 0, total: 0})));
              }}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleCloseDay}
              className="px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
            >
              Close Day - ₹{getActualBalance().toLocaleString()}
            </button>
          </div>
        </div>
      )}

      <div className="mt-4 p-3 bg-yellow-50 rounded-lg">
        <div className="flex items-start">
          <i className="ri-information-line text-yellow-600 mr-2 mt-0.5"></i>
          <div className="text-xs text-yellow-800">
            <p className="font-medium mb-1">Important:</p>
            <p>Once you close the day, you cannot make changes unless you're an accountant.</p>
          </div>
        </div>
      </div>
    </div>
  );
}