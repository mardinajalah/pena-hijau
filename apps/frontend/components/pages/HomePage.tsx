import HeroSaction from '../layouts/HeroSaction';
import GallerySection from '../layouts/GallerySection';
import VisionMissionSection from '../layouts/VisionMissionSection';
import MemberSection from '../layouts/MemberSection';

const HomePage = () => {
  return (
    <div>
      {/* hero section */}
      <HeroSaction />

      {/* visi and missi */}
      <VisionMissionSection />

      {/* gallery */}
      <GallerySection />

      {/* Member */}
      <MemberSection />
    </div>
  );
};

export default HomePage;
