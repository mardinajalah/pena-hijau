import Image from 'next/image';
import { FaFacebookF, FaInstagram, FaLinkedinIn } from 'react-icons/fa6';

const members = [
  {
    id: 1,
    name: 'Tidak ada Nama',
    role: 'Koordinator Lapangan',
    image: '/profile.webp',
  },
  {
    id: 2,
    name: 'Tidak ada Nama',
    role: 'Ketua Edukasi',
    image: '/profile.webp',
  },
  {
    id: 3,
    name: 'Tidak ada Nama',
    role: 'Penggerak Komunitas',
    image: '/profile.webp',
  },
  {
    id: 4,
    name: 'Tidak ada Nama',
    role: 'Relawan Lingkungan',
    image: '/profile.webp',
  },
];

const socialLinks = [
  {
    label: 'Facebook',
    Icon: FaFacebookF,
  },
  {
    label: 'Instagram',
    Icon: FaInstagram,
  },
  {
    label: 'LinkedIn',
    Icon: FaLinkedinIn,
  },
];

const MemberSection = () => {
  return (
    <section className='bg-white py-20 sm:py-24'>
      <div className='mx-auto max-w-8xl px-5 sm:px-6 lg:px-8'>
        <div className='mx-auto max-w-3xl text-center'>
          <p className='text-sm font-semibold uppercase tracking-[0.25em] text-green-600'>Anggota</p>
          <h2 className='mt-4 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl'>Tim Penggerak Pena Hijau</h2>
          <p className='mt-5 text-base leading-8 text-slate-600 sm:text-lg'>Orang-orang di balik kegiatan edukasi, aksi bersih lingkungan, dan kolaborasi desa bersama Pena Hijau.</p>
        </div>

        <div className='mt-16 grid gap-12 sm:grid-cols-2 lg:grid-cols-4'>
          {members.map((member) => (
            <article
              key={member.id}
              className='text-center'
            >
              <div className='mx-auto flex h-48 w-48 items-center justify-center rounded-full border-[6px] border-green-600 p-2 shadow-lg shadow-green-900/10'>
                <div className='relative h-full w-full overflow-hidden rounded-full bg-green-50'>
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    sizes='192px'
                    className='object-cover'
                  />
                </div>
              </div>

              <h3 className='mt-6 text-2xl font-bold text-slate-950'>{member.name}</h3>
              <p className='mt-3 text-base text-slate-600'>{member.role}</p>

              <div className='mt-5 flex justify-center gap-4 text-green-600'>
                {socialLinks.map(({ label, Icon }) => (
                  <a
                    key={`${member.name}-${label}`}
                    href='#'
                    aria-label={`${label} ${member.name}`}
                    className='text-lg transition-colors hover:text-green-700'
                  >
                    <Icon aria-hidden='true' />
                  </a>
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MemberSection;
