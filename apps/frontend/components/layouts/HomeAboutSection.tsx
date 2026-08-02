import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, CheckCircle2, Leaf, Shield, Award } from 'lucide-react';

const features = [
  'Edukasi pengelolaan sampah mandiri bagi warga & sekolah',
  'Penanaman pohon produktif di area kritis dan bantaran sungai',
  'Aksi bersih-bersih lingkungan (Clean-Up Day) secara rutin',
  'Pemberdayaan relawan muda berbasis komunitas lokal',
];

const HomeAboutSection = () => {
  return (
    <section className='relative bg-white py-20 sm:py-28 overflow-hidden'>
      <div className='mx-auto max-w-7xl px-5 sm:px-6 lg:px-8'>
        <div className='grid gap-12 lg:grid-cols-12 lg:items-center'>
          {/* Left Visual Column */}
          <div className='lg:col-span-6 relative'>
            <div className='relative mx-auto max-w-md lg:max-w-none'>
              <div className='relative overflow-hidden rounded-3xl bg-slate-100 shadow-2xl shadow-slate-900/10 ring-1 ring-slate-900/5 aspect-4/3'>
                <Image
                  src='bannerAboutHero.webp'
                  alt='Tentang Gerakan Pena Hijau'
                  fill
                  sizes='(max-width: 1024px) 100vw, 50vw'
                  className='object-cover'
                />
                <div className='absolute inset-0 bg-linear-to-t from-slate-950/70 via-transparent to-transparent' />
                <div className='absolute bottom-6 left-6 right-6 text-white'>
                  <div className='inline-flex items-center gap-2 rounded-full bg-green-600/90 px-3.5 py-1 text-xs font-semibold backdrop-blur'>
                    <Leaf className='h-3.5 w-3.5' />
                    <span>Pemuda Peduli Lingkungan</span>
                  </div>
                  <h4 className='mt-2 text-xl font-bold'>Aksi Nyata di Lapangan</h4>
                  <p className='text-xs text-slate-200 mt-1'>Pembersian Sampah Di Bawah Jembatan Kotaanayar</p>
                </div>
              </div>

              {/* Floating Highlight Card */}
              <div className='hidden sm:flex absolute -bottom-8 -right-6 items-center gap-4 rounded-2xl border border-green-100 bg-white p-5 shadow-xl shadow-green-950/10 max-w-xs'>
                <div className='flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-green-600 text-white'>
                  <Award className='h-6 w-6' />
                </div>
                <div>
                  <p className='text-xs font-bold uppercase tracking-wider text-green-600'>Gerakan Berdampak</p>
                  <p className='text-sm font-bold text-slate-900'>100% Berbasis Komunitas</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Text Content */}
          <div className='lg:col-span-6'>
            <span className='inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.25em] text-green-600'>
              <Shield className='h-4 w-4' />
              Mengenal Pena Hijau
            </span>

            <h2 className='mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl leading-tight'>
              Membangun Kebiasaan Hijau untuk Indonesia yang Lebih Asri
            </h2>

            <p className='mt-5 text-base leading-8 text-slate-600 sm:text-lg'>
              Pena Hijau adalah organisasi dan wadah kepemudaan yang bergerak di bidang pelestarian lingkungan hidup. Kami menggabungkan edukasi, aksi lapangan, dan kolaborasi desa untuk menciptakan ekosistem yang sehat.
            </p>

            <ul className='mt-8 space-y-3.5'>
              {features.map((feature) => (
                <li key={feature} className='flex items-start gap-3 text-slate-700 text-sm sm:text-base font-medium'>
                  <CheckCircle2 className='mt-0.5 h-5 w-5 shrink-0 text-green-600' />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            <div className='mt-10'>
              <Link
                href='/about'
                className='inline-flex items-center gap-3 rounded-full bg-slate-900 px-7 py-3.5 text-sm font-bold text-white shadow-lg transition-all duration-300 hover:bg-green-600 hover:shadow-green-900/20'
              >
                <span>Baca Selengkapnya Tentang Kami</span>
                <ArrowRight className='h-4 w-4' />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomeAboutSection;
