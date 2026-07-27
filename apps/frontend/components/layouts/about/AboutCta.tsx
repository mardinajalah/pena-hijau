import Link from 'next/link';
import { ArrowRight, Heart } from 'lucide-react';

const AboutCta = () => {
  return (
    <section className='relative overflow-hidden bg-emerald-950 py-20 sm:py-28 text-white'>
      {/* Decorative shapes */}
      <div className='pointer-events-none absolute inset-0 overflow-hidden opacity-25'>
        <div className='absolute -left-20 -top-20 h-96 w-96 rounded-full bg-green-500 blur-3xl' />
        <div className='absolute -right-20 -bottom-20 h-96 w-96 rounded-full bg-emerald-400 blur-3xl' />
      </div>

      <div className='relative mx-auto max-w-5xl px-5 text-center sm:px-6 lg:px-8'>
        <span className='inline-flex items-center gap-2 rounded-full bg-emerald-800/60 px-4 py-2 text-xs sm:text-sm font-semibold uppercase tracking-[0.2em] text-emerald-200 backdrop-blur border border-emerald-700/50'>
          <Heart className='h-4 w-4 text-emerald-400' />
          Mari Berperan Aktif
        </span>

        <h2 className='mt-6 text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl leading-tight'>
          Siap Menjadi Bagian dari Perubahan Hijau?
        </h2>

        <p className='mx-auto mt-6 max-w-2xl text-base sm:text-lg leading-8 text-emerald-100/90'>
          Apakah Anda ingin menjadi relawan aksi bersih, berkolaborasi dalam edukasi lingkungan, atau mendukung program bibit pohon? Pintu kami selalu terbuka untuk Anda.
        </p>

        <div className='mt-10 flex flex-wrap items-center justify-center gap-4'>
          <Link
            href='#'
            className='inline-flex items-center gap-2.5 rounded-full bg-green-600 px-7 py-3.5 text-sm sm:text-base font-bold text-white shadow-lg shadow-green-900/40 transition-all duration-300 hover:bg-green-500 hover:scale-105'
          >
            <span>Bergabung Sekarang</span>
            <ArrowRight className='h-5 w-5' />
          </Link>

          <Link
            href='#'
            className='inline-flex items-center gap-2 rounded-full bg-white/10 px-7 py-3.5 text-sm sm:text-base font-bold text-white border border-white/20 backdrop-blur transition-all duration-300 hover:bg-white/20'
          >
            Dukung Lewat Donasi
          </Link>
        </div>
      </div>
    </section>
  );
};

export default AboutCta;
