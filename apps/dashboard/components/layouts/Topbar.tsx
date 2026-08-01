'use client';

import { Bell, Search, Globe, Sparkles } from 'lucide-react';
import Link from 'next/link';

interface TopbarProps {
  title?: string;
  breadcrumb?: string;
}

const Topbar = ({ title = 'Dashboard Overview', breadcrumb = 'Ringkasan Utama' }: TopbarProps) => {
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
          className='relative flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-100 text-slate-700 hover:bg-green-50 hover:text-green-600 transition-colors cursor-pointer border border-slate-200/60'
          title='Notifikasi Baru'
          onClick={() => alert('Belum ada notifikasi baru')}
        >
          <Bell className='h-4 w-4' />
          <span className='absolute top-2 right-2 flex h-2 w-2'>
            <span className='absolute inline-flex h-full w-full animate-ping rounded-full bg-green-500 opacity-75' />
            <span className='relative inline-flex h-2 w-2 rounded-full bg-green-600' />
          </span>
        </button>

        {/* Admin Quick Avatar */}
        <div className='flex items-center gap-2.5 pl-2 border-l border-slate-200'>
          <div className='flex h-9 w-9 items-center justify-center rounded-xl bg-green-600 text-white font-bold text-xs shadow-sm'>
            TR
          </div>
          <div className='hidden lg:block text-left'>
            <p className='text-xs font-bold text-slate-900 leading-tight'>Taufiqur Rohim</p>
            <p className='text-[10px] text-green-600 font-semibold flex items-center gap-1'>
              <Sparkles className='h-2.5 w-2.5' /> Admin Active
            </p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Topbar;
