import { Heart, Globe, Users, BookOpen } from 'lucide-react';

const values = [
  {
    id: 1,
    title: 'Kepedulian Sosial & Alam',
    description: 'Menumbuhkan rasa empati dan tanggung jawab tinggi terhadap ekosistem sekitar kita.',
    icon: Heart,
    color: 'bg-emerald-500',
  },
  {
    title: 'Aksi Nyata Berdampak',
    description: 'Berorientasi pada hasil konkrit di lapangan, bukan sekadar wacana atau teori.',
    icon: Globe,
    color: 'bg-green-600',
  },
  {
    id: 3,
    title: 'Edukasi & Pemberdayaan',
    description: 'Memberikan pengetahuan ramah lingkungan agar masyarakat bisa mandiri menjaga alam.',
    icon: BookOpen,
    color: 'bg-teal-600',
  },
  {
    id: 4,
    title: 'Semangat Gotong Royong',
    description: 'Merangkul semua elemen generasi muda dan lintas komunitas tanpa memandang perbedaan.',
    icon: Users,
    color: 'bg-emerald-700',
  },
];

const AboutValues = () => {
  return (
    <section className='bg-white py-20 sm:py-24'>
      <div className='mx-auto max-w-7xl px-5 sm:px-6 lg:px-8'>
        <div className='mx-auto max-w-3xl text-center'>
          <p className='text-sm font-semibold uppercase tracking-[0.25em] text-green-600'>
            Nilai-Nilai Utama
          </p>
          <h2 className='mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl'>
            Prinsip yang Menjadi Fondasi Gerakan Kami
          </h2>
          <p className='mt-4 text-base leading-8 text-slate-600 sm:text-lg'>
            Setiap langkah dan kegiatan Pena Hijau dipandu oleh nilai-nilai integritas, kebersamaan, dan kepedulian mendalam terhadap masa depan lingkungan Indonesia.
          </p>
        </div>

        <div className='mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4'>
          {values.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className='relative overflow-hidden rounded-3xl border border-slate-100 bg-slate-50 p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:bg-white hover:shadow-xl hover:shadow-green-900/5'
              >
                <div className={`inline-flex h-14 w-14 items-center justify-center rounded-2xl ${item.color} text-white shadow-md`}>
                  <Icon className='h-7 w-7' />
                </div>
                <h3 className='mt-6 text-xl font-bold text-slate-900'>
                  {item.title}
                </h3>
                <p className='mt-3 text-sm leading-7 text-slate-600'>
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default AboutValues;
