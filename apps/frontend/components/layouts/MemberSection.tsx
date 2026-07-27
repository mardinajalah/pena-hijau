import Image from 'next/image';
import { FaFacebookF, FaInstagram, FaLinkedinIn } from 'react-icons/fa6';

const members = [
  {
    id: 1,
    name: 'Rizky Pratama, S.Ling.',
    role: 'Ketua Umum & Founder',
    image: '/profile.webp',
  },
  {
    id: 2,
    name: 'Dewi Lestari',
    role: 'Ketua Divisi Edukasi',
    image: '/profile.webp',
  },
  {
    id: 3,
    name: 'Fajar Hidayat',
    role: 'Koordinator Lapangan Clean-Up',
    image: '/profile.webp',
  },
  {
    id: 4,
    name: 'Siti Nurhaliza',
    role: 'Manajer Media & Komunikasi',
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
      <div className='mx-auto max-w-7xl px-5 sm:px-6 lg:px-8'>
        <div className='mx-auto max-w-3xl text-center'>
          <p className='text-sm font-semibold uppercase tracking-[0.25em] text-green-600'>Anggota & Penggerak</p>
          <h2 className='mt-4 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl'>Tim Penggerak Pena Hijau</h2>
          <p className='mt-5 text-base leading-8 text-slate-600 sm:text-lg'>Orang-orang berdedikasi di balik kegiatan edukasi, aksi bersih lingkungan, dan kolaborasi desa bersama Pena Hijau.</p>
        </div>

        <div className='mt-16 grid gap-12 sm:grid-cols-2 lg:grid-cols-4'>
          {members.map((member) => (
            <article
              key={member.id}
              className='text-center group'
            >
              <div className='mx-auto flex h-48 w-48 items-center justify-center rounded-full border-[6px] border-green-600 p-2 shadow-lg shadow-green-900/10 transition-transform duration-300 group-hover:scale-105'>
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

              <h3 className='mt-6 text-xl font-bold text-slate-950 group-hover:text-green-600 transition-colors'>{member.name}</h3>
              <p className='mt-2 text-sm text-slate-600 font-medium'>{member.role}</p>

              <div className='mt-4 flex justify-center gap-4 text-green-600'>
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
