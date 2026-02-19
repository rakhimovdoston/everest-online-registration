import { createContext, useContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { authApi } from '../services/api';

const AuthContext = createContext(null);

// Normalize API profile data to consistent camelCase
const normalizeProfile = (raw) => {
  if (!raw) return raw;
  // API returns { code, data: { ... }, success }, extract inner data
  const data = raw.data && raw.data.id ? raw.data : raw;
  return {
    ...data,
    firstName: data.firstName || data.firstname || data.first_name || '',
    lastName: data.lastName || data.lastname || data.last_name || '',
    username: data.username || '',
    email: data.email || '',
    phone: data.phone || data.phone_number || '',
  };
};

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load user session on mount
  useEffect(() => {
    const restoreSession = async () => {
      try {
        const accessToken = Cookies.get('accessToken');
        if (accessToken) {
          // Fetch profile to validate token and get user data
          const profileData = await authApi.getProfile();
          setUser(normalizeProfile(profileData));
          setIsAuthenticated(true);
        }
      } catch (error) {
        // Token invalid or expired — clear cookies
        Cookies.remove('accessToken');
        Cookies.remove('refreshToken');
      } finally {
        setIsLoading(false);
      }
    };

    restoreSession();
  }, []);

  // Login function - stores tokens in cookies and user in state
  const login = (userData, accessToken, refreshToken) => {
    Cookies.set('accessToken', accessToken, { expires: 7 });
    if (refreshToken) {
      Cookies.set('refreshToken', refreshToken, { expires: 30 });
    }
    setUser(normalizeProfile(userData));
    setIsAuthenticated(true);
  };

  // Register function - same as login
  const register = (userData, accessToken, refreshToken) => {
    login(userData, accessToken, refreshToken);
  };

  // Logout function - clears cookies and state
  const logout = () => {
    Cookies.remove('accessToken');
    Cookies.remove('refreshToken');
    setUser(null);
    setIsAuthenticated(false);
  };

  // Update user profile data
  const updateUser = (userData) => {
    setUser(prev => ({ ...prev, ...normalizeProfile(userData) }));
  };

  // Check if user is logged in
  const isLoggedIn = () => {
    return isAuthenticated && user !== null;
  };

  // Get auth token
  const getToken = () => {
    return Cookies.get('accessToken');
  };

  const value = {
    isAuthenticated,
    user,
    token: Cookies.get('accessToken'),
    isLoading,
    login,
    register,
    logout,
    updateUser,
    isLoggedIn,
    getToken,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
