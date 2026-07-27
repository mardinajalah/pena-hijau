import Image from 'next/image';
import { Star, Quote } from 'lucide-react';

const testimonials = [
  {
    id: 1,
    name: 'Budi Santoso',
    role: 'Kepala Desa Pesisir Hijau',
    avatar: '/profile.webp',
    content: 'Kegiatan clean-up dan penanaman mangrove dari Pena Hijau memberikan dampak luar biasa bagi desa kami. Kesadaran warga akan pentingnya menjaga kebersihan pantai meningkat drastis.',
    rating: 5,
  },
  {
    id: 2,
    name: 'Siti Rahmawati',
    role: 'Relawan Pemuda & Mahasiswa',
    avatar: '/profile.webp',
    content: 'Bergabung di Pena Hijau memberi saya pengalaman nyata dalam aksi lingkungan. Teman-temannya sangat suportif dan kegiatannya dikemas dengan seru serta berdampak langsung.',
    rating: 5,
  },
  {
    id: 3,
    name: 'Deni Kurniawan',
    role: 'Guru Pendamping Lingkungan',
    avatar: '/profile.webp',
    content: 'Program sosialisasi pemilahan sampah ke sekolah sangat menginspirasi para siswa. Sekarang anak-anak mulai aktif mengelola sampah organik menjadi kompost sekolah.',
    rating: 5,
  },
];

const TestimonialSection = () => {
  return (
    <section className='relative overflow-hidden bg-white py-20 sm:py-28 text-slate-900'>
      {/* Decorative subtle background shapes */}
      <div className='pointer-events-none absolute left-1/2 top-0 h-96 w-96 -translate-x-1/2 rounded-full bg-green-500/5 blur-3xl' />

      <div className='relative mx-auto max-w-7xl px-5 sm:px-6 lg:px-8'>
        <div className='mx-auto max-w-3xl text-center'>
          <p className='text-sm font-semibold uppercase tracking-[0.25em] text-green-600'>
            Suara Komunitas & Mitra
          </p>
          <h2 className='mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl'>
            Apa Kata Mereka Tentang Pena Hijau
          </h2>
          <p className='mt-4 text-base leading-8 text-slate-600 sm:text-lg'>
            Cerita dan testimoni langsung dari warga desa, relawan muda, dan mitra pendidikan yang merasakan manfaat aksi bersama.
          </p>
        </div>

        <div className='mt-16 grid gap-8 md:grid-cols-3'>
          {testimonials.map((item) => (
            <div
              key={item.id}
              className='relative flex flex-col justify-between rounded-3xl border border-green-100 bg-slate-50/80 p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-green-300 hover:bg-white hover:shadow-xl hover:shadow-green-950/5'
            >
              <div>
                <Quote className='h-10 w-10 text-green-600/20' />
                <div className='mt-3 flex gap-1 text-amber-400'>
                  {[...Array(item.rating)].map((_, i) => (
                    <Star key={i} className='h-4 w-4 fill-amber-400 text-amber-400' />
                  ))}
                </div>
                <p className='mt-5 text-sm sm:text-base leading-7 text-slate-700 italic'>
                  "{item.content}"
                </p>
              </div>

              <div className='mt-8 pt-6 border-t border-slate-200/80 flex items-center gap-4'>
                <div className='relative h-12 w-12 overflow-hidden rounded-full border-2 border-green-600 bg-green-50 shadow-sm'>
                  <Image
                    src={item.avatar}
                    alt={item.name}
                    fill
                    sizes='48px'
                    className='object-cover'
                  />
                </div>
                <div>
                  <h4 className='font-bold text-slate-950 text-base'>{item.name}</h4>
                  <p className='text-xs font-semibold text-green-600'>{item.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialSection;
