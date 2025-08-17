
'use client';

import Link from 'next/link';

interface QuickActionCardProps {
  href: string;
  icon: string;
  title: string;
  description: string;
  color: string;
}

export default function QuickActionCard({ href, icon, title, description, color }: QuickActionCardProps) {
  return (
    <Link href={href} className="block">
      <div className={`p-3 rounded-xl ${color} hover:shadow-md transition-all h-20`}>
        <div className="flex flex-col items-center text-center space-y-1">
          <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
            <i className={`${icon} text-lg text-white`}></i>
          </div>
          <div>
            <h3 className="font-semibold text-white text-xs leading-tight">{title}</h3>
            <p className="text-white/80 text-xs leading-tight">{description}</p>
          </div>
        </div>
      </div>
    </Link>
  );
}
