
'use client';

import { useState } from 'react';

interface Company {
  id: string;
  name: string;
  logo: string;
}

interface User {
  name: string;
  role: string;
  avatar: string;
}

export default function Header() {
  const [isCompanyDropdownOpen, setIsCompanyDropdownOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [notifications] = useState(3);

  const companies: Company[] = [
    { id: '1', name: 'TechCorp Ltd', logo: 'TC' },
    { id: '2', name: 'Global Solutions', logo: 'GS' },
    { id: '3', name: 'Innovation Hub', logo: 'IH' }
  ];

  const [selectedCompany, setSelectedCompany] = useState(companies[0]);

  const currentUser: User = {
    name: 'John Smith',
    role: 'Finance Manager',
    avatar: 'JS'
  };

  return (
    <header className="fixed top-0 w-full bg-white shadow-sm border-b border-gray-100 z-50">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center space-x-3 flex-1">
          <div className="font-['Pacifico'] text-xl text-blue-600">logo</div>
          
          <div className="relative flex-1">
            <button
              onClick={() => setIsCompanyDropdownOpen(!isCompanyDropdownOpen)}
              className="flex items-center space-x-2 hover:bg-gray-50 rounded-lg px-2 py-1 transition-colors w-full"
            >
              <div className="flex-1">
                <div className="text-base font-semibold text-gray-900 text-left">{selectedCompany.name}</div>
                <div className="text-sm text-gray-600 text-left">{currentUser.name} • {currentUser.role}</div>
              </div>
              <i className={`ri-arrow-down-s-line text-gray-500 transition-transform ${isCompanyDropdownOpen ? 'rotate-180' : ''}`}></i>
            </button>

            {isCompanyDropdownOpen && (
              <div className="absolute top-full left-0 mt-1 w-64 bg-white rounded-lg shadow-lg border border-gray-200">
                {companies.map((company) => (
                  <button
                    key={company.id}
                    onClick={() => {
                      setSelectedCompany(company);
                      setIsCompanyDropdownOpen(false);
                    }}
                    className="w-full flex items-center space-x-3 px-4 py-3 hover:bg-gray-50 transition-colors first:rounded-t-lg last:rounded-b-lg"
                  >
                    <div className="w-8 h-8 bg-blue-500 rounded text-white text-sm flex items-center justify-center">
                      {company.logo}
                    </div>
                    <span className="text-sm font-medium text-gray-800">{company.name}</span>
                    {company.id === selectedCompany.id && (
                      <i className="ri-check-line text-blue-500 ml-auto"></i>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="relative">
          <button
            onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
            className="relative flex items-center space-x-2 hover:bg-gray-100 rounded-lg px-2 py-1 transition-colors"
          >
            <div className="w-8 h-8 bg-green-500 rounded-full text-white text-sm flex items-center justify-center">
              {currentUser.avatar}
            </div>
            {notifications > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                {notifications}
              </span>
            )}
          </button>

          {isProfileDropdownOpen && (
            <div className="absolute top-full right-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200">
              <button className="w-full flex items-center space-x-3 px-4 py-3 hover:bg-gray-50 transition-colors rounded-t-lg">
                <i className="ri-notification-3-line text-gray-500"></i>
                <span className="text-sm text-gray-800">Notifications</span>
                {notifications > 0 && (
                  <span className="ml-auto w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {notifications}
                  </span>
                )}
              </button>
              <button className="w-full flex items-center space-x-3 px-4 py-3 hover:bg-gray-50 transition-colors">
                <i className="ri-user-3-line text-gray-500"></i>
                <span className="text-sm text-gray-800">Profile</span>
              </button>
              <button className="w-full flex items-center space-x-3 px-4 py-3 hover:bg-gray-50 transition-colors">
                <i className="ri-settings-3-line text-gray-500"></i>
                <span className="text-sm text-gray-800">Settings</span>
              </button>
              <button className="w-full flex items-center space-x-3 px-4 py-3 hover:bg-gray-50 transition-colors rounded-b-lg">
                <i className="ri-logout-box-line text-gray-500"></i>
                <span className="text-sm text-gray-800">Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
