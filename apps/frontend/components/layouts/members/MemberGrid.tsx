'use client';

import { useState } from 'react';
import Image from 'next/image';
import { FaInstagram, FaLinkedinIn, FaXTwitter } from 'react-icons/fa6';
import { Mail, MapPin, Quote } from 'lucide-react';

export interface TeamMember {
  id: number;
  name: string;
  role: string;
  division: 'Pengurus Inti' | 'Koordinator Lapangan' | 'Tim Edukasi' | 'Media & PR';
  location: string;
  image: string;
  quote: string;
  socials: {
    instagram?: string;
    linkedin?: string;
    twitter?: string;
    email?: string;
  };
}

const teamMembersData: TeamMember[] = [
  {
    id: 1,
    name: 'Rizky Pratama, S.Ling.',
    role: 'Ketua Umum & Founder',
    division: 'Pengurus Inti',
    location: 'Bandung, Jawa Barat',
    image: '/profile.webp',
    quote: 'Mewujudkan ekosistem hijau berawal dari keberanian pemuda untuk turun tangan langsung di lapangan.',
    socials: { instagram: '#', linkedin: '#', email: 'rizky@penahijau.org' },
  },
  {
    id: 2,
    name: 'Anisa Rahmawati',
    role: 'Sekretaris & Public Relation',
    division: 'Pengurus Inti',
    location: 'Jakarta Selatan',
    image: '/profile.webp',
    quote: 'Komunikasi yang kuat dan transparan adalah kunci membangun gerakan relawan yang berkelanjutan.',
    socials: { instagram: '#', linkedin: '#' },
  },
  {
    id: 3,
    name: 'Fajar Hidayat',
    role: 'Koordinator Lapangan Clean-Up',
    division: 'Koordinator Lapangan',
    location: 'Subang, Jawa Barat',
    image: '/profile.webp',
    quote: 'Setiap kilogram sampah plastik yang kita angkat dari pantai adalah kehidupan baru bagi satwa laut.',
    socials: { instagram: '#', linkedin: '#' },
  },
  {
    id: 4,
    name: 'Dewi Lestari, M.Pd.',
    role: 'Kepala Divisi Edukasi & Workshop',
    division: 'Tim Edukasi',
    location: 'Bogor, Jawa Barat',
    image: '/profile.webp',
    quote: 'Edukasi memilah sampah sejak dini membentuk generasi generasi masa depan yang peduli lingkungan.',
    socials: { instagram: '#', linkedin: '#' },
  },
  {
    id: 5,
    name: 'Bagas Kurniawan',
    role: 'Koordinator Reforestasi & Bibit',
    division: 'Koordinator Lapangan',
    location: 'Garut, Jawa Barat',
    image: '/profile.webp',
    quote: 'Menanam satu pohon hari ini berarti mewariskan udara bersih bagi anak cucu kita besok.',
    socials: { instagram: '#', linkedin: '#' },
  },
  {
    id: 6,
    name: 'Siti Nurhaliza',
    role: 'Manajer Media & Digital Campaign',
    division: 'Media & PR',
    location: 'Bandung, Jawa Barat',
    image: '/profile.webp',
    quote: 'Menyebarkan inspirasi kebaikan hijau melalui konten digital agar semakin banyak yang tergerak.',
    socials: { instagram: '#', twitter: '#' },
  },
  {
    id: 7,
    name: 'Dimas Anggara',
    role: 'Koordinator Bank Sampah Desa',
    division: 'Tim Edukasi',
    location: 'Sukabumi, Jawa Barat',
    image: '/profile.webp',
    quote: 'Mengubah sampah rumah tangga menjadi nilai ekonomi sirkular yang memberdayakan masyarakat.',
    socials: { instagram: '#', linkedin: '#' },
  },
  {
    id: 8,
    name: 'Maya Indah',
    role: 'Desainer Grafis & Konten Kreator',
    division: 'Media & PR',
    location: 'Cirebon, Jawa Barat',
    image: '/profile.webp',
    quote: 'Desain visual yang menarik membuat pesan kepedulian lingkungan lebih mudah diterima generasi muda.',
    socials: { instagram: '#', twitter: '#' },
  },
];

const divisions = ['Semua', 'Pengurus Inti', 'Koordinator Lapangan', 'Tim Edukasi', 'Media & PR'] as const;

const MemberGrid = () => {
  const [selectedDivision, setSelectedDivision] = useState<string>('Semua');

  const filteredMembers = selectedDivision === 'Semua'
    ? teamMembersData
    : teamMembersData.filter((m) => m.division === selectedDivision);

  return (
    <section className='bg-slate-50 py-20 sm:py-28'>
      <div className='mx-auto max-w-7xl px-5 sm:px-6 lg:px-8'>
        {/* Header Title */}
        <div className='mx-auto max-w-3xl text-center mb-14'>
          <p className='text-sm font-semibold uppercase tracking-[0.25em] text-green-600'>
            Struktur Organisasi
          </p>
          <h2 className='mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl'>
            Temui Tim Penggerak Pena Hijau
          </h2>
          <p className='mt-4 text-base leading-8 text-slate-600 sm:text-lg'>
            Para pengurus, koordinator lapangan, serta penggerak edukasi yang bekerja keras memastikan seluruh aksi lingkungan terlaksana dengan baik.
          </p>
        </div>

        {/* Category Filter Tabs */}
        <div className='flex flex-wrap items-center justify-center gap-3 mb-16'>
          {divisions.map((div) => {
            const isActive = selectedDivision === div;
            return (
              <button
                key={div}
                type='button'
                onClick={() => setSelectedDivision(div)}
                className={`rounded-full px-6 py-2.5 text-xs sm:text-sm font-bold transition-all duration-300 cursor-pointer ${
                  isActive
                    ? 'bg-green-600 text-white shadow-lg shadow-green-900/20 scale-105'
                    : 'bg-white text-slate-700 hover:bg-green-50 hover:text-green-600 border border-slate-200'
                }`}
              >
                {div}
              </button>
            );
          })}
        </div>

        {/* Member Cards Grid */}
        <div className='grid gap-8 sm:grid-cols-2 lg:grid-cols-4'>
          {filteredMembers.map((member) => (
            <article
              key={member.id}
              className='group flex flex-col justify-between overflow-hidden rounded-3xl bg-white border border-slate-200/80 p-6 shadow-md transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-green-950/10'
            >
              <div>
                {/* Profile Image Container */}
                <div className='relative mx-auto h-44 w-44 overflow-hidden rounded-full border-[5px] border-green-600 p-1.5 shadow-md shadow-green-900/10 transition-transform duration-500 group-hover:scale-105'>
                  <div className='relative h-full w-full overflow-hidden rounded-full bg-green-50'>
                    <Image
                      src={member.image}
                      alt={member.name}
                      fill
                      sizes='176px'
                      className='object-cover'
                    />
                  </div>
                </div>

                {/* Division Tag */}
                <div className='mt-6 text-center'>
                  <span className='inline-block rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700'>
                    {member.division}
                  </span>
                </div>

                {/* Name & Role */}
                <div className='mt-3 text-center'>
                  <h3 className='text-xl font-bold text-slate-900 group-hover:text-green-600 transition-colors'>
                    {member.name}
                  </h3>
                  <p className='mt-1 text-xs sm:text-sm font-semibold text-slate-500'>
                    {member.role}
                  </p>
                  <p className='mt-2 flex items-center justify-center gap-1 text-xs text-slate-400'>
                    <MapPin className='h-3.5 w-3.5 text-green-600' />
                    {member.location}
                  </p>
                </div>

                {/* Quote */}
                <div className='mt-5 rounded-2xl bg-slate-50 p-4 border border-slate-100 relative'>
                  <Quote className='h-4 w-4 text-green-600/30 absolute top-2 left-2' />
                  <p className='text-xs leading-relaxed text-slate-600 italic pl-3'>
                    "{member.quote}"
                  </p>
                </div>
              </div>

              {/* Social Links Footer */}
              <div className='mt-6 pt-4 border-t border-slate-100 flex justify-center gap-4 text-slate-500'>
                {member.socials.instagram && (
                  <a
                    href={member.socials.instagram}
                    aria-label={`Instagram ${member.name}`}
                    className='transition-colors hover:text-green-600 text-lg'
                  >
                    <FaInstagram />
                  </a>
                )}
                {member.socials.linkedin && (
                  <a
                    href={member.socials.linkedin}
                    aria-label={`LinkedIn ${member.name}`}
                    className='transition-colors hover:text-green-600 text-lg'
                  >
                    <FaLinkedinIn />
                  </a>
                )}
                {member.socials.twitter && (
                  <a
                    href={member.socials.twitter}
                    aria-label={`Twitter ${member.name}`}
                    className='transition-colors hover:text-green-600 text-lg'
                  >
                    <FaXTwitter />
                  </a>
                )}
                {member.socials.email && (
                  <a
                    href={`mailto:${member.socials.email}`}
                    aria-label={`Email ${member.name}`}
                    className='transition-colors hover:text-green-600 text-lg'
                  >
                    <Mail className='h-5 w-5' />
                  </a>
                )}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MemberGrid;
