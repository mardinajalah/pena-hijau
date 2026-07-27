import Image from 'next/image';
import { Montserrat } from 'next/font/google';
import Link from 'next/link';
import { ArrowRight, Leaf, HeartHandshake, Sparkles, ShieldCheck } from 'lucide-react';

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['700', '800'],
});

const HeroSection = () => {
  return (
    <section className='relative flex min-h-svh w-full items-center overflow-hidden pt-32 sm:pt-36 lg:pt-40 pb-20 sm:pb-24'>
      {/* Background Image */}
      <Image
        src='/bannerHeroSection.webp'
        alt='Hero Pena Hijau'
        fill
        className='object-cover object-center scale-105 transition-transform duration-1000'
        priority
      />

      {/* Modern Gradient Overlays */}
      <div className='absolute inset-0 bg-linear-to-r from-emerald-950/95 via-emerald-950/80 to-slate-950/60' />
      <div className='absolute inset-0 bg-linear-to-t from-emerald-950/90 via-transparent to-black/40' />

      {/* Decorative Glows */}
      <div className='pointer-events-none absolute -left-20 top-1/4 h-96 w-96 rounded-full bg-green-500/20 blur-3xl' />
      <div className='pointer-events-none absolute right-0 bottom-10 h-96 w-96 rounded-full bg-emerald-400/15 blur-3xl' />

      <div className='relative mx-auto w-full max-w-7xl px-5 sm:px-6 lg:px-8 z-10'>
        <div className='grid gap-12 lg:grid-cols-12 lg:items-center'>
          {/* Left Column: Hero Text */}
          <div className='lg:col-span-7 max-w-2xl'>
            <div className='mb-6 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs sm:text-sm font-semibold uppercase tracking-[0.2em] text-emerald-300 backdrop-blur-md border border-white/15'>
              <Leaf className='h-4 w-4 text-green-400' />
              <span>Gerakan Pemuda Nusantara</span>
            </div>

            <h1
              className={`${montserrat.className} text-4xl sm:text-6xl lg:text-7xl font-extrabold uppercase leading-[1.1] text-white tracking-tight`}
              style={{
                textShadow: '0 4px 24px rgba(0,0,0,0.6)',
              }}
            >
              Ayo Gabung <span className='text-transparent bg-clip-text bg-linear-to-r from-green-400 via-emerald-300 to-teal-200'>Bersama Kami</span>
            </h1>

            <p className='mt-6 text-base sm:text-xl leading-relaxed text-emerald-100/90 font-normal max-w-xl'>
              Bergerak bersama menjaga lingkungan, menghijaukan bumi Nusantara, dan membangun kebiasaan peduli alam untuk masa depan yang lebih baik.
            </p>

            {/* Action Buttons */}
            <div className='mt-8 flex flex-wrap items-center gap-4 sm:gap-5'>
              <Link
                href='/about'
                className='group inline-flex items-center gap-3 rounded-full bg-green-600 px-7 py-3.5 text-sm sm:text-base font-bold text-white shadow-lg shadow-green-900/40 transition-all duration-300 hover:bg-green-500 hover:scale-105'
              >
                <span>Pelajari Program Kami</span>
                <ArrowRight className='h-5 w-5 transition-transform group-hover:translate-x-1' />
              </Link>

              <Link
                href='#'
                className='inline-flex items-center gap-2.5 rounded-full bg-white/10 px-7 py-3.5 text-sm sm:text-base font-bold text-white border border-white/20 backdrop-blur-md transition-all duration-300 hover:bg-white/20'
              >
                <HeartHandshake className='h-5 w-5 text-emerald-300' />
                <span>Donasi & Gabung</span>
              </Link>
            </div>

            {/* Micro badges below CTA */}
            <div className='mt-10 flex items-center gap-6 pt-6 border-t border-white/10 text-xs sm:text-sm text-emerald-200/80'>
              <div className='flex items-center gap-2'>
                <ShieldCheck className='h-4 w-4 text-green-400' />
                <span>Gerakan Terpercaya</span>
              </div>
              <div className='flex items-center gap-2'>
                <Sparkles className='h-4 w-4 text-emerald-400' />
                <span>1.200+ Relawan</span>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Visual Card */}
          <div className='lg:col-span-5 hidden lg:block'>
            <div className='relative rounded-3xl border border-white/15 bg-white/10 p-6 backdrop-blur-xl shadow-2xl shadow-emerald-950/50'>
              <div className='relative h-80 w-full overflow-hidden rounded-2xl'>
                <Image
                  src='/gallery/sungai-kotaanyar-2026/sungai-karanganyar-2.webp'
                  alt='Aksi Pena Hijau'
                  fill
                  sizes='400px'
                  className='object-cover'
                />
                <div className='absolute inset-0 bg-linear-to-t from-slate-950/80 via-transparent to-transparent' />
                <div className='absolute bottom-4 left-4 right-4 text-white'>
                  <span className='rounded-full bg-green-600 px-3 py-1 text-xs font-semibold uppercase tracking-wider'>
                    Aksi Clean-Up river
                  </span>
                  <h3 className='mt-2 text-lg font-bold'>Aksi Bersih Sampah Sungai</h3>
                  <p className='text-xs text-slate-200/90 mt-1'>Desa Kotaanyar • 2026</p>
                </div>
              </div>

              {/* Floating Stat Widget */}
              <div className='mt-4 flex items-center justify-between rounded-xl bg-emerald-900/60 p-4 border border-emerald-700/50 text-white'>
                <div>
                  <p className='text-xs text-emerald-200'>Total Sungai Yang Dibersihkan</p>
                  <p className='text-2xl font-extrabold text-green-400'>1 Sungai</p>
                </div>
                <div className='flex -space-x-2 overflow-hidden'>
                  <Image src='/profile.webp' alt='Avatar 1' width={36} height={36} className='inline-block h-9 w-9 rounded-full ring-2 ring-emerald-500 object-cover' />
                  <Image src='/profile.webp' alt='Avatar 2' width={36} height={36} className='inline-block h-9 w-9 rounded-full ring-2 ring-emerald-500 object-cover' />
                  <Image src='/profile.webp' alt='Avatar 3' width={36} height={36} className='inline-block h-9 w-9 rounded-full ring-2 ring-emerald-500 object-cover' />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
