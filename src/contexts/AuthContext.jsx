import { createContext, useContext, useState, useEffect } from 'react';
import { authApi, setAuthToken, setLogoutCallback } from '../services/api';

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
        const accessToken = localStorage.getItem('accessToken');
        if (accessToken) {
          // Sahifa yuklanganida Axios default headerini darhol tiklash
          setAuthToken(accessToken);
          const profileData = await authApi.getProfile();
          setUser(normalizeProfile(profileData));
          setIsAuthenticated(true);
        }
      } catch (error) {
        // Token invalid or expired — clear localStorage
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
      } finally {
        setIsLoading(false);
      }
    };

    restoreSession();
  }, []);

  // Login function - stores tokens in localStorage and user in state
  const login = (userData, accessToken, refreshToken) => {
    localStorage.setItem('accessToken', accessToken);
    if (refreshToken) {
      localStorage.setItem('refreshToken', refreshToken);
    }
    setAuthToken(accessToken);
    setUser(normalizeProfile(userData));
    setIsAuthenticated(true);
  };

  // Register function - same as login
  const register = (userData, accessToken, refreshToken) => {
    login(userData, accessToken, refreshToken);
  };

  // Logout function - clears localStorage and state
  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    setAuthToken(null);
    setUser(null);
    setIsAuthenticated(false);
  };

  // api.js interceptor token expired bo'lganda shu logout ni chaqiradi
  useEffect(() => {
    setLogoutCallback(logout);
  }, []);

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
    return localStorage.getItem('accessToken');
  };

  const value = {
    isAuthenticated,
    user,
    token: localStorage.getItem('accessToken'),
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
