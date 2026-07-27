'use client';

import Image from 'next/image';
import Link from 'next/link';
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaXTwitter } from 'react-icons/fa6';
import { FiChevronUp } from 'react-icons/fi';

const siteMapLinks = ['Beranda', 'Tentang Kami', 'Visi & Misi', 'Galeri', 'Anggota', 'Gabung'];

const legalLinks = ['Kebijakan Privasi', 'Syarat & Ketentuan', 'Kontak Kami'];

const socialLinks = [
  {
    label: 'X Twitter',
    Icon: FaXTwitter,
  },
  {
    label: 'LinkedIn',
    Icon: FaLinkedinIn,
  },
  {
    label: 'Instagram',
    Icon: FaInstagram,
  },
  {
    label: 'Facebook',
    Icon: FaFacebookF,
  },
];

const Footer = () => {
  const handleBackToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <footer className='bg-emerald-950 text-emerald-50 w-full mt-auto'>
      <div className='relative px-8 py-12 sm:px-12 lg:px-16 lg:py-16'>
        <div className='pointer-events-none absolute inset-0 overflow-hidden opacity-20'>
          <div className='absolute -right-24 -top-32 h-96 w-96 rotate-45 border border-emerald-200/40' />
          <div className='absolute right-20 top-24 h-72 w-72 rotate-45 border border-emerald-200/30' />
          <div className='absolute bottom-0 right-56 h-56 w-56 rotate-45 border border-emerald-200/25' />
        </div>

        <div className='relative grid gap-12 lg:grid-cols-[1.4fr_1fr_1fr]'>
          <div>
            <Link
              href='#'
              className='inline-flex items-center gap-3'
            >
              <Image
                src='/logo.webp'
                alt='Logo Pena Hijau'
                width={64}
                height={64}
                className='h-16 w-16 rounded-full bg-white object-contain p-1'
              />
              <span className='text-2xl font-bold tracking-wide text-white'>Pena Hijau</span>
            </Link>

            <p className='mt-7 max-w-sm text-base leading-8 text-emerald-100/85'>Mengajak generasi muda dan masyarakat bergerak bersama menjaga lingkungan melalui edukasi, aksi bersih, dan penghijauan.</p>

            <div className='mt-8 flex gap-5 text-xl text-emerald-100'>
              {socialLinks.map(({ label, Icon }) => (
                <Link
                  key={label}
                  href='#'
                  aria-label={label}
                  className='transition-colors hover:text-green-400'
                >
                  <Icon aria-hidden='true' />
                </Link>
              ))}
            </div>

            <button
              type='button'
              onClick={handleBackToTop}
              className='mt-10 inline-flex items-center gap-3 border border-emerald-100/50 px-5 py-3 text-xs font-bold uppercase tracking-[0.18em] text-emerald-50 transition-colors hover:border-green-400 hover:text-green-400'
            >
              <FiChevronUp
                className='text-lg'
                aria-hidden='true'
              />
              Back To Top
            </button>
          </div>

          <div>
            <h3 className='text-sm font-bold text-white'>Site Map</h3>
            <ul className='mt-7 space-y-4 text-sm text-emerald-100/80'>
              {siteMapLinks.map((link) => (
                <li key={link}>
                  <Link
                    href='#'
                    className='transition-colors hover:text-green-400'
                  >
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className='text-sm font-bold text-white'>Legal</h3>
            <ul className='mt-7 space-y-4 text-sm text-emerald-100/80'>
              {legalLinks.map((link) => (
                <li key={link}>
                  <Link
                    href='#'
                    className='transition-colors hover:text-green-400'
                  >
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className='bg-green-600 px-6 py-3 text-center text-xs text-white/90'>Copyright &copy; 2026 Pena Hijau. All Rights Reserved.</div>
    </footer>
  );
};

export default Footer;
