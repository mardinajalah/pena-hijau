import JoinHero from '../layouts/join/JoinHero';
import JoinFormSection from '../layouts/join/JoinFormSection';

const JoinPage = () => {
  return (
    <div className='w-full overflow-hidden bg-slate-50'>
      {/* 1. Hero Section Gabung Relawan */}
      <JoinHero />

      {/* 2. Formulir Pendaftaran + Realtime Member Card Preview */}
      <JoinFormSection />
    </div>
  );
};

export default JoinPage;
