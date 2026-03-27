import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// ─── Auth token helpers ────────────────────────────────────────────────────────

export const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
};

// AuthContext tomonidan o'rnatiladi — token expired bo'lganda chaqiriladi
let logoutCallback = null;
export const setLogoutCallback = (callback) => {
  logoutCallback = callback;
};

const clearAuthAndLogout = () => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  setAuthToken(null);
  if (logoutCallback) logoutCallback();
};

// ─── Token refresh queue ───────────────────────────────────────────────────────
// Bir vaqtda bir necha so'rov 401 olsa, refresh tugaguncha ularni navbatga qo'yadi

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) reject(error);
    else resolve(token);
  });
  failedQueue = [];
};

// ─── Request interceptor ──────────────────────────────────────────────────────

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

// ─── Response interceptor ─────────────────────────────────────────────────────

api.interceptors.response.use(
  (response) => {
    const data = response.data;
    if (data && data.success === false) {
      return Promise.reject(new ApiError(data.message || 'An error occurred', data.code, data));
    }
    return data;
  },
  async (error) => {
    const originalRequest = error.config;
    const status = error.response?.status;

    // 401 — access token expired, refresh qilib ko'ramiz
    if (
      status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url?.includes('/auth/refresh-token')
    ) {
      // Refresh jarayonida boshqa so'rovlar navbatda kutadi
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers['Authorization'] = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = localStorage.getItem('refreshToken');

      if (!refreshToken) {
        isRefreshing = false;
        clearAuthAndLogout();
        return Promise.reject(new ApiError('Session expired. Please login again.', 401, null));
      }

      try {
        // api instancedan emas, to'g'ridan-to'g'ri axios orqali chaqiramiz
        // (interceptor loopiga tushmaslik uchun)
        const refreshResponse = await axios.post(
          `${import.meta.env.VITE_API_URL}/auth/refresh-token`,
          { refreshToken }
        );

        const inner = refreshResponse.data?.data || refreshResponse.data;
        const newAccessToken = inner?.access_token || inner?.accessToken;
        const newRefreshToken = inner?.refresh_token || inner?.refreshToken;

        if (!newAccessToken) throw new Error('No access token in refresh response');

        // Yangi tokenlarni saqlash
        localStorage.setItem('accessToken', newAccessToken);
        if (newRefreshToken) {
          localStorage.setItem('refreshToken', newRefreshToken);
        }
        setAuthToken(newAccessToken);

        // Navbatdagi so'rovlarni yangi token bilan davom ettirish
        processQueue(null, newAccessToken);

        // Asl so'rovni qayta yuborish
        originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh token ham expired — accountdan chiqish
        processQueue(refreshError, null);
        clearAuthAndLogout();
        return Promise.reject(new ApiError('Session expired. Please login again.', 401, null));
      } finally {
        isRefreshing = false;
      }
    }

    const message = error.response?.data?.message || 'An error occurred';
    const data = error.response?.data;
    return Promise.reject(new ApiError(message, status, data));
  }
);

// ─── ApiError class ───────────────────────────────────────────────────────────

class ApiError extends Error {
  constructor(message, status, data) {
    super(message);
    this.status = status;
    this.data = data;
    this.fieldErrors = data?.error && typeof data.error === 'object' ? data.error : null;
  }
}

// ─── API modules ──────────────────────────────────────────────────────────────

export const authApi = {
  requestSmsCode: (phone) =>
    api.post('/auth/sms/send-code', { phone }),

  verifySmsCode: (phone, code) =>
    api.post('/auth/sms/verify', { phone, code }),

  resendSmsCode: (phone) =>
    api.get('/auth/sms/resend-code', { params: { phone } }),

  refreshToken: (refreshToken) =>
    axios.post(`${import.meta.env.VITE_API_URL}/auth/refresh-token`, { refreshToken }),

  getProfile: () =>
    api.get('/user/profile'),

  completeRegistration: (data) =>
    api.post('/user/complete-registration', data),

  getBookingsByUser: (userId) =>
    api.get(`/booking/by-user?userId=${userId}`),

  getUpcomingBooking: () =>
    api.get('/user/upcoming-booking'),

  checkUsername: (username) =>
    api.post('/admin/user/check-username', { username }),

  logout: () =>
    api.post('/auth/logout'),
};

export const branchApi = {
  getAll: (active) =>
    api.get('/branch/all', { params: { active } }),
  getSpeakers: (branchId) =>
    api.get(`/branch/speakers/${branchId}`),
  getPaymentMethods: (lang) =>
    api.get('/branch/payment-methods', { headers: { lang } }),
};

export const bookingApi = {
  save: (data) =>
    api.post('/booking/save', data),
  getPaymentMethods: (bookingId) =>
    api.get(`/payment/methods/${bookingId}`),
  makePayment: (bookingId, paymentMethod) =>
    api.post('/payment/make', { bookingId, paymentMethod }),
  getPaymentLink: (orderId, paymentProvider, lang) =>
    api.post('/orders/payment/link', {
      orderId: orderId,
      payment_provider: paymentProvider,
    }, { headers: { lang } }),
};

export const testSessionApi = {
  getAvailable: (date, branchId) =>
    api.get('/test-session/available', { params: { date, branch: branchId, website: true } }),
  getSpeakingAvailable: (date, branchId, type, speakerId) =>
    api.get('/test-session/speaking/available', {
      params: { date, branch: branchId, type, speakerId },
    }),
  getListeningResults: (sessionId) =>
    api.get(`/history/mock-exam/${sessionId}`, { params: { type: 'listening' } }),
  getReadingResults: (sessionId) =>
    api.get(`/history/mock-exam/${sessionId}`, { params: { type: 'reading' } }),
};

export { ApiError };
export default api;
