import Link from 'next/link';
import { ArrowRight, Leaf, HeartHandshake } from 'lucide-react';

const HomeCta = () => {
  return (
    <section className='relative overflow-hidden bg-gradient-to-br from-green-700 via-emerald-800 to-emerald-950 py-20 sm:py-24 text-white'>
      {/* Subtle Background Glows */}
      <div className='pointer-events-none absolute -right-20 -top-20 h-96 w-96 rounded-full bg-green-400/20 blur-3xl' />
      <div className='pointer-events-none absolute -left-20 -bottom-20 h-96 w-96 rounded-full bg-emerald-400/20 blur-3xl' />

      <div className='relative mx-auto max-w-7xl px-5 sm:px-6 lg:px-8 text-center'>
        <div className='inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-xs sm:text-sm font-semibold uppercase tracking-[0.2em] text-green-200 backdrop-blur border border-white/20'>
          <Leaf className='h-4 w-4 text-green-300' />
          <span>Ayo Ambil Peran</span>
        </div>

        <h2 className='mt-6 text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl leading-tight max-w-3xl mx-auto'>
          Satu Langkah Kecil Kita, Senyum Hijau untuk Masa Depan Bumi
        </h2>

        <p className='mx-auto mt-5 max-w-2xl text-base sm:text-lg leading-8 text-emerald-100/90'>
          Bergabunglah menjadi relawan Pena Hijau dalam aksi tanam pohon, edukasi desa, atau gerakan pembersihan lingkungan sekitar kita.
        </p>

        <div className='mt-10 flex flex-wrap items-center justify-center gap-4'>
          <Link
            href='#'
            className='inline-flex items-center gap-2.5 rounded-full bg-white px-7 py-3.5 text-sm sm:text-base font-bold text-emerald-900 shadow-xl transition-all duration-300 hover:bg-emerald-50 hover:scale-105'
          >
            <span>Gabung Sebagai Relawan</span>
            <ArrowRight className='h-5 w-5 text-emerald-700' />
          </Link>

          <Link
            href='/about'
            className='inline-flex items-center gap-2 rounded-full bg-emerald-950/60 px-7 py-3.5 text-sm sm:text-base font-bold text-white border border-white/20 backdrop-blur transition-all duration-300 hover:bg-emerald-950'
          >
            <HeartHandshake className='h-5 w-5 text-green-300' />
            <span>Pelajari Tentang Kami</span>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HomeCta;
