import HeroSection from '../components/landing/HeroSection';
import ValueProposition from '../components/landing/ValueProposition';
import ExamEnvironment from '../components/landing/ExamEnvironment';
import Testimonials from '../components/landing/Testimonials';
import Pricing from '../components/landing/Pricing';
import FAQSection from '../components/landing/FAQSection';

const Home = () => {
  return (
    <main className="min-h-screen bg-white">
      <HeroSection />
      <ValueProposition />
      <ExamEnvironment />
      <Testimonials />
      <Pricing />
      <FAQSection />
    </main>
  );
};

export default Home;
