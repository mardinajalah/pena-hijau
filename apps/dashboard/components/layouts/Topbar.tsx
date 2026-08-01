'use client';

import { Bell, Search, Globe, LogOut } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface TopbarProps {
  title?: string;
  breadcrumb?: string;
}

const Topbar = ({ title = 'Dashboard Overview', breadcrumb = 'Ringkasan Utama' }: TopbarProps) => {
  const router = useRouter();

  const handleLogout = () => {
    if (confirm('Apakah Anda yakin ingin keluar dari Dashboard Admin?')) {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('adminUser');
      router.push('/login');
    }
  };

  return (
    <header className='sticky top-0 z-30 flex h-20 w-full items-center justify-between bg-white/90 px-6 sm:px-8 shadow-xs backdrop-blur-md border-b border-slate-200/80'>
      {/* Title & Breadcrumb */}
      <div>
        <div className='flex items-center gap-2 text-xs font-semibold text-slate-500'>
          <Link href='/' className='hover:text-green-600 transition-colors'>Admin</Link>
          <span>/</span>
          <span className='text-green-600 font-bold'>{breadcrumb}</span>
        </div>
        <h1 className='text-lg sm:text-xl font-extrabold text-slate-900 mt-0.5 tracking-tight'>
          {title}
        </h1>
      </div>

      {/* Right Controls */}
      <div className='flex items-center gap-3 sm:gap-4'>
        {/* Search Bar Input (UI Only) */}
        <div className='relative hidden sm:block w-56 lg:w-72'>
          <Search className='absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400' />
          <input
            type='text'
            placeholder='Cari data relawan, galeri...'
            className='w-full rounded-2xl border border-slate-200 bg-slate-50 py-2 pl-9 pr-4 text-xs font-medium text-slate-800 placeholder-slate-400 focus:border-green-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-green-600/20 transition-all'
          />
        </div>

        {/* View Frontend Site Link */}
        <a
          href='http://localhost:3000'
          target='_blank'
          rel='noopener noreferrer'
          className='inline-flex items-center gap-2 rounded-2xl bg-emerald-50 px-3.5 py-2 text-xs font-bold text-emerald-700 hover:bg-emerald-100 transition-colors border border-emerald-200/60'
          title='Lihat Tampilan Website Frontend'
        >
          <Globe className='h-3.5 w-3.5 text-green-600' />
          <span className='hidden md:inline'>Lihat Web Frontend</span>
        </a>

        {/* Notification Bell Badge */}
        <button
          type='button'
          className='relative flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors cursor-pointer'
          title='Notifikasi Admin'
        >
          <Bell className='h-4 w-4' />
          <span className='absolute top-2 right-2 h-2 w-2 rounded-full bg-green-500 ring-2 ring-white' />
        </button>

        {/* Admin Profile & Logout Button */}
        <div className='flex items-center gap-3 pl-3 border-l border-slate-200'>
          <div className='flex items-center gap-2.5'>
            <div className='flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-tr from-green-600 to-emerald-700 text-white font-extrabold text-xs shadow-sm'>
              AD
            </div>
            <div className='hidden xl:block text-left text-xs'>
              <p className='font-bold text-slate-900 leading-tight'>Admin Pena Hijau</p>
              <p className='text-[10px] text-slate-500'>admin@penahijau.org</p>
            </div>
          </div>

          <button
            type='button'
            onClick={handleLogout}
            className='flex h-9 w-9 items-center justify-center rounded-xl bg-red-50 text-red-600 hover:bg-red-600 hover:text-white transition-colors cursor-pointer'
            title='Keluar / Logout'
          >
            <LogOut className='h-4 w-4' />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Topbar;
