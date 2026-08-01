'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { User, MapPin, Quote, Send, CheckCircle2, Sparkles, Phone, Tag, ArrowRight } from 'lucide-react';

const JoinFormSection = () => {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [quote, setQuote] = useState('');
  const [division, setDivision] = useState('Koordinator Lapangan & Clean-Up');
  const [phone, setPhone] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && address.trim() && quote.trim()) {
      setIsSubmitted(true);
    }
  };

  const handleReset = () => {
    setName('');
    setAddress('');
    setQuote('');
    setPhone('');
    setIsSubmitted(false);
  };

  return (
    <section className='bg-slate-50 py-20 sm:py-28'>
      <div className='mx-auto max-w-7xl px-5 sm:px-6 lg:px-8'>
        <div className='mx-auto max-w-3xl text-center mb-16'>
          <p className='text-sm font-semibold uppercase tracking-[0.25em] text-green-600'>
            Formulir Pendaftaran
          </p>
          <h2 className='mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl'>
            Bergabunglah dengan Barisan Pemuda Hijau
          </h2>
          <p className='mt-4 text-base leading-8 text-slate-600 sm:text-lg'>
            Lengkapi data diri dan motto motivasi Anda. Kartu tanda anggota relawan digital akan langsung terbentuk saat Anda mengetik.
          </p>
        </div>

        {isSubmitted ? (
          /* Success Screen */
          <div className='mx-auto max-w-2xl rounded-3xl bg-white p-8 sm:p-12 shadow-xl border border-green-200 text-center'>
            <div className='mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-100 text-green-600 mb-6'>
              <CheckCircle2 className='h-10 w-10' />
            </div>
            <h3 className='text-2xl sm:text-3xl font-bold text-slate-900'>
              Selamat, Pendaftaran Berhasil!
            </h3>
            <p className='mt-4 text-base text-slate-600 leading-relaxed'>
              Terima kasih <strong className='text-green-700 font-semibold'>{name}</strong> atas kepedulian Anda. Data relawan Anda dari <strong className='text-slate-900 font-semibold'>{address}</strong> telah resmi terdaftar di Pena Hijau.
            </p>

            {/* Rendered Member Card Preview in Success Screen */}
            <div className='my-8 relative overflow-hidden rounded-3xl bg-linear-to-br from-emerald-900 via-emerald-950 to-slate-950 p-6 text-left text-white shadow-2xl border border-emerald-700/50 max-w-md mx-auto'>
              <div className='flex items-center justify-between border-b border-emerald-800/80 pb-4 mb-4'>
                <div className='flex items-center gap-3'>
                  <Image src='/logo.webp' alt='Logo Pena Hijau' width={40} height={40} className='h-10 w-10 object-contain bg-white rounded-full p-1' />
                  <div>
                    <h4 className='text-sm font-bold text-white'>Pena Hijau</h4>
                    <p className='text-[10px] text-emerald-300 uppercase tracking-widest'>Kartu Anggota Relawan</p>
                  </div>
                </div>
                <span className='rounded-full bg-green-500/20 px-3 py-1 text-[10px] font-bold text-green-300 border border-green-400/30'>AKTIF</span>
              </div>

              <div className='space-y-3'>
                <div>
                  <p className='text-[10px] uppercase text-emerald-300 font-semibold'>Nama Anggota</p>
                  <p className='text-lg font-extrabold text-white'>{name}</p>
                </div>
                <div>
                  <p className='text-[10px] uppercase text-emerald-300 font-semibold'>Alamat / Domisili</p>
                  <p className='text-xs text-slate-200 flex items-center gap-1 mt-0.5'>
                    <MapPin className='h-3.5 w-3.5 text-green-400 shrink-0' />
                    {address}
                  </p>
                </div>
                <div>
                  <p className='text-[10px] uppercase text-emerald-300 font-semibold'>Divisi Minat</p>
                  <p className='text-xs text-slate-200 font-medium'>{division}</p>
                </div>
                <div className='pt-3 border-t border-emerald-800/60'>
                  <p className='text-[10px] uppercase text-emerald-300 font-semibold flex items-center gap-1'>
                    <Quote className='h-3 w-3 text-green-400' />
                    Motto / Kata-Kata Inspiratif
                  </p>
                  <p className='text-xs text-slate-200 italic mt-1 leading-relaxed'>" {quote} "</p>
                </div>
              </div>
            </div>

            <div className='flex flex-wrap justify-center gap-4 mt-8'>
              <button
                type='button'
                onClick={handleReset}
                className='rounded-full bg-slate-100 px-6 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer'
              >
                Daftar Relawan Lain
              </button>
              <Link
                href='/members'
                className='inline-flex items-center gap-2 rounded-full bg-green-600 px-6 py-3 text-sm font-semibold text-white hover:bg-green-700 transition-colors shadow-md'
              >
                <span>Lihat Daftar Anggota</span>
                <ArrowRight className='h-4 w-4' />
              </Link>
            </div>
          </div>
        ) : (
          /* Main Form & Real-time Live Card Preview Grid */
          <div className='grid gap-12 lg:grid-cols-12 lg:items-start'>
            {/* Form Inputs Column */}
            <div className='lg:col-span-7 rounded-3xl bg-white p-6 sm:p-10 shadow-xl border border-slate-200/80'>
              <form onSubmit={handleSubmit} className='space-y-6'>
                {/* Field: Nama Lengkap */}
                <div>
                  <label htmlFor='name' className='block text-sm font-bold text-slate-900 mb-2'>
                    Nama Lengkap <span className='text-red-500'>*</span>
                  </label>
                  <div className='relative'>
                    <div className='pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400'>
                      <User className='h-5 w-5 text-green-600' />
                    </div>
                    <input
                      type='text'
                      id='name'
                      required
                      placeholder='Contoh: Ahmad Hidayat, S.P.'
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className='w-full rounded-2xl border border-slate-300 bg-slate-50 py-3.5 pl-11 pr-4 text-sm font-medium text-slate-900 placeholder-slate-400 focus:border-green-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-green-600/20 transition-all'
                    />
                  </div>
                </div>

                {/* Field: Alamat / Domisili */}
                <div>
                  <label htmlFor='address' className='block text-sm font-bold text-slate-900 mb-2'>
                    Alamat Lengkap / Domisili <span className='text-red-500'>*</span>
                  </label>
                  <div className='relative'>
                    <div className='pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400'>
                      <MapPin className='h-5 w-5 text-green-600' />
                    </div>
                    <input
                      type='text'
                      id='address'
                      required
                      placeholder='Contoh: Desa Kotaanyar, Kec. Kotaanyar, Probolinggo'
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className='w-full rounded-2xl border border-slate-300 bg-slate-50 py-3.5 pl-11 pr-4 text-sm font-medium text-slate-900 placeholder-slate-400 focus:border-green-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-green-600/20 transition-all'
                    />
                  </div>
                </div>

                {/* Field: Motto / Kata-Kata Inspiratif */}
                <div>
                  <label htmlFor='quote' className='block text-sm font-bold text-slate-900 mb-2'>
                    Motto / Kata-Kata Inspiratif Lingkungan <span className='text-red-500'>*</span>
                  </label>
                  <div className='relative'>
                    <div className='pointer-events-none absolute top-4 left-4 text-slate-400'>
                      <Quote className='h-5 w-5 text-green-600' />
                    </div>
                    <textarea
                      id='quote'
                      required
                      rows={4}
                      placeholder='Tuliskan kalimat motivasi atau pesan peduli lingkungan Anda (Contoh: "Satu langkah kecil kita hari ini adalah nafas bersih bagi bumi di masa depan.")'
                      value={quote}
                      onChange={(e) => setQuote(e.target.value)}
                      className='w-full rounded-2xl border border-slate-300 bg-slate-50 py-3.5 pl-11 pr-4 text-sm font-medium text-slate-900 placeholder-slate-400 focus:border-green-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-green-600/20 transition-all'
                    />
                  </div>
                </div>

                {/* Field: Divisi Minat */}
                <div>
                  <label htmlFor='division' className='block text-sm font-bold text-slate-900 mb-2'>
                    Pilihan Divisi / Bidang Minat
                  </label>
                  <div className='relative'>
                    <div className='pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400'>
                      <Tag className='h-5 w-5 text-green-600' />
                    </div>
                    <select
                      id='division'
                      value={division}
                      onChange={(e) => setDivision(e.target.value)}
                      className='w-full rounded-2xl border border-slate-300 bg-slate-50 py-3.5 pl-11 pr-4 text-sm font-medium text-slate-900 focus:border-green-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-green-600/20 transition-all cursor-pointer'
                    >
                      <option value='Koordinator Lapangan & Clean-Up'>Koordinator Lapangan & Clean-Up</option>
                      <option value='Tim Edukasi & Bank Sampah'>Tim Edukasi & Bank Sampah</option>
                      <option value='Penghijauan & Bibit Pohon'>Penghijauan & Bibit Pohon</option>
                      <option value='Media & Kampanye Digital'>Media & Kampanye Digital</option>
                    </select>
                  </div>
                </div>

                {/* Field: No. WhatsApp (Optional) */}
                <div>
                  <label htmlFor='phone' className='block text-sm font-bold text-slate-900 mb-2'>
                    No. WhatsApp / HP <span className='text-xs font-normal text-slate-500'>(Opsional)</span>
                  </label>
                  <div className='relative'>
                    <div className='pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400'>
                      <Phone className='h-5 w-5 text-green-600' />
                    </div>
                    <input
                      type='tel'
                      id='phone'
                      placeholder='Contoh: 081234567890'
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className='w-full rounded-2xl border border-slate-300 bg-slate-50 py-3.5 pl-11 pr-4 text-sm font-medium text-slate-900 placeholder-slate-400 focus:border-green-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-green-600/20 transition-all'
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type='submit'
                  className='w-full inline-flex items-center justify-center gap-3 rounded-2xl bg-green-600 py-4 px-6 text-base font-bold text-white shadow-lg shadow-green-900/30 transition-all duration-300 hover:bg-green-700 hover:scale-[1.01] cursor-pointer'
                >
                  <span>Kirim & Gabung Relawan</span>
                  <Send className='h-5 w-5' />
                </button>
              </form>
            </div>

            {/* Real-time Card Preview Column */}
            <div className='lg:col-span-5 sticky top-28'>
              <div className='mb-4 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-green-600'>
                <Sparkles className='h-4 w-4' />
                <span>Pratinjau Kartu Anggota Digital</span>
              </div>

              {/* Live Preview Card */}
              <div className='relative overflow-hidden rounded-3xl bg-linear-to-br from-emerald-900 via-emerald-950 to-slate-950 p-7 text-white shadow-2xl border border-emerald-700/50 transition-all duration-300 hover:shadow-green-900/20'>
                {/* Decorative glows */}
                <div className='pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-green-500/20 blur-2xl' />

                {/* Card Header */}
                <div className='flex items-center justify-between border-b border-emerald-800/80 pb-5 mb-6 z-10 relative'>
                  <div className='flex items-center gap-3.5'>
                    <Image
                      src='/logo.webp'
                      alt='Logo Pena Hijau'
                      width={48}
                      height={48}
                      className='h-12 w-12 object-contain bg-white rounded-full p-1 shadow-sm'
                    />
                    <div>
                      <h4 className='text-base font-extrabold tracking-wide text-white'>Pena Hijau</h4>
                      <p className='text-[10px] text-emerald-300 uppercase tracking-widest font-semibold'>Pemuda Nusantara Peduli Lingkungan</p>
                    </div>
                  </div>
                  <span className='rounded-full bg-emerald-500/20 px-3 py-1 text-[10px] font-bold text-green-300 border border-green-400/30 backdrop-blur'>
                    RELAWAN
                  </span>
                </div>

                {/* Card Live Content */}
                <div className='space-y-4 z-10 relative'>
                  <div>
                    <p className='text-[10px] uppercase text-emerald-400 font-bold tracking-wider'>Nama Lengkap</p>
                    <p className='text-xl font-extrabold text-white mt-0.5 truncate'>
                      {name || 'Nama Anda...'}
                    </p>
                  </div>

                  <div>
                    <p className='text-[10px] uppercase text-emerald-400 font-bold tracking-wider'>Alamat / Domisili</p>
                    <p className='text-xs text-emerald-100 flex items-center gap-1.5 mt-0.5 truncate'>
                      <MapPin className='h-3.5 w-3.5 text-green-400 shrink-0' />
                      {address || 'Alamat domisili Anda...'}
                    </p>
                  </div>

                  <div>
                    <p className='text-[10px] uppercase text-emerald-400 font-bold tracking-wider'>Divisi Minat</p>
                    <p className='text-xs text-slate-200 font-semibold mt-0.5'>{division}</p>
                  </div>

                  <div className='pt-4 border-t border-emerald-800/70'>
                    <p className='text-[10px] uppercase text-emerald-400 font-bold tracking-wider flex items-center gap-1.5'>
                      <Quote className='h-3.5 w-3.5 text-green-400' />
                      Motto / Kata-Kata Inspiratif
                    </p>
                    <p className='text-xs text-emerald-50 italic mt-1.5 leading-relaxed bg-emerald-900/40 p-3 rounded-xl border border-emerald-700/30'>
                      "{quote || 'Motto atau pesan kepedulian lingkungan Anda akan muncul di sini...'}"
                    </p>
                  </div>
                </div>

                {/* Card Footer Badge */}
                <div className='mt-6 pt-4 border-t border-emerald-800/60 flex items-center justify-between text-[10px] text-emerald-300/80 font-mono'>
                  <span>ID: PH-2026-REG</span>
                  <span>RESMI • PENA HIJAU</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default JoinFormSection;
