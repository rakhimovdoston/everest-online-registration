import HeroSection from '../components/landing/HeroSection';
import WhyEverest from '../components/landing/WhyEverest';
import Pricing from '../components/landing/Pricing';
import UpcomingBookingCard from '../components/upcoming/UpcomingBookingCard';
import { useAuth } from '../contexts/AuthContext';

const Home = () => {
  const { isAuthenticated } = useAuth();

  return (
    <main className="min-h-screen bg-white">
      <HeroSection />
      {isAuthenticated && <UpcomingBookingCard />}
      <WhyEverest />
      <Pricing />
    </main>
  );
};

export default Home;
