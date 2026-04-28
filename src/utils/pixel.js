// Meta Pixel helper — safe wrapper around window.fbq
const fbq = (...args) => {
  if (typeof window !== 'undefined' && typeof window.fbq === 'function') {
    window.fbq(...args);
  }
};

// Fired on every route change (SPA navigation)
export const trackPageView = () => fbq('track', 'PageView');

// Fired when user clicks "Ro'yxatdan o'tish" CTA button
export const trackInitiateCheckout = () => fbq('track', 'InitiateCheckout');

// Fired when new user completes registration (2-step form)
export const trackCompleteRegistration = () => fbq('track', 'CompleteRegistration');

// Fired when user is redirected to payment gateway
export const trackPurchase = (value, currency = 'UZS') =>
  fbq('track', 'Purchase', { value, currency });
