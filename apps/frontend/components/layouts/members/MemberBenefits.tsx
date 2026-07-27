import { Award, Users, BookOpen, Globe } from 'lucide-react';

const benefits = [
  {
    id: 1,
    title: 'Pengalaman Aksi Lapangan',
    description: 'Terjun langsung dalam penanaman pohon, pembersihan pesisir, dan program konservasi desa.',
    icon: Globe,
    color: 'bg-emerald-600',
  },
  {
    id: 2,
    title: 'Jaringan & Komunitas Pemuda',
    description: 'Berkenalan dan berkolaborasi dengan ribuan relawan muda peduli lingkungan dari berbagai daerah.',
    icon: Users,
    color: 'bg-green-600',
  },
  {
    id: 3,
    title: 'Pelatihan & Workshop Gratis',
    description: 'Mendapatkan pembekalan edukasi pemilahan sampah, pengelolaan bank sampah, dan leadership.',
    icon: BookOpen,
    color: 'bg-teal-600',
  },
  {
    id: 4,
    title: 'Sertifikat Relawan Resmi',
    description: 'Apresiasi dan pengakuan e-sertifikat keikutsertaan dalam setiap kegiatan aksi lingkungan.',
    icon: Award,
    color: 'bg-emerald-700',
  },
];

const MemberBenefits = () => {
  return (
    <section className='bg-white py-20 sm:py-24 border-t border-slate-100'>
      <div className='mx-auto max-w-7xl px-5 sm:px-6 lg:px-8'>
        <div className='mx-auto max-w-3xl text-center'>
          <p className='text-sm font-semibold uppercase tracking-[0.25em] text-green-600'>
            Manfaat Relawan
          </p>
          <h2 className='mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl'>
            Mengapa Bergabung Bersama Pena Hijau?
          </h2>
          <p className='mt-4 text-base leading-8 text-slate-600 sm:text-lg'>
            Bergabung menjadi anggota atau relawan Pena Hijau bukan sekadar aksi sosial, melainkan ruang tumbuh bersama untuk mengembangkan kapasitas diri.
          </p>
        </div>

        <div className='mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4'>
          {benefits.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.id}
                className='relative overflow-hidden rounded-3xl border border-slate-100 bg-slate-50 p-8 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:bg-white hover:shadow-xl hover:shadow-green-950/5'
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

export default MemberBenefits;
