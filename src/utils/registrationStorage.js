// Wizard state for /test-registration/* lives in localStorage under this key
const STORAGE_KEY = 'testRegistration';

export const loadRegistration = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};
