import HeroSaction from '../layouts/HeroSaction';
import GallerySection from '../layouts/GallerySection';
import VisionMissionSection from '../layouts/VisionMissionSection';

const HomePage = () => {
  return (
    <div>
      {/* hero section */}
      <HeroSaction />

      {/* visi and missi */}
      <VisionMissionSection />

      {/* gallery */}
      <GallerySection />
    </div>
  );
};

export default HomePage;
