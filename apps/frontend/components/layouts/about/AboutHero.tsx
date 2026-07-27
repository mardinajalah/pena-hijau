import Image from 'next/image';
import Link from 'next/link';
import { Montserrat } from 'next/font/google';
import { ChevronRight, Leaf } from 'lucide-react';

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['700'],
});

const AboutHero = () => {
  return (
    <section className='relative flex min-h-svh w-full items-center justify-center overflow-hidden pt-32 sm:pt-36 lg:pt-40 pb-20 sm:pb-24'>
      <Image
        src='/gallery/foto1.webp'
        alt='Tentang Pena Hijau'
        fill
        className='object-cover'
        priority
      />

      <div className='absolute inset-0 bg-gradient-to-r from-emerald-950/90 via-emerald-950/75 to-slate-900/80' />

      <div className='relative mx-auto w-full max-w-7xl px-5 sm:px-6 lg:px-8 text-center sm:text-left z-10'>
        {/* Breadcrumb */}
        <nav className='mb-6 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-xs sm:text-sm font-medium text-emerald-100 backdrop-blur-md border border-white/15'>
          <Link href='/' className='transition-colors hover:text-white'>Beranda</Link>
          <ChevronRight className='h-3.5 w-3.5 text-emerald-300' />
          <span className='text-emerald-300 font-semibold'>Tentang Kami</span>
        </nav>

        <div className='max-w-3xl'>
          <div className='mb-4 inline-flex items-center gap-2 rounded-full bg-green-500/20 px-4 py-2 text-xs sm:text-sm font-semibold uppercase tracking-[0.2em] text-green-300 border border-green-400/30 backdrop-blur'>
            <Leaf className='h-4 w-4' />
            Pena Hijau Nusantara
          </div>

          <h1
            className={`${montserrat.className} text-3xl sm:text-5xl lg:text-6xl font-extrabold uppercase leading-tight text-white`}
            style={{
              textShadow: '0 4px 20px rgba(0,0,0,0.5)',
            }}
          >
            Membangun Kepedulian, Menjaga Bumi Nusantara
          </h1>

          <p className='mt-6 max-w-2xl text-base sm:text-lg leading-8 text-emerald-100/90'>
            Pena Hijau lahir dari semangat generasi muda yang percaya bahwa perubahan besar berawal dari tindakan kecil yang dilakukan secara konsisten dan penuh kepedulian terhadap kelestarian alam.
          </p>
        </div>
      </div>
    </section>
  );
};

export default AboutHero;
