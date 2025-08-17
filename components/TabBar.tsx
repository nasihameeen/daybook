'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface TabItem {
  href: string;
  icon: string;
  label: string;
}

export default function TabBar() {
  const pathname = usePathname();

  const tabs: TabItem[] = [
    { href: '/', icon: 'ri-home-4-fill', label: 'Home' },
    { href: '/upload', icon: 'ri-upload-2-fill', label: 'Upload' },
    { href: '/files', icon: 'ri-file-list-3-fill', label: 'Files' },
    { href: '/daybook', icon: 'ri-book-open-fill', label: 'Daybook' },
    { href: '/profile', icon: 'ri-user-3-fill', label: 'Profile' }
  ];

  return (
    <div className="fixed bottom-0 w-full bg-white border-t border-gray-200 z-50">
      <div className="grid grid-cols-5 px-0">
        {tabs.map((tab) => {
          const isActive = pathname === tab.href;
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`flex flex-col items-center justify-center py-2 px-1 transition-colors ${
                isActive
                  ? 'text-blue-600 bg-blue-50'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <div className="w-6 h-6 flex items-center justify-center mb-1">
                <i className={`${tab.icon} text-lg`}></i>
              </div>
              <span className="text-xs font-medium">{tab.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}