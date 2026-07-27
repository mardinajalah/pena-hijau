import Image from 'next/image';
import { ArrowUpRight } from 'lucide-react';

const pillars = [
  {
    id: 1,
    title: 'Penghijauan & Reforestasi',
    subtitle: 'Penanaman Pohon Produktif',
    description: 'Menanam ribuan bibit pohon di area kritis dan lahan terbuka desa untuk menyerap karbon dan memulihkan ekosistem.',
    image: '/gallery/foto3.webp',
    tag: 'Penghijauan',
  },
  {
    id: 2,
    title: 'Aksi Bersih Lingkungan',
    subtitle: 'Clean-Up Day & River Guard',
    description: 'Aksi kolaboratif membersihkan limbah plastik dan sampah di pesisir, aliran sungai, dan fasilitas umum.',
    image: '/gallery/foto4.webp',
    tag: 'Aksi Bersih',
  },
  {
    id: 3,
    title: 'Edukasi & Workshop Hijau',
    subtitle: 'Goes to School & Community',
    description: 'Sosialisasi pengolahan sampah mandiri, pembuatan kompost, serta gaya hidup minim sampah (zero waste).',
    image: '/gallery/foto6.webp',
    tag: 'Edukasi',
  },
];

const AboutPillars = () => {
  return (
    <section className='bg-slate-50 py-20 sm:py-24'>
      <div className='mx-auto max-w-7xl px-5 sm:px-6 lg:px-8'>
        <div className='mx-auto max-w-3xl text-center'>
          <p className='text-sm font-semibold uppercase tracking-[0.25em] text-green-600'>
            Pilar Gerakan
          </p>
          <h2 className='mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl'>
            Fokus Utama Program Pena Hijau
          </h2>
          <p className='mt-4 text-base leading-8 text-slate-600 sm:text-lg'>
            Kami berfokus pada tiga pilar utama yang saling melengkapi untuk mencapai perubahan dampak ekologis yang luas.
          </p>
        </div>

        <div className='mt-16 grid gap-8 md:grid-cols-3'>
          {pillars.map((item) => (
            <article
              key={item.id}
              className='group flex flex-col overflow-hidden rounded-3xl bg-white shadow-md transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-green-900/10'
            >
              <div className='relative h-60 w-full overflow-hidden bg-slate-100'>
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  sizes='(max-width: 768px) 100vw, 33vw'
                  className='object-cover transition-transform duration-500 group-hover:scale-105'
                />
                <div className='absolute top-4 left-4'>
                  <span className='rounded-full bg-emerald-950/80 px-3.5 py-1.5 text-xs font-semibold text-emerald-100 backdrop-blur border border-white/20'>
                    {item.tag}
                  </span>
                </div>
              </div>

              <div className='flex flex-1 flex-col p-6 sm:p-8'>
                <p className='text-xs font-bold uppercase tracking-wider text-green-600'>
                  {item.subtitle}
                </p>
                <h3 className='mt-2 text-xl font-bold text-slate-900 group-hover:text-green-700 transition-colors'>
                  {item.title}
                </h3>
                <p className='mt-3 flex-1 text-sm leading-7 text-slate-600'>
                  {item.description}
                </p>

                <div className='mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-sm font-semibold text-green-600 group-hover:text-green-700'>
                  <span>Pelajari Selengkapnya</span>
                  <ArrowUpRight className='h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5' />
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutPillars;
