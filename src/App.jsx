import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { AuthModalProvider, useAuthModal } from './contexts/AuthModalContext';
import { PackageProvider } from './contexts/PackageContext';
import { UpcomingBookingProvider } from './contexts/UpcomingBookingContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import LoginModal from './components/auth/LoginModal';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import { trackPageView } from './utils/pixel';

// Tracks PageView on every SPA route change
const PixelPageView = () => {
  const location = useLocation();
  useEffect(() => {
    trackPageView();
  }, [location.pathname]);
  return null;
};

// Login happens in LoginModal — /login and old /register links open it on the home page
const LoginRedirect = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const { openLoginModal } = useAuthModal();
  useEffect(() => {
    if (!isLoading && !isAuthenticated) openLoginModal();
  }, [isLoading, isAuthenticated, openLoginModal]);
  // Wait for session restore, otherwise we'd leave before knowing whether to open the modal
  if (isLoading) return null;
  return <Navigate to="/" replace />;
};
import Home from './pages/Home';
import Profile from './pages/Profile';
import Step1Package from './pages/TestRegistration/Step1Package';
import Step2Branch from './pages/TestRegistration/Step2Branch';
import Step3Details from './pages/TestRegistration/Step3Details';
import Step4SpeakingDates from './pages/TestRegistration/Step4SpeakingDates';
import Step5Review from './pages/TestRegistration/Step5Review';
import Step6Payment from './pages/TestRegistration/Step6Payment';
import ListeningResults from './pages/TestResults/ListeningResults';
import ReadingResults from './pages/TestResults/ReadingResults';
import WritingResults from './pages/TestResults/WritingResults';

// Layout wrapper with Header and Footer
const Layout = () => (
  <>
    <Header />
    <Outlet />
    <Footer />
  </>
);

function App() {
  return (
    <AuthProvider>
      <UpcomingBookingProvider>
      <PackageProvider>
      <Router>
        <AuthModalProvider>
          <PixelPageView />
          <LoginModal />

          <Routes>
            <Route element={<Layout />}>
              {/* Public routes */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<LoginRedirect />} />
              <Route path="/register" element={<LoginRedirect />} />

              {/* Protected routes */}
              <Route element={<ProtectedRoute />}>
                <Route path="/profile" element={<Profile />} />
                <Route path="/test-registration" element={<Step1Package />} />
                <Route path="/test-registration/branch" element={<Step2Branch />} />
                <Route path="/test-registration/details" element={<Step3Details />} />
                <Route path="/test-registration/speaking" element={<Step4SpeakingDates />} />
                <Route path="/test-registration/review" element={<Step5Review />} />
                <Route path="/test-registration/payment/:bookingId" element={<Step6Payment />} />
                <Route path="/test-results/:sessionId/listening" element={<ListeningResults />} />
                <Route path="/test-results/:sessionId/reading" element={<ReadingResults />} />
                <Route path="/test-results/:sessionId/writing" element={<WritingResults />} />
              </Route>

              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          </Routes>
        </AuthModalProvider>
      </Router>
      </PackageProvider>
      </UpcomingBookingProvider>
    </AuthProvider>
  );
}

export default App;
