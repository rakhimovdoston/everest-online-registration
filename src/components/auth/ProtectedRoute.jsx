import { useEffect } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useAuthModal } from '../../contexts/AuthModalContext';

const ProtectedRoute = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading } = useAuth();
  const { openLoginModal } = useAuthModal();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      openLoginModal({
        onSuccess: () => {
          // Stay on the current page after login
        },
      });
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, isLoading, openLoginModal, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-slate-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return <Outlet />;
};

export default ProtectedRoute;
