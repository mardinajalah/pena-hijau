'use client';

import { usePathname } from 'next/navigation';
import Sidebar from '@/components/layouts/Sidebar';
import Topbar from '@/components/layouts/Topbar';

export default function DashboardLayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLoginPage = pathname === '/login';

  if (isLoginPage) {
    return <main className='min-h-screen bg-slate-950'>{children}</main>;
  }

  return (
    <div className='flex min-h-screen bg-slate-50'>
      {/* Sidebar Component */}
      <Sidebar />

      {/* Main Content Outer Container */}
      <div className='flex flex-1 flex-col md:pl-64 pt-16 md:pt-0 min-h-screen bg-slate-50 w-full'>
        {/* Topbar Header */}
        <Topbar />

        {/* Page Content Body */}
        <main className='flex-1'>{children}</main>
      </div>
    </div>
  );
}
