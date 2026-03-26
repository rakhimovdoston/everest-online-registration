import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authApi } from '../services/api';
import { useAuth } from './AuthContext';

const UpcomingBookingContext = createContext(null);

export const UpcomingBookingProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  const fetchUpcoming = useCallback(async () => {
    if (!isAuthenticated) return;
    setLoading(true);
    try {
      const res = await authApi.getUpcomingBooking();
      if (res?.code === 200 && res?.data) {
        setData(res.data);
      } else {
        setData(null);
      }
    } catch (err) {
      if (err?.status === 404) {
        setData(null);
      } else {
        console.error('Failed to fetch upcoming booking:', err);
        setData(null);
      }
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  // Fetch on auth change
  useEffect(() => {
    if (isAuthenticated) {
      setIsDismissed(false);
      fetchUpcoming();
    } else {
      setData(null);
    }
  }, [isAuthenticated, fetchUpcoming]);

  // Refetch on window focus
  useEffect(() => {
    const onFocus = () => {
      if (isAuthenticated) fetchUpcoming();
    };
    window.addEventListener('focus', onFocus);
    return () => window.removeEventListener('focus', onFocus);
  }, [isAuthenticated, fetchUpcoming]);

  const dismiss = () => setIsDismissed(true);

  return (
    <UpcomingBookingContext.Provider value={{ data, loading, isDismissed, dismiss, refresh: fetchUpcoming }}>
      {children}
    </UpcomingBookingContext.Provider>
  );
};

export const useUpcomingBooking = () => {
  const ctx = useContext(UpcomingBookingContext);
  if (!ctx) throw new Error('useUpcomingBooking must be used within UpcomingBookingProvider');
  return ctx;
};

export default UpcomingBookingContext;
