'use client';

import { useState } from 'react';
import { DenominationCount } from './page';

interface OpeningBalanceProps {
  onOpenDay: (balance: number, denominations: DenominationCount[]) => void;
  userRole: 'user' | 'accountant' | 'manager'| 'owner';
}

export default function OpeningBalance({ onOpenDay, userRole }: OpeningBalanceProps) {
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

  const updateDenomination = (index: number, count: number) => {
    const newDenominations = [...denominations];
    newDenominations[index] = {
      ...newDenominations[index],
      count: count,
      total: count * newDenominations[index].denomination
    };
    setDenominations(newDenominations);
  };

  const getTotalBalance = () => {
    return denominations.reduce((sum, denom) => sum + denom.total, 0);
  };

  const handleOpenDay = () => {
    const totalBalance = getTotalBalance();
    const nonZeroDenominations = denominations.filter(d => d.count > 0);
    onOpenDay(totalBalance, nonZeroDenominations);
  };

  const getDenominationColor = (denomination: number) => {
    if (denomination >= 500) return 'bg-purple-100 text-purple-800';
    if (denomination >= 100) return 'bg-blue-100 text-blue-800';
    if (denomination >= 20) return 'bg-green-100 text-green-800';
    if (denomination >= 5) return 'bg-orange-100 text-orange-800';
    return 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm">
      <div className="flex items-center mb-4">
        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
          <i className="ri-money-dollar-circle-line text-blue-600"></i>
        </div>
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Opening Cash Count</h2>
          <p className="text-sm text-gray-600">Count your cash to start the day</p>
        </div>
      </div>

      {/* Current Total */}
      <div className="bg-blue-50 rounded-lg p-4 mb-4">
        <div className="text-center">
          <p className="text-sm text-blue-700 mb-1">Opening Balance</p>
          <p className="text-2xl font-bold text-blue-900">₹{getTotalBalance().toLocaleString()}</p>
        </div>
      </div>

      {/* Denomination Grid */}
      <div className="space-y-3 mb-6">
        <h3 className="text-sm font-medium text-gray-700">Count by denomination:</h3>
        
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

      {/* Start Day Button */}
      <button
        onClick={handleOpenDay}
        disabled={getTotalBalance() === 0}
        className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
      >
        Start Business Day - ₹{getTotalBalance().toLocaleString()}
      </button>

      <div className="mt-3 p-3 bg-yellow-50 rounded-lg">
        <div className="flex items-start">
          <i className="ri-information-line text-yellow-600 mr-2 mt-0.5"></i>
          <div className="text-xs text-yellow-800">
            <p className="font-medium mb-1">Important:</p>
            <p>Once you start the day, opening balance cannot be changed. Count carefully!</p>
          </div>
        </div>
      </div>
    </div>
  );
}