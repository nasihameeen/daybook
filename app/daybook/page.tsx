
'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import TabBar from '@/components/TabBar';
import OpeningBalance from './OpeningBalance';
import TransactionEntry from './TransactionEntry';
import DailySummary from './DailySummary';
import ClosingBalance from './ClosingBalance';

export interface Transaction {
  id: string;
  type: 'purchase' | 'sale' | 'expense';
  amount: number;
  partner: string;
  account: 'cash' | 'bank' | 'credit_card' | 'upi';
  description: string;
  time: string;
  isPaid?: boolean;
  isFromUpload?: boolean; // To identify transactions from document uploads
}

export interface DenominationCount {
  denomination: number;
  count: number;
  total: number;
}

export interface DayStatus {
  isOpened: boolean;
  isClosed: boolean;
  openingBalance: number;
  openingDenominations: DenominationCount[];
  closingBalance: number;
  closingDenominations: DenominationCount[];
  openingTime?: string;
  closingTime?: string;
}

export default function DaybookPage() {
  const [currentDate] = useState(new Date().toISOString().split('T')[0]);
  const [userRole] = useState<'user' | 'accountant' | 'manager' | 'owner'>('manager'); // Changed to manager for demo
  const [activeTab, setActiveTab] = useState<'summary' | 'purchase' | 'sale' | 'expense'>('summary');
  
  const [dayStatus, setDayStatus] = useState<DayStatus>({
    isOpened: false,
    isClosed: false,
    openingBalance: 0,
    openingDenominations: [],
    closingBalance: 0,
    closingDenominations: []
  });

  const [transactions, setTransactions] = useState<Transaction[]>([]);

  // Generate realistic dummy data
  const generateDummyData = () => {
    const dummyTransactions: Transaction[] = [
      // Sales transactions (manual input from billing tool)
      {
        id: 'sale_1',
        type: 'sale',
        amount: 15750,
        partner: 'Walk-in Customer',
        account: 'cash',
        description: 'Electronics items - Bill #001',
        time: '09:30 AM',
        isPaid: true
      },
      {
        id: 'sale_2',
        type: 'sale',
        amount: 8950,
        partner: 'Rajesh Sharma',
        account: 'upi',
        description: 'Mobile accessories - Bill #002',
        time: '10:15 AM',
        isPaid: true
      },
      {
        id: 'sale_3',
        type: 'sale',
        amount: 23400,
        partner: 'Priya Electronics Ltd',
        account: 'bank',
        description: 'Bulk order laptops - Bill #003',
        time: '11:30 AM',
        isPaid: true
      },
      {
        id: 'sale_4',
        type: 'sale',
        amount: 12200,
        partner: 'Amit Kumar',
        account: 'credit_card',
        description: 'Gaming setup - Bill #004',
        time: '02:45 PM',
        isPaid: true
      },
      {
        id: 'sale_5',
        type: 'sale',
        amount: 6800,
        partner: 'Local Business',
        account: 'cash',
        description: 'Office supplies - Bill #005',
        time: '04:20 PM',
        isPaid: true
      },

      // Purchase transactions (from document uploads)
      {
        id: 'purchase_1',
        type: 'purchase',
        amount: 45000,
        partner: 'TechWorld Distributors',
        account: 'bank',
        description: 'Laptop inventory purchase',
        time: '09:00 AM',
        isPaid: true,
        isFromUpload: true
      },
      {
        id: 'purchase_2',
        type: 'purchase',
        amount: 18500,
        partner: 'Mobile Hub Wholesale',
        account: 'cash',
        description: 'Mobile phone accessories',
        time: '10:30 AM',
        isPaid: true,
        isFromUpload: true
      },
      {
        id: 'purchase_3',
        type: 'purchase',
        amount: 12800,
        partner: 'Electronics Mart Ltd',
        account: 'credit_card',
        description: 'Gaming peripherals stock',
        time: '01:15 PM',
        isPaid: false,
        isFromUpload: true
      },
      {
        id: 'purchase_4',
        type: 'purchase',
        amount: 8200,
        partner: 'Office Solutions Inc',
        account: 'upi',
        description: 'Cables and adapters',
        time: '03:30 PM',
        isPaid: true,
        isFromUpload: true
      },

      // Expense transactions (from document uploads)
      {
        id: 'expense_1',
        type: 'expense',
        amount: 3200,
        partner: 'Metro Power Company',
        account: 'bank',
        description: 'Monthly electricity bill',
        time: '09:45 AM',
        isPaid: true,
        isFromUpload: true
      },
      {
        id: 'expense_2',
        type: 'expense',
        amount: 1850,
        partner: 'Rajesh Kumar (Driver)',
        account: 'cash',
        description: 'Delivery salary payment',
        time: '11:00 AM',
        isPaid: true,
        isFromUpload: true
      },
      {
        id: 'expense_3',
        type: 'expense',
        amount: 2400,
        partner: 'City Internet Services',
        account: 'upi',
        description: 'Internet & phone bill',
        time: '02:00 PM',
        isPaid: true,
        isFromUpload: true
      },
      {
        id: 'expense_4',
        type: 'expense',
        amount: 1200,
        partner: 'Cleaning Services Co',
        account: 'cash',
        description: 'Shop cleaning service',
        time: '05:00 PM',
        isPaid: true,
        isFromUpload: true
      },
      {
        id: 'expense_5',
        type: 'expense',
        amount: 950,
        partner: 'Suresh Sharma (Helper)',
        account: 'cash',
        description: 'Daily wage payment',
        time: '06:00 PM',
        isPaid: true,
        isFromUpload: true
      }
    ];

    const dummyDayStatus: DayStatus = {
      isOpened: true,
      isClosed: false,
      openingBalance: 25000,
      openingDenominations: [
        { denomination: 2000, count: 10, total: 20000 },
        { denomination: 500, count: 6, total: 3000 },
        { denomination: 200, count: 5, total: 1000 },
        { denomination: 100, count: 8, total: 800 },
        { denomination: 50, count: 4, total: 200 }
      ],
      closingBalance: 0,
      closingDenominations: [],
      openingTime: '08:30 AM'
    };

    setTransactions(dummyTransactions);
    setDayStatus(dummyDayStatus);
    
    // Save to localStorage
    localStorage.setItem(`transactions-${currentDate}`, JSON.stringify(dummyTransactions));
    localStorage.setItem(`daybook-${currentDate}`, JSON.stringify(dummyDayStatus));
  };

  // Load day status from localStorage or generate dummy data
  useEffect(() => {
    const savedStatus = localStorage.getItem(`daybook-${currentDate}`);
    const savedTransactions = localStorage.getItem(`transactions-${currentDate}`);
    
    if (savedStatus && savedTransactions) {
      setDayStatus(JSON.parse(savedStatus));
      setTransactions(JSON.parse(savedTransactions));
    } else {
      // Generate dummy data for demonstration
      generateDummyData();
    }
  }, [currentDate]);

  // Save day status to localStorage
  const saveDayStatus = (status: DayStatus) => {
    setDayStatus(status);
    localStorage.setItem(`daybook-${currentDate}`, JSON.stringify(status));
  };

  // Save transactions to localStorage
  const saveTransactions = (newTransactions: Transaction[]) => {
    setTransactions(newTransactions);
    localStorage.setItem(`transactions-${currentDate}`, JSON.stringify(newTransactions));
  };

  const handleOpenDay = (balance: number, denominations: DenominationCount[]) => {
    const newStatus: DayStatus = {
      ...dayStatus,
      isOpened: true,
      openingBalance: balance,
      openingDenominations: denominations,
      openingTime: new Date().toLocaleTimeString()
    };
    saveDayStatus(newStatus);
  };

  const handleCloseDay = (balance: number, denominations: DenominationCount[]) => {
    const newStatus: DayStatus = {
      ...dayStatus,
      isClosed: true,
      closingBalance: balance,
      closingDenominations: denominations,
      closingTime: new Date().toLocaleTimeString()
    };
    saveDayStatus(newStatus);
  };

  const addTransaction = (transaction: Omit<Transaction, 'id' | 'time'>) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: Date.now().toString(),
      time: new Date().toLocaleTimeString()
    };
    const updatedTransactions = [...transactions, newTransaction];
    saveTransactions(updatedTransactions);
  };

  const calculateTotalsByAccount = (type: 'purchase' | 'sale' | 'expense') => {
    const filteredTransactions = transactions.filter(t => t.type === type);
    const totals = {
      cash: 0,
      bank: 0,
      credit_card: 0,
      upi: 0,
      total: 0
    };

    filteredTransactions.forEach(t => {
      if (t.isPaid !== false) { // Include paid transactions and those without isPaid property
        totals[t.account] += t.amount;
        totals.total += t.amount;
      }
    });

    return totals;
  };

  const getAccountIcon = (account: string) => {
    switch (account) {
      case 'cash': return 'ri-money-dollar-circle-line';
      case 'bank': return 'ri-bank-line';
      case 'credit_card': return 'ri-bank-card-line';
      case 'upi': return 'ri-smartphone-line';
      default: return 'ri-money-dollar-circle-line';
    }
  };

  const getAccountColor = (account: string) => {
    switch (account) {
      case 'cash': return 'text-green-600';
      case 'bank': return 'text-blue-600';
      case 'credit_card': return 'text-purple-600';
      case 'upi': return 'text-orange-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <>
      <Header />
      <main className="pt-20 pb-20 px-4 min-h-screen bg-gray-50">
        <div className="space-y-6">
          {/* Date Header */}
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-xl font-bold text-gray-900">Daily Business</h1>
                <p className="text-sm text-gray-600">{new Date(currentDate).toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}</p>
              </div>
              <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                dayStatus.isClosed 
                  ? 'bg-red-100 text-red-700' 
                  : dayStatus.isOpened 
                  ? 'bg-green-100 text-green-700' 
                  : 'bg-gray-100 text-gray-700'
              }`}>
                {dayStatus.isClosed ? 'Day Closed' : dayStatus.isOpened ? 'Day Open' : 'Day Not Started'}
              </div>
            </div>
          </div>

          {/* Opening Balance */}
          {!dayStatus.isOpened && (
            <OpeningBalance 
              onOpenDay={handleOpenDay}
              userRole={userRole}
            />
          )}

          {/* Day Started Content */}
          {dayStatus.isOpened && (
            <>
              {/* Quick Stats */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white rounded-xl p-4 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Opening Cash</p>
                      <p className="text-lg font-bold text-green-600">₹{dayStatus.openingBalance.toLocaleString()}</p>
                    </div>
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <i className="ri-money-dollar-circle-line text-green-600"></i>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl p-4 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Expected Closing Cash</p>
                      <p className="text-lg font-bold text-blue-600">
                        ₹{(dayStatus.openingBalance + calculateTotalsByAccount('sale').cash - calculateTotalsByAccount('purchase').cash - calculateTotalsByAccount('expense').cash).toLocaleString()}
                      </p>
                    </div>
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <i className="ri-calculator-line text-blue-600"></i>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tab Navigation */}
              <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="grid grid-cols-4">
                  {[
                    { key: 'summary', label: 'Summary', icon: 'ri-dashboard-line' },
                    { key: 'purchases', label: 'Purchase', icon: 'ri-shopping-cart-line' },
                    { key: 'sales', label: 'Sales', icon: 'ri-store-line' },
                    { key: 'expenses', label: 'Expense', icon: 'ri-wallet-line' }
                  ].map((tab) => (
                    <button
                      key={tab.key}
                      onClick={() => setActiveTab(tab.key as any)}
                      className={`flex flex-col items-center py-3 px-2 transition-colors ${
                        activeTab === tab.key
                          ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600'
                          : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      <i className={`${tab.icon} text-lg mb-1`}></i>
                      <span className="text-xs font-medium">{tab.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Tab Content */}
              {activeTab === 'summary' && (
                <DailySummary 
                  dayStatus={dayStatus}
                  transactions={transactions}
                  calculateTotalsByAccount={calculateTotalsByAccount}
                  getAccountIcon={getAccountIcon}
                  getAccountColor={getAccountColor}
                  userRole={userRole}
                />
              )}

              {activeTab !== 'summary' && (
                <TransactionEntry 
                  type={activeTab as 'purchase' | 'sale' | 'expense'}
                  transactions={transactions.filter(t => t.type === activeTab.slice(0, -1) as any)}
                  onAddTransaction={addTransaction}
                  isEditable={!dayStatus.isClosed || userRole === 'accountant'}
                  getAccountIcon={getAccountIcon}
                  getAccountColor={getAccountColor}
                />
              )}

              {/* Closing Balance */}
              {!dayStatus.isClosed && (
                <ClosingBalance 
                  dayStatus={dayStatus}
                  transactions={transactions}
                  onCloseDay={handleCloseDay}
                  calculateTotalsByAccount={calculateTotalsByAccount}
                  userRole={userRole}
                />
              )}

              {/* Day Closed Summary */}
              {dayStatus.isClosed && (
                <div className="bg-white rounded-xl p-4 shadow-sm border-2 border-red-200">
                  <div className="flex items-center mb-4">
                    <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center mr-3">
                      <i className="ri-lock-line text-red-600"></i>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-red-900">Day Closed</h3>
                      <p className="text-sm text-red-600">Closed at {dayStatus.closingTime}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="bg-red-50 rounded-lg p-3">
                      <p className="text-sm text-red-700">Closing Cash Balance</p>
                      <p className="text-xl font-bold text-red-900">₹{dayStatus.closingBalance.toLocaleString()}</p>
                    </div>
                    <div className="bg-red-50 rounded-lg p-3">
                      <p className="text-sm text-red-700">Expected Cash</p>
                      <p className="text-xl font-bold text-red-900">
                        ₹{(dayStatus.openingBalance + calculateTotalsByAccount('sale').cash - calculateTotalsByAccount('purchase').cash - calculateTotalsByAccount('expense').cash).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  {userRole === 'accountant' && (
                    <button
                      onClick={() => {
                        const newStatus = { ...dayStatus, isClosed: false };
                        saveDayStatus(newStatus);
                      }}
                      className="w-full bg-orange-600 text-white py-2 rounded-lg font-medium hover:bg-orange-700 transition-colors"
                    >
                      Reopen Day (Accountant Only)
                    </button>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </main>
      <TabBar />
    </>
  );
}
