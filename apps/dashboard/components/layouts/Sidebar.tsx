'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Images,
  Users,
  UserPlus,
  Newspaper,
  CircleUser,
  Settings,
  LogOut,
  Menu,
  X,
  ShieldCheck,
  ChevronRight,
} from 'lucide-react';

const mainNavigation = [
  {
    name: 'Dashboard',
    href: '/',
    icon: LayoutDashboard,
  },
  {
    name: 'Galeri Kegiatan',
    href: '/gallery',
    icon: Images,
  },
  {
    name: 'Anggota Relawan',
    href: '/members',
    icon: Users,
  },
  {
    name: 'Permintaan Gabung',
    href: '/join-requests',
    icon: UserPlus,
    badge: 'Baru',
  },
  {
    name: 'Artikel & Pilar',
    href: '/articles',
    icon: Newspaper,
  },
];

const secondaryNavigation = [
  {
    name: 'Profil Admin',
    href: '#',
    icon: CircleUser,
  },
  {
    name: 'Pengaturan Sistem',
    href: '#',
    icon: Settings,
  },
];

const Sidebar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const handleLogout = () => {
    if (confirm('Apakah Anda yakin ingin keluar dari Dashboard Admin?')) {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('adminUser');
      router.push('/login');
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileOpen((prev) => !prev);
  };

  const closeMobileMenu = () => {
    setIsMobileOpen(false);
  };

  return (
    <>
      {/* Mobile Header Bar (Screen < md) */}
      <div className='fixed top-0 left-0 right-0 z-40 flex h-16 items-center justify-between bg-emerald-950 px-4 text-white shadow-md md:hidden border-b border-emerald-900/60'>
        <Link href='/' className='flex items-center gap-3' onClick={closeMobileMenu}>
          <Image
            src='/logo.webp'
            alt='Logo Pena Hijau'
            width={40}
            height={40}
            className='h-9 w-9 object-contain bg-white rounded-full p-0.5'
          />
          <div>
            <span className='text-base font-extrabold tracking-wide text-white'>Pena Hijau</span>
            <span className='block text-[10px] text-emerald-400 font-semibold uppercase tracking-wider'>Admin Panel</span>
          </div>
        </Link>

        <button
          type='button'
          onClick={toggleMobileMenu}
          aria-label='Toggle menu sidebar'
          className='inline-flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-900/80 text-emerald-100 transition-colors hover:bg-green-600 hover:text-white cursor-pointer border border-emerald-800'
        >
          {isMobileOpen ? <X className='h-5 w-5' /> : <Menu className='h-5 w-5' />}
        </button>
      </div>

      {/* Desktop Sidebar (md:flex) & Mobile Backdrop */}
      {isMobileOpen && (
        <div
          className='fixed inset-0 z-40 bg-slate-950/80 backdrop-blur-xs md:hidden'
          onClick={closeMobileMenu}
        />
      )}

      <aside
        className={`fixed top-0 left-0 z-50 flex h-full w-64 flex-col justify-between bg-emerald-950 text-white transition-transform duration-300 ease-in-out md:translate-x-0 ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Top Section */}
        <div className='flex flex-col gap-6 p-5 overflow-y-auto scrollbar-none'>
          {/* Logo Brand Header */}
          <div className='flex items-center justify-between border-b border-emerald-900/70 pb-4'>
            <Link href='/' className='flex items-center gap-3' onClick={closeMobileMenu}>
              <div className='relative flex h-11 w-11 items-center justify-center rounded-2xl bg-white p-1 shadow-md'>
                <Image
                  src='/logo.webp'
                  alt='Logo Pena Hijau'
                  width={44}
                  height={44}
                  className='h-9 w-9 object-contain'
                  priority
                />
              </div>
              <div>
                <span className='text-lg font-extrabold tracking-wide text-white'>Pena Hijau</span>
                <span className='block text-[10px] text-emerald-400 font-semibold uppercase tracking-wider'>
                  Admin Panel v1.0
                </span>
              </div>
            </Link>

            <button
              type='button'
              onClick={closeMobileMenu}
              className='rounded-lg p-1 text-emerald-400 hover:bg-emerald-900 hover:text-white md:hidden'
            >
              <X className='h-5 w-5' />
            </button>
          </div>

          {/* Navigation Menu */}
          <div>
            <p className='px-3 text-[10px] font-extrabold uppercase tracking-widest text-emerald-400/90 mb-3'>
              Menu Utama
            </p>
            <nav className='space-y-1.5'>
              {mainNavigation.map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;

                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={closeMobileMenu}
                    className={`group flex items-center justify-between px-3.5 py-3 text-sm font-semibold transition-all duration-200 cursor-pointer ${
                      isActive
                        ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-2xl shadow-lg shadow-green-900/40'
                        : 'text-emerald-100/80 hover:bg-emerald-900/60 hover:text-white rounded-2xl'
                    }`}
                  >
                    <div className='flex items-center gap-3'>
                      <Icon className={`h-5 w-5 shrink-0 ${isActive ? 'text-white' : 'text-emerald-400 group-hover:text-white'}`} />
                      <span>{item.name}</span>
                    </div>

                    {item.badge && (
                      <span className='rounded-full bg-green-500/20 px-2 py-0.5 text-[10px] font-bold text-green-300 border border-green-500/30'>
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Secondary Section */}
          <div className='pt-4 border-t border-emerald-900/60'>
            <p className='px-3 text-[10px] font-extrabold uppercase tracking-widest text-emerald-400/90 mb-3'>
              Pengaturan
            </p>
            <nav className='space-y-1.5'>
              {secondaryNavigation.map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;

                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={closeMobileMenu}
                    className={`group flex items-center justify-between px-3.5 py-2.5 text-sm font-semibold transition-all duration-200 cursor-pointer ${
                      isActive
                        ? 'bg-green-600 text-white rounded-2xl shadow-md'
                        : 'text-emerald-100/70 hover:bg-emerald-900/50 hover:text-white rounded-2xl'
                    }`}
                  >
                    <div className='flex items-center gap-3'>
                      <Icon className='h-4 w-4 shrink-0 text-emerald-400 group-hover:text-white' />
                      <span>{item.name}</span>
                    </div>
                    <ChevronRight className='h-3.5 w-3.5 opacity-40 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all' />
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Sidebar Footer User Info & Logout */}
        <div className='p-4 border-t border-emerald-900/70 bg-emerald-950/90'>
          <div className='flex items-center justify-between rounded-2xl bg-emerald-900/50 p-3 border border-emerald-800/60'>
            <div className='flex items-center gap-3 overflow-hidden'>
              <div className='flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-green-600 text-white shadow-md font-bold text-sm'>
                AD
              </div>
              <div className='min-w-0 flex-1'>
                <p className='truncate text-xs font-bold text-white'>Admin Pena Hijau</p>
                <div className='flex items-center gap-1 text-[10px] text-emerald-300 font-medium'>
                  <ShieldCheck className='h-3 w-3 text-green-400' />
                  <span className='truncate'>Super Admin</span>
                </div>
              </div>
            </div>

            <button
              type='button'
              title='Keluar Admin'
              onClick={handleLogout}
              className='ml-2 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-emerald-300 transition-colors hover:bg-red-500/20 hover:text-red-300 cursor-pointer'
            >
              <LogOut className='h-4 w-4' />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;