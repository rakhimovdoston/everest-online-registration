import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Step1Package from './pages/TestRegistration/Step1Package';
import Step2Branch from './pages/TestRegistration/Step2Branch';
import Step3Details from './pages/TestRegistration/Step3Details';
import Step4Review from './pages/TestRegistration/Step4Review';

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
        <Routes>
          <Route path="/" element={<Layout><Home /></Layout>} />
          <Route path="/login" element={<Layout><Login /></Layout>} />
          <Route path="/register" element={<Layout><Register /></Layout>} />
          <Route path="/test-registration" element={<Layout><Step1Package /></Layout>} />
          <Route path="/test-registration/branch" element={<Layout><Step2Branch /></Layout>} />
          <Route path="/test-registration/details" element={<Layout><Step3Details /></Layout>} />
          <Route path="/test-registration/review" element={<Layout><Step4Review /></Layout>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
