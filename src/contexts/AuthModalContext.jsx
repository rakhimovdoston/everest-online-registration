import { createContext, useContext, useState, useCallback } from 'react';

const AuthModalContext = createContext(null);

export const AuthModalProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [returnPath, setReturnPath] = useState(null);
  const [onSuccessCallback, setOnSuccessCallback] = useState(null);

  const openLoginModal = useCallback((options = {}) => {
    const { returnTo, onSuccess } = options;
    if (returnTo) setReturnPath(returnTo);
    if (onSuccess) setOnSuccessCallback(() => onSuccess);
    setIsOpen(true);
  }, []);

  const closeLoginModal = useCallback(() => {
    setIsOpen(false);
    setReturnPath(null);
    setOnSuccessCallback(null);
  }, []);

  const onLoginSuccess = useCallback(() => {
    if (onSuccessCallback) {
      onSuccessCallback();
    }
    closeLoginModal();
  }, [onSuccessCallback, closeLoginModal]);

  const value = {
    isOpen,
    returnPath,
    openLoginModal,
    closeLoginModal,
    onLoginSuccess,
  };

  return (
    <AuthModalContext.Provider value={value}>
      {children}
    </AuthModalContext.Provider>
  );
};

export const useAuthModal = () => {
  const context = useContext(AuthModalContext);
  if (!context) {
    throw new Error('useAuthModal must be used within an AuthModalProvider');
  }
  return context;
};

export default AuthModalContext;
