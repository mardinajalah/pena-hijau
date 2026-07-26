import Image from 'next/image';
import { Montserrat } from 'next/font/google';

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['700'], // Bold
});

const HeroSection = () => {
  return (
    <section className='relative flex min-h-svh w-full items-center overflow-hidden'>
      <Image
        src='/hero.jpg'
        alt='Hero Image'
        fill
        className='object-cover'
        priority
      />

      <div className='absolute inset-0 bg-linear-to-r from-black/70 via-black/35 to-transparent' />

      <div className='relative mx-auto w-full max-w-7xl px-5 py-24 sm:px-6 lg:px-8'>
        <div className='max-w-2xl'>
          <p className='mb-4 inline-flex rounded-full bg-white/15 px-4 py-2 text-sm font-semibold uppercase tracking-[0.2em] text-white backdrop-blur'>
            Pena Hijau
          </p>
          <h1
            className={`${montserrat.className} text-4xl font-bold uppercase leading-tight text-white sm:text-5xl lg:text-6xl`}
            style={{
              textShadow: '4px 4px 20px rgba(0,0,0,0.75)',
            }}
          >
            Ayo Gabung Bersama Kami
          </h1>
          <p className='mt-5 max-w-xl text-base leading-8 text-white/90 sm:text-lg'>
            Bergerak bersama menjaga lingkungan dan membangun kebiasaan hijau
            untuk masa depan yang lebih baik.
          </p>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
