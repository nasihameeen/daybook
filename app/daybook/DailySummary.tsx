
'use client';

import { Transaction, DayStatus } from './page';

interface DailySummaryProps {
  dayStatus: DayStatus;
  transactions: Transaction[];
  calculateTotalsByAccount: (type: 'purchase' | 'sale' | 'expense') => {
    cash: number;
    bank: number;
    credit_card: number;
    upi: number;
    total: number;
  };
  getAccountIcon: (account: string) => string;
  getAccountColor: (account: string) => string;
  userRole: 'user' | 'accountant' | 'manager' | 'owner';
}
 
export default function DailySummary({ 
  dayStatus, 
  transactions, 
  calculateTotalsByAccount,
  getAccountIcon,
  getAccountColor,
  userRole 
}: DailySummaryProps) {
  const salesTotals = calculateTotalsByAccount('sale');
  const purchaseTotals = calculateTotalsByAccount('purchase');
  const expenseTotals = calculateTotalsByAccount('expense');

  const expectedCashBalance = dayStatus.openingBalance + salesTotals.cash - purchaseTotals.cash - expenseTotals.cash;
  const grossProfit = salesTotals.total - purchaseTotals.total; // Only sales minus purchases (cost of goods)

  const accounts = [
    { key: 'cash', label: 'Cash', icon: 'ri-money-dollar-circle-line' },
    { key: 'bank', label: 'Bank', icon: 'ri-bank-line' },
    { key: 'credit_card', label: 'Credit Card', icon: 'ri-bank-card-line' },
    { key: 'upi', label: 'UPI', icon: 'ri-smartphone-line' }
  ] as const;

  return (
    <div className="space-y-4">
      {/* Business Performance */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Business Performance</h3>
        
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="bg-green-50 rounded-lg p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-700">Total Sales</p>
                <p className="text-xl font-bold text-green-900">₹{salesTotals.total.toLocaleString()}</p>
              </div>
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <i className="ri-arrow-up-line text-green-600"></i>
              </div>
            </div>
          </div>
          
          <div className="bg-red-50 rounded-lg p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-red-700">Total Expenses</p>
                <p className="text-xl font-bold text-red-900">₹{(purchaseTotals.total + expenseTotals.total).toLocaleString()}</p>
              </div>
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <i className="ri-arrow-down-line text-red-600"></i>
              </div>
            </div>
          </div>
        </div>

        {/* Gross Profit - Only for Managers and Owners */}
        {(userRole === 'manager' || userRole === 'owner') && (
          <div className={`rounded-lg p-4 ${grossProfit >= 0 ? 'bg-blue-50' : 'bg-orange-50'}`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm ${grossProfit >= 0 ? 'text-blue-700' : 'text-orange-700'}`}>
                  Gross {grossProfit >= 0 ? 'Profit' : 'Loss'}
                </p>
                <p className={`text-2xl font-bold ${grossProfit >= 0 ? 'text-blue-900' : 'text-orange-900'}`}>
                  ₹{Math.abs(grossProfit).toLocaleString()}
                </p>
                <p className="text-xs text-gray-600 mt-1">Sales minus Cost of Goods</p>
              </div>
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                grossProfit >= 0 ? 'bg-blue-100' : 'bg-orange-100'
              }`}>
                <i className={`${grossProfit >= 0 ? 'ri-trending-up-line text-blue-600' : 'ri-trending-down-line text-orange-600'} text-lg`}></i>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Cash Flow Summary */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Cash Flow</h3>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
            <div className="flex items-center">
              <i className="ri-wallet-3-line text-blue-600 mr-3"></i>
              <span className="text-sm font-medium text-blue-900">Opening Cash</span>
            </div>
            <span className="text-sm font-bold text-blue-900">₹{dayStatus.openingBalance.toLocaleString()}</span>
          </div>

          <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
            <div className="flex items-center">
              <i className="ri-add-line text-green-600 mr-3"></i>
              <span className="text-sm font-medium text-green-900">Cash Sales</span>
            </div>
            <span className="text-sm font-bold text-green-900">+₹{salesTotals.cash.toLocaleString()}</span>
          </div>

          <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
            <div className="flex items-center">
              <i className="ri-subtract-line text-red-600 mr-3"></i>
              <span className="text-sm font-medium text-red-900">Cash Expenses</span>
            </div>
            <span className="text-sm font-bold text-red-900">-₹{(purchaseTotals.cash + expenseTotals.cash).toLocaleString()}</span>
          </div>

          <div className="border-t border-gray-200 pt-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <i className="ri-calculator-line text-gray-600 mr-3"></i>
                <span className="text-sm font-medium text-gray-900">Expected Closing Cash</span>
              </div>
              <span className="text-sm font-bold text-gray-900">₹{expectedCashBalance.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Methods Breakdown */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Methods</h3>
        
        <div className="space-y-3">
          {accounts.map((account) => {
            const salesAmount = salesTotals[account.key];
            const purchaseAmount = purchaseTotals[account.key];
            const expenseAmount = expenseTotals[account.key];
            const netAmount = salesAmount - purchaseAmount - expenseAmount;
            
            return (
              <div key={account.key} className="p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    <i className={`${account.icon} ${getAccountColor(account.key)} mr-3`}></i>
                    <span className="text-sm font-medium text-gray-900">{account.label}</span>
                  </div>
                  <span className={`text-sm font-bold ${netAmount >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {netAmount >= 0 ? '+' : ''}₹{netAmount.toLocaleString()}
                  </span>
                </div>
                
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div className="text-center">
                    <p className="text-green-600">Sales</p>
                    <p className="font-medium">₹{salesAmount.toLocaleString()}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-orange-600">Purchase</p>
                    <p className="font-medium">₹{purchaseAmount.toLocaleString()}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-red-600">Expense</p>
                    <p className="font-medium">₹{expenseAmount.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Transaction Summary */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Transaction Count</h3>
        
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-3 bg-green-50 rounded-lg">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <i className="ri-store-line text-green-600"></i>
            </div>
            <p className="text-2xl font-bold text-green-900">
              {transactions.filter(t => t.type === 'sale').length}
            </p>
            <p className="text-xs text-green-700">Sales</p>
          </div>
          
          <div className="text-center p-3 bg-orange-50 rounded-lg">
            <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <i className="ri-shopping-cart-line text-orange-600"></i>
            </div>
            <p className="text-2xl font-bold text-orange-900">
              {transactions.filter(t => t.type === 'purchase').length}
            </p>
            <p className="text-xs text-orange-700">Purchases</p>
          </div>
          
          <div className="text-center p-3 bg-red-50 rounded-lg">
            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <i className="ri-wallet-line text-red-600"></i>
            </div>
            <p className="text-2xl font-bold text-red-900">
              {transactions.filter(t => t.type === 'expense').length}
            </p>
            <p className="text-xs text-red-700">Expenses</p>
          </div>
        </div>
      </div>
    </div>
  );
}
