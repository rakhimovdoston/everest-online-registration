import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { AuthModalProvider } from './contexts/AuthModalContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import LoginModal from './components/auth/LoginModal';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import Register from './pages/Register';
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

// Layout component that wraps all pages with Header and Footer
const Layout = ({ children }) => (
  <>
    <Header />
    {children}
    <Footer />
  </>
);

function App() {
  return (
    <AuthProvider>
      <Router>
        <AuthModalProvider>
          {/* Login Modal - rendered globally */}
          <LoginModal />

          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Layout><Home /></Layout>} />
            <Route path="/register" element={<Layout><Register /></Layout>} />

            {/* Protected routes */}
            <Route path="/profile" element={<Layout><ProtectedRoute><Profile /></ProtectedRoute></Layout>} />
            <Route path="/test-registration" element={<Layout><ProtectedRoute><Step1Package /></ProtectedRoute></Layout>} />
            <Route path="/test-registration/branch" element={<Layout><ProtectedRoute><Step2Branch /></ProtectedRoute></Layout>} />
            <Route path="/test-registration/details" element={<Layout><ProtectedRoute><Step3Details /></ProtectedRoute></Layout>} />
            <Route path="/test-registration/speaking" element={<Layout><ProtectedRoute><Step4SpeakingDates /></ProtectedRoute></Layout>} />
            <Route path="/test-registration/review" element={<Layout><ProtectedRoute><Step5Review /></ProtectedRoute></Layout>} />
            <Route path="/test-registration/payment" element={<Layout><ProtectedRoute><Step6Payment /></ProtectedRoute></Layout>} />
            <Route path="/test-results/:sessionId/listening" element={<Layout><ProtectedRoute><ListeningResults /></ProtectedRoute></Layout>} />
            <Route path="/test-results/:sessionId/reading" element={<Layout><ProtectedRoute><ReadingResults /></ProtectedRoute></Layout>} />
            <Route path="/test-results/:sessionId/writing" element={<Layout><ProtectedRoute><WritingResults /></ProtectedRoute></Layout>} />
          </Routes>
        </AuthModalProvider>
      </Router>
    </AuthProvider>
  );
}

export default App;
