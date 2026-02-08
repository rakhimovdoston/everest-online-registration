import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load user data from localStorage on mount
  useEffect(() => {
    const loadUserFromStorage = () => {
      try {
        const storedAuth = localStorage.getItem('authUser');
        const storedToken = localStorage.getItem('authToken');
        if (storedAuth && storedToken) {
          const authData = JSON.parse(storedAuth);
          setUser(authData.user);
          setToken(storedToken);
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error('Error loading user from localStorage:', error);
        localStorage.removeItem('authUser');
        localStorage.removeItem('authToken');
      } finally {
        setIsLoading(false);
      }
    };

    loadUserFromStorage();
  }, []);

  // Save user data to localStorage
  const saveUserToStorage = (userData, authToken) => {
    try {
      const authData = {
        isAuthenticated: true,
        user: userData,
      };
      localStorage.setItem('authUser', JSON.stringify(authData));
      if (authToken) {
        localStorage.setItem('authToken', authToken);
      }
    } catch (error) {
      console.error('Error saving user to localStorage:', error);
    }
  };

  // Login function - stores user data and token
  const login = (userData, authToken) => {
    setUser(userData);
    setToken(authToken);
    setIsAuthenticated(true);
    saveUserToStorage(userData, authToken);
  };

  // Register function - stores user data and auto-login
  const register = (userData, authToken) => {
    setUser(userData);
    setToken(authToken);
    setIsAuthenticated(true);
    saveUserToStorage(userData, authToken);
  };

  // Logout function - clears authentication state
  const logout = () => {
    setUser(null);
    setToken(null);
    setIsAuthenticated(false);
    localStorage.removeItem('authUser');
    localStorage.removeItem('authToken');
  };

  // Update user profile data
  const updateUser = (userData) => {
    const updatedUser = { ...user, ...userData };
    setUser(updatedUser);
    saveUserToStorage(updatedUser, token);
  };

  // Check if user is logged in
  const isLoggedIn = () => {
    return isAuthenticated && user !== null;
  };

  // Get auth token
  const getToken = () => {
    return token;
  };

  const value = {
    isAuthenticated,
    user,
    token,
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
