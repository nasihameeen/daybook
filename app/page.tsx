'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import TabBar from '@/components/TabBar';
import QuickActionCard from '@/components/QuickActionCard';

export default function Home() {
  const [selectedSupplierCustomer, setSelectedSupplierCustomer] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDateRange, setSelectedDateRange] = useState('30');
  const [isDateDropdownOpen, setIsDateDropdownOpen] = useState(false);
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [isCustomDateRange, setIsCustomDateRange] = useState(false);

  const financialData = {
    monthlyTotal: 125420.50,
    dailyExpenses: 8340.25,
    pendingApprovals: 12,
    documentsProcessed: 147,
    totalPayable: 45320.75,
    totalReceivable: 67890.25
  };

  const suppliersCustomers = [
    { id: '1', name: 'ABC Suppliers Ltd', type: 'supplier', balance: 15420.50 },
    { id: '2', name: 'XYZ Customer Corp', type: 'customer', balance: 25680.75 },
    { id: '3', name: 'Global Materials Inc', type: 'supplier', balance: 8950.25 },
    { id: '4', name: 'Tech Solutions Ltd', type: 'customer', balance: 18760.00 },
    { id: '5', name: 'Premium Vendors Co', type: 'supplier', balance: 12340.80 }
  ];

  const dateRangeOptions = [
    { value: '30', label: 'Last 30 days' },
    { value: '60', label: 'Last 60 days' },
    { value: '365', label: 'Last 1 year' },
    { value: 'custom', label: 'Custom date range' }
  ];

  const filteredItems = suppliersCustomers.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedItem = suppliersCustomers.find(item => item.id === selectedSupplierCustomer);

  // Generate business partner data based on selected item
  const getBusinessPartnerData = (item: any) => {
    if (!item) return null;
    
    const isSupplier = item.type === 'supplier';
    return {
      purchases: isSupplier ? Math.floor(Math.random() * 50) + 20 : Math.floor(Math.random() * 30) + 5,
      sales: !isSupplier ? Math.floor(Math.random() * 80) + 30 : Math.floor(Math.random() * 20) + 2,
      totalAmount: item.balance + (Math.random() * 50000),
      outstandingAmount: Math.random() * item.balance,
      averageOrderValue: (item.balance + Math.random() * 10000) / (isSupplier ? 25 : 35),
      lastTransactionDays: Math.floor(Math.random() * 30) + 1
    };
  };

  const businessPartnerData = selectedItem ? getBusinessPartnerData(selectedItem) : null;

  const handleDateRangeChange = (value: string) => {
    setSelectedDateRange(value);
    setIsCustomDateRange(value === 'custom');
    setIsDateDropdownOpen(false);
  };

  const recentActivities = [
    { id: 1, type: 'upload', title: 'Invoice #INV-2024-001 uploaded', time: '2 hours ago', status: 'processing' },
    { id: 2, type: 'approval', title: 'Expense report approved', time: '4 hours ago', status: 'completed' },
    { id: 3, type: 'daybook', title: 'Daily entry created', time: '6 hours ago', status: 'completed' },
    { id: 4, type: 'upload', title: 'Receipt batch uploaded', time: '1 day ago', status: 'pending' }
  ];

  return (
    <>
      <Header />
      <main className="pt-20 pb-20 px-4 min-h-screen bg-gray-50">
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">Quick Access</h2>
            <div className="grid grid-cols-4 gap-2">
              <QuickActionCard
                href="/upload"
                icon="ri-upload-cloud-2-line"
                title="Upload"
                description="Documents"
                color="bg-gradient-to-br from-blue-500 to-blue-600"
              />
              <QuickActionCard
                href="/files"
                icon="ri-file-list-3-line"
                title="Files"
                description="Browse"
                color="bg-gradient-to-br from-green-500 to-green-600"
              />
              <QuickActionCard
                href="/daybook"
                icon="ri-book-open-line"
                title="Daybook"
                description="Entries"
                color="bg-gradient-to-br from-purple-500 to-purple-600"
              />
              <QuickActionCard
                href="/profile"
                icon="ri-user-3-line"
                title="Profile"
                description="Account"
                color="bg-gradient-to-br from-orange-500 to-orange-600"
              />
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Financial Overview</h2>
            <div className="grid grid-cols-2 gap-3">
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <div className="text-xl font-bold text-blue-600">${financialData.monthlyTotal.toLocaleString()}</div>
                <div className="text-xs text-gray-600 mt-1">Monthly Total</div>
              </div>
              <div className="text-center p-3 bg-red-50 rounded-lg">
                <div className="text-xl font-bold text-red-600">${financialData.dailyExpenses.toLocaleString()}</div>
                <div className="text-xs text-gray-600 mt-1">Daily Expenses</div>
              </div>
              <div className="text-center p-3 bg-orange-50 rounded-lg">
                <div className="text-xl font-bold text-orange-600">{financialData.pendingApprovals}</div>
                <div className="text-xs text-gray-600 mt-1">Pending Approvals</div>
              </div>
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <div className="text-xl font-bold text-green-600">{financialData.documentsProcessed}</div>
                <div className="text-xs text-gray-600 mt-1">Documents Processed</div>
              </div>
              <div className="text-center p-3 bg-yellow-50 rounded-lg">
                <div className="text-xl font-bold text-yellow-600">${financialData.totalPayable.toLocaleString()}</div>
                <div className="text-xs text-gray-600 mt-1">Total Payable</div>
              </div>
              <div className="text-center p-3 bg-indigo-50 rounded-lg">
                <div className="text-xl font-bold text-indigo-600">${financialData.totalReceivable.toLocaleString()}</div>
                <div className="text-xs text-gray-600 mt-1">Total Receivable</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Overview - Business Partner</h2>
            
            <div className="space-y-4">
              <div className="space-y-3">
                <div className="relative">
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors"
                  >
                    <span className="text-sm font-bold text-gray-900">
                      {selectedItem ? selectedItem.name : 'Select Business Partner'}
                    </span>
                    <i className={`ri-arrow-down-s-line text-gray-500 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}></i>
                  </button>

                  {isDropdownOpen && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                      <div className="p-3 border-b border-gray-100">
                        <div className="relative">
                          <i className="ri-search-line absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                          <input
                            type="text"
                            placeholder="Search..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-gray-50 rounded-lg border-none text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                      </div>
                      <div className="max-h-48 overflow-y-auto">
                        {filteredItems.map((item) => (
                          <button
                            key={item.id}
                            onClick={() => {
                              setSelectedSupplierCustomer(item.id);
                              setIsDropdownOpen(false);
                              setSearchTerm('');
                            }}
                            className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors"
                          >
                            <div className="text-left">
                              <div className="text-sm font-medium text-gray-900">{item.name}</div>
                              <div className="text-xs text-gray-500 capitalize">{item.type}</div>
                            </div>
                            <div className="text-sm font-semibold text-gray-700">
                              ${item.balance.toLocaleString()}
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-center">
                  <div className="relative">
                    <button
                      onClick={() => setIsDateDropdownOpen(!isDateDropdownOpen)}
                      className="flex items-center justify-between px-6 py-2 bg-blue-50 rounded-full border border-blue-200 hover:bg-blue-100 transition-colors"
                    >
                      <i className="ri-calendar-line text-blue-600 mr-2"></i>
                      <span className="text-sm text-blue-700 font-medium">
                        {dateRangeOptions.find(option => option.value === selectedDateRange)?.label}
                      </span>
                      <i className={`ri-arrow-down-s-line text-blue-600 transition-transform ml-2 ${isDateDropdownOpen ? 'rotate-180' : ''}`}></i>
                    </button>

                    {isDateDropdownOpen && (
                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-1 bg-white rounded-lg shadow-lg border border-gray-200 z-10 min-w-[180px]">
                        {dateRangeOptions.map((option) => (
                          <button
                            key={option.value}
                            onClick={() => handleDateRangeChange(option.value)}
                            className="w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors first:rounded-t-lg last:rounded-b-lg"
                          >
                            <span className="text-sm text-gray-700">{option.label}</span>
                            {option.value === selectedDateRange && (
                              <i className="ri-check-line text-blue-500 float-right"></i>
                            )}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {isCustomDateRange && (
                <div className="flex space-x-3">
                  <div className="flex-1">
                    <label className="block text-xs text-gray-600 mb-1">From Date</label>
                    <input
                      type="date"
                      value={fromDate}
                      onChange={(e) => setFromDate(e.target.value)}
                      className="w-full px-3 py-2 bg-gray-50 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-xs text-gray-600 mb-1">To Date</label>
                    <input
                      type="date"
                      value={toDate}
                      onChange={(e) => setToDate(e.target.value)}
                      className="w-full px-3 py-2 bg-gray-50 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              )}

              {selectedItem && businessPartnerData && (
                <div className="grid grid-cols-2 gap-3">
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <div className="text-xl font-bold text-blue-600">{businessPartnerData.purchases}</div>
                    <div className="text-xs text-gray-600 mt-1">
                      {selectedItem.type === 'supplier' ? 'Purchases' : 'Orders Received'}
                    </div>
                  </div>
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <div className="text-xl font-bold text-green-600">{businessPartnerData.sales}</div>
                    <div className="text-xs text-gray-600 mt-1">
                      {selectedItem.type === 'customer' ? 'Sales' : 'Orders Placed'}
                    </div>
                  </div>
                  <div className="text-center p-3 bg-purple-50 rounded-lg">
                    <div className="text-xl font-bold text-purple-600">${businessPartnerData.totalAmount.toLocaleString()}</div>
                    <div className="text-xs text-gray-600 mt-1">Total Amount</div>
                  </div>
                  <div className="text-center p-3 bg-orange-50 rounded-lg">
                    <div className="text-xl font-bold text-orange-600">${businessPartnerData.outstandingAmount.toLocaleString()}</div>
                    <div className="text-xs text-gray-600 mt-1">Outstanding Amount</div>
                  </div>
                  <div className="text-center p-3 bg-indigo-50 rounded-lg">
                    <div className="text-xl font-bold text-indigo-600">${businessPartnerData.averageOrderValue.toLocaleString()}</div>
                    <div className="text-xs text-gray-600 mt-1">Average Order Value</div>
                  </div>
                  <div className="text-center p-3 bg-red-50 rounded-lg">
                    <div className="text-xl font-bold text-red-600">{businessPartnerData.lastTransactionDays} days</div>
                    <div className="text-xs text-gray-600 mt-1">Last Transaction</div>
                  </div>
                </div>
              )}

              {!selectedItem && (
                <div className="text-center py-8 text-gray-500">
                  <i className="ri-user-search-line text-4xl mb-2"></i>
                  <p className="text-sm">Select a business partner to view detailed overview</p>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Activity Center</h2>
              <button className="text-blue-600 text-sm font-medium">View All</button>
            </div>
            <div className="space-y-3">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    activity.type === 'upload' ? 'bg-blue-100' :
                    activity.type === 'approval' ? 'bg-green-100' :
                    'bg-purple-100'
                  }`}>
                    <i className={`${
                      activity.type === 'upload' ? 'ri-upload-2-line text-blue-600' :
                      activity.type === 'approval' ? 'ri-check-line text-green-600' :
                      'ri-book-open-line text-purple-600'
                    } text-sm`}></i>
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-900">{activity.title}</div>
                    <div className="text-xs text-gray-500">{activity.time}</div>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    activity.status === 'completed' ? 'bg-green-100 text-green-800' :
                    activity.status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {activity.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
      <TabBar />
    </>
  );
}