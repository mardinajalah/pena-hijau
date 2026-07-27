import { Trees, Users, Sparkles, MapPin } from 'lucide-react';

const stats = [
  {
    id: 1,
    number: '5.000+',
    label: 'Bibit Pohon Ditanam',
    description: 'Pohon produktif dan lindung di area kritis',
    icon: Trees,
  },
  {
    id: 2,
    number: '1.200+',
    label: 'Relawan Aktif',
    description: 'Generasi muda yang peduli lingkungan',
    icon: Users,
  },
  {
    id: 3,
    number: '45+',
    label: 'Aksi Bersih Lingkungan',
    description: 'Kegiatan edukasi dan pembersihan limbah',
    icon: Sparkles,
  },
  {
    id: 4,
    number: '25+',
    label: 'Desa & Sekolah Mitra',
    description: 'Kolaborasi program penghijauan berkelanjutan',
    icon: MapPin,
  },
];

const AboutStats = () => {
  return (
    <section className='relative -mt-10 z-10 mx-auto max-w-7xl px-5 sm:px-6 lg:px-8'>
      <div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-4'>
        {stats.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.id}
              className='group rounded-3xl border border-slate-100 bg-white p-6 sm:p-8 shadow-xl shadow-slate-200/50 transition-all duration-300 hover:-translate-y-1 hover:border-green-300 hover:shadow-green-900/10'
            >
              <div className='inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-green-100 text-green-700 transition-colors group-hover:bg-green-600 group-hover:text-white'>
                <Icon className='h-6 w-6' />
              </div>
              <p className='mt-6 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl'>
                {item.number}
              </p>
              <h3 className='mt-2 text-base font-bold text-slate-800'>
                {item.label}
              </h3>
              <p className='mt-1 text-sm leading-6 text-slate-500'>
                {item.description}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default AboutStats;
