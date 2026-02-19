import axios from 'axios';
import Cookies from 'js-cookie';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

api.interceptors.request.use((config) => {
  const token = Cookies.get('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => {
    const data = response.data;
    if (data && data.success === false) {
      return Promise.reject(new ApiError(data.message || 'An error occurred', data.code, data));
    }
    return data;
  },
  (error) => {
    const message = error.response?.data?.message || 'An error occurred';
    const status = error.response?.status;
    const data = error.response?.data;
    return Promise.reject(new ApiError(message, status, data));
  }
);

class ApiError extends Error {
  constructor(message, status, data) {
    super(message);
    this.status = status;
    this.data = data;
    this.fieldErrors = data?.error && typeof data.error === 'object' ? data.error : null;
  }
}

export const authApi = {
  requestSmsCode: (phone) =>
    api.post('/auth/sms/send-code', { phone }),

  verifySmsCode: (phone, code) =>
    api.post('/auth/sms/verify', { phone, code }),

  resendSmsCode: (phone) =>
    api.get('/auth/sms/resend-code', { params: { phone } }),

  getProfile: () =>
    api.get('/user/profile'),

  completeRegistration: (data, config) =>
    api.post('/user/complete-registration', data, config),

  getBookingsByUser: (userId) =>
    api.get(`/booking/by-user?userId=${userId}`),

  logout: () =>
    api.post('/auth/logout'),
};

export const branchApi = {
  getAll: (active) =>
    api.get('/branch/all', { params: { active } }),
  getSpeakers: (branchId) =>
    api.get(`/branch/speakers/${branchId}`),
};

export const bookingApi = {
  save: (data) =>
    api.post('/booking/save', data),
  getPaymentMethods: (bookingId) =>
    api.get(`/payment/methods/${bookingId}`),
  makePayment: (bookingId, paymentMethod) =>
    api.post('/payment/make', { bookingId, paymentMethod }),
};

export const testSessionApi = {
  getAvailable: (date, branchId) =>
    api.get('/test-session/available', { params: { date, branch: branchId, website: true } }),
  getSpeakingAvailable: (date, branchId, type, speakerId) =>
    api.get('/test-session/speaking/available', {
      params: { date, branch: branchId, type, speakerId },
    }),
};

export { ApiError };
export default api;
