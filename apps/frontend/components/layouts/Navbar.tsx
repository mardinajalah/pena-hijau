'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';

const Navbar = () => {
  const [isVisible, setIsVisible] = useState(true);

  const navigation = [
    {
      id: 1,
      name: 'Beranda',
    },
    {
      id: 2,
      name: 'Tentang Kami',
    },
    {
      id: 3,
      name: 'Galeri',
    },
    {
      id: 4,
      name: 'Anggota',
    },
    {
      id: 5,
      name: 'Gabung',
    },
  ];

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

  return (
    <nav className={`fixed top-0 z-50 w-full bg-white/95 shadow backdrop-blur transition-transform duration-500 ease-out will-change-transform ${isVisible ? 'translate-y-0' : '-translate-y-full'}`}>
      <div className='mx-auto flex h-20 max-w-7xl items-center justify-between px-5 sm:px-6 lg:px-8'>
        {/* logo */}
        <Image
          src='/logo.png'
          alt='logo.webp'
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
                href='#'
              >
                {nav.name}
              </Link>
            </li>
          ))}
        </ul>

        {/* button donasi */}
        <Link
          className='rounded-full bg-green-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-green-700'
          href='#'
        >
          Donasi
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
