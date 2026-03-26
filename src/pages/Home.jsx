import HeroSection from '../components/landing/HeroSection';
import Pricing from '../components/landing/Pricing';
import UpcomingBookingCard from '../components/upcoming/UpcomingBookingCard';
import { useAuth } from '../contexts/AuthContext';

const Home = () => {
  const { isAuthenticated } = useAuth();

  return (
    <main className="min-h-screen bg-white">
      <HeroSection />
      {isAuthenticated && <UpcomingBookingCard />}
      <Pricing />
    </main>
  );
};

export default Home;
