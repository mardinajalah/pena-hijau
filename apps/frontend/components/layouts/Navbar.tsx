'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { useEffect, useState } from 'react';

const navigation = [
  {
    id: 1,
    name: 'Beranda',
    href: '/',
  },
  {
    id: 2,
    name: 'Tentang Kami',
    href: '/about',
  },
  {
    id: 3,
    name: 'Galeri',
    href: '/gallery',
  },
  {
    id: 4,
    name: 'Anggota',
    href: '#',
  },
  {
    id: 5,
    name: 'Gabung',
    href: '#',
  },
];

const Navbar = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    let lastScrollY = window.scrollY;
    let ticking = false;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const scrollDifference = Math.abs(currentScrollY - lastScrollY);

      if (scrollDifference < 10) {
        return;
      }

      if (!ticking) {
        window.requestAnimationFrame(() => {
          if (currentScrollY <= 0) {
            setIsVisible(true);
          } else {
            setIsVisible(currentScrollY < lastScrollY);
          }

          lastScrollY = currentScrollY;
          ticking = false;
        });

        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? 'hidden' : '';

    return () => {
      document.body.style.overflow = '';
    };
  }, [isMenuOpen]);

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <>
      <nav className={`fixed top-0 z-50 w-full bg-white/95 shadow backdrop-blur transition-transform duration-500 ease-out will-change-transform ${isVisible ? 'translate-y-0' : '-translate-y-full'}`}>
        <div className='mx-auto flex h-20 max-w-7xl items-center justify-between px-5 sm:px-6 lg:px-8'>
          {/* logo */}
          <Image
            src='/logo.webp'
            alt='Logo Pena Hijau'
            width={64}
            height={64}
            className='h-14 w-14 object-contain'
          />

          {/* navigation */}
          <ul className='hidden items-center gap-8 text-sm font-medium text-slate-700 md:flex lg:gap-10'>
            {navigation.map((nav) => (
              <li key={nav.id}>
                <Link
                  className='transition-colors hover:text-green-600'
                  href={nav.href}
                >
                  {nav.name}
                </Link>
              </li>
            ))}
          </ul>

          <div className='flex items-center gap-3'>
            {/* button donasi */}
            <Link
              className='hidden rounded-full bg-green-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-green-700 sm:inline-flex'
              href='#'
            >
              Donasi
            </Link>

            <button
              type='button'
              onClick={() => setIsMenuOpen(true)}
              aria-label='Buka menu navigasi'
              aria-expanded={isMenuOpen}
              className='inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 text-slate-700 transition-colors hover:border-green-600 hover:text-green-600 md:hidden'
            >
              <Menu aria-hidden='true' />
            </button>
          </div>
        </div>
      </nav>

      <div
        className={`fixed inset-0 z-60 bg-slate-950/40 backdrop-blur-sm transition-opacity duration-300 md:hidden ${isMenuOpen ? 'opacity-100' : 'pointer-events-none opacity-0'}`}
        onClick={closeMenu}
        aria-hidden='true'
      />

      <aside
        className={`fixed right-0 top-0 z-70 flex h-svh w-[82%] max-w-sm flex-col bg-white px-6 py-6 shadow-2xl shadow-slate-950/20 transition-transform duration-500 ease-out md:hidden ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}
        aria-hidden={!isMenuOpen}
      >
        <div className='flex items-center justify-between'>
          <Link
            href='#'
            className='flex items-center gap-3'
            onClick={closeMenu}
          >
            <Image
              src='/logo.webp'
              alt='Logo Pena Hijau'
              width={56}
              height={56}
              className='h-12 w-12 object-contain'
            />
            <span className='text-lg font-bold text-slate-900'>Pena Hijau</span>
          </Link>

          <button
            type='button'
            onClick={closeMenu}
            aria-label='Tutup menu navigasi'
            className='inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 text-slate-700 transition-colors hover:border-green-600 hover:text-green-600'
          >
            <X aria-hidden='true' />
          </button>
        </div>

        <ul className='mt-10 space-y-2 text-base font-semibold text-slate-700'>
          {navigation.map((nav) => (
            <li key={nav.id}>
              <Link
                className='block rounded-2xl px-4 py-3 transition-colors hover:bg-green-50 hover:text-green-600'
                href={nav.href}
                onClick={closeMenu}
              >
                {nav.name}
              </Link>
            </li>
          ))}
        </ul>

        <Link
          className='mt-8 inline-flex justify-center rounded-full bg-green-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-green-700'
          href='#'
          onClick={closeMenu}
        >
          Donasi
        </Link>
      </aside>
    </>
  );
};

export default Navbar;
