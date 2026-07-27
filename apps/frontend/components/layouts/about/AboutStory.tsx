import Image from 'next/image';
import { HeartHandshake, ShieldCheck, Target } from 'lucide-react';

const AboutStory = () => {
  return (
    <section className='bg-slate-50 py-20 sm:py-28'>
      <div className='mx-auto max-w-7xl px-5 sm:px-6 lg:px-8'>
        <div className='grid gap-12 lg:grid-cols-2 lg:items-center'>
          {/* Left Column: Text narrative */}
          <div>
            <span className='text-sm font-semibold uppercase tracking-[0.25em] text-green-600'>
              Cerita & Sejarah Kami
            </span>
            <h2 className='mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl leading-tight'>
              Berawal dari Kepedulian, Bertumbuh Menjadi Gerakan Nyata
            </h2>
            <p className='mt-6 text-base leading-8 text-slate-600 sm:text-lg'>
              Pena Hijau didirikan atas kesadaran pentingnya peran pemuda dalam merawat ekosistem dan bumi kita. Dimulai dari diskusi komunitas kecil dan aksi pembersihan lingkungan lokal, kami melihat betapa tingginya semangat masyarakat jika diberi wadah yang tepat.
            </p>
            <p className='mt-4 text-base leading-8 text-slate-600 sm:text-lg'>
              Nama <strong className='text-green-700 font-semibold'>Pena Hijau</strong> menyimbolkan tekad untuk mengedukasi (Pena) serta mewujudkan lingkungan yang asri dan lestari (Hijau). Kami percaya bahwa edukasi dan aksi fisik harus berjalan berdampingan demi menciptakan dampak yang berkelanjutan.
            </p>

            <div className='mt-8 space-y-4'>
              <div className='flex items-start gap-4 rounded-2xl bg-white p-4 shadow-sm border border-slate-100'>
                <div className='mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-green-100 text-green-700'>
                  <Target className='h-5 w-5' />
                </div>
                <div>
                  <h4 className='font-bold text-slate-900'>Fokus Berkelanjutan</h4>
                  <p className='mt-1 text-sm text-slate-600'>Program dirancang bukan sekadar acara sekali selesai, melainkan memiliki pendampingan berkala.</p>
                </div>
              </div>

              <div className='flex items-start gap-4 rounded-2xl bg-white p-4 shadow-sm border border-slate-100'>
                <div className='mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-green-100 text-green-700'>
                  <HeartHandshake className='h-5 w-5' />
                </div>
                <div>
                  <h4 className='font-bold text-slate-900'>Pendekatan Inklusif</h4>
                  <p className='mt-1 text-sm text-slate-600'>Merangkul pelajar, mahasiswa, masyarakat lokal, dan pemerintah daerah untuk bertindak bersama.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Visual Graphic & Images */}
          <div className='relative'>
            <div className='relative mx-auto max-w-md lg:max-w-none'>
              <div className='overflow-hidden rounded-3xl bg-slate-200 shadow-2xl shadow-slate-900/10 ring-1 ring-slate-900/5 aspect-4/3 relative'>
                <Image
                  src='/gallery/sungai-kotaanyar-2026/sungai-karanganyar-6.webp'
                  alt='Kegiatan Penghijauan Pena Hijau'
                  fill
                  sizes='(max-width: 1024px) 100vw, 50vw'
                  className='object-cover'
                />
                <div className='absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent' />
                <div className='absolute bottom-4 left-4 right-4 rounded-2xl bg-white/90 p-4 backdrop-blur border border-white/40'>
                  <div className='flex items-center gap-3'>
                    <div className='flex h-10 w-10 items-center justify-center rounded-full bg-green-600 text-white'>
                      <ShieldCheck className='h-5 w-5' />
                    </div>
                    <div>
                      <p className='text-xs font-semibold text-slate-500 uppercase tracking-wider'>Komitmen Kami</p>
                      <p className='text-sm font-bold text-slate-900'>Lingkungan Bersih untuk Generasi Mendatang</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating secondary badge image */}
              <div className='hidden sm:block absolute -bottom-8 -left-8 overflow-hidden rounded-2xl border-4 border-white bg-white shadow-xl aspect-square w-44'>
                <Image
                  src='/gallery/sungai-kotaanyar-2026/sungai-karanganyar-4.webp'
                  alt='Aksi Relawan'
                  fill
                  sizes='176px'
                  className='object-cover'
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutStory;
