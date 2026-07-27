import Link from 'next/link';
import { UserPlus, ArrowRight } from 'lucide-react';

const MemberCta = () => {
  return (
    <section className='relative overflow-hidden bg-emerald-950 py-20 sm:py-28 text-white'>
      <div className='pointer-events-none absolute -left-20 -top-20 h-96 w-96 rounded-full bg-green-500/20 blur-3xl' />
      <div className='pointer-events-none absolute -right-20 -bottom-20 h-96 w-96 rounded-full bg-emerald-400/20 blur-3xl' />

      <div className='relative mx-auto max-w-5xl px-5 text-center sm:px-6 lg:px-8'>
        <span className='inline-flex items-center gap-2 rounded-full bg-emerald-800/60 px-4 py-2 text-xs sm:text-sm font-semibold uppercase tracking-[0.2em] text-emerald-200 backdrop-blur border border-emerald-700/50'>
          <UserPlus className='h-4 w-4 text-emerald-400' />
          Pendaftaran Relawan
        </span>

        <h2 className='mt-6 text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl leading-tight'>
          Siap Menjadi Bagian dari Keluarga Pena Hijau?
        </h2>

        <p className='mx-auto mt-5 max-w-2xl text-base sm:text-lg leading-8 text-emerald-100/90'>
          Bergabunglah bersama ribuan pemuda peduli lingkungan lainnya. Mari kita buktikan bahwa aksi kecil kita bersama sanggup membawa perubahan besar bagi Indonesia.
        </p>

        <div className='mt-10 flex flex-wrap items-center justify-center gap-4'>
          <Link
            href='#'
            className='inline-flex items-center gap-2.5 rounded-full bg-green-600 px-8 py-4 text-sm sm:text-base font-bold text-white shadow-lg shadow-green-900/40 transition-all duration-300 hover:bg-green-500 hover:scale-105'
          >
            <span>Daftar Relawan Sekarang</span>
            <ArrowRight className='h-5 w-5' />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default MemberCta;
