import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load user data from localStorage on mount
  useEffect(() => {
    const loadUserFromStorage = () => {
      try {
        const storedAuth = localStorage.getItem('authUser');
        if (storedAuth) {
          const authData = JSON.parse(storedAuth);
          setUser(authData.user);
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error('Error loading user from localStorage:', error);
        localStorage.removeItem('authUser');
      } finally {
        setIsLoading(false);
      }
    };

    loadUserFromStorage();
  }, []);

  // Save user data to localStorage
  const saveUserToStorage = (userData) => {
    try {
      const authData = {
        isAuthenticated: true,
        user: userData,
      };
      localStorage.setItem('authUser', JSON.stringify(authData));
    } catch (error) {
      console.error('Error saving user to localStorage:', error);
    }
  };

  // Login function - stores user data
  const login = (userData) => {
    setUser(userData);
    setIsAuthenticated(true);
    saveUserToStorage(userData);
  };

  // Register function - stores user data and auto-login
  const register = (userData) => {
    setUser(userData);
    setIsAuthenticated(true);
    saveUserToStorage(userData);
  };

  // Logout function - clears authentication state
  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('authUser');
  };

  // Update user profile data
  const updateUser = (userData) => {
    const updatedUser = { ...user, ...userData };
    setUser(updatedUser);
    saveUserToStorage(updatedUser);
  };

  // Check if user is logged in
  const isLoggedIn = () => {
    return isAuthenticated && user !== null;
  };

  const value = {
    isAuthenticated,
    user,
    isLoading,
    login,
    register,
    logout,
    updateUser,
    isLoggedIn,
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
