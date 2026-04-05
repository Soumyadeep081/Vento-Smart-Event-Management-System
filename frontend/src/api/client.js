import axios from 'axios';

const API = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT token to every request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('vento_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Handle 401 globally
API.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('vento_token');
      localStorage.removeItem('vento_user');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

// ===== Auth =====
export const authAPI = {
  register: (data) => API.post('/auth/register', data),
  login: (data) => API.post('/auth/login', data),
  socialLogin: (token, provider, role) => API.post('/auth/social-login', { token, provider, role }),
  verifyOtp: (data) => API.post('/auth/verify-otp', data),
  resendOtp: (data) => API.post('/auth/resend-otp', data),
};

// ===== Events =====
export const eventAPI = {
  create: (data) => API.post('/events', data),
  update: (id, data) => API.put(`/events/${id}`, data),
  delete: (id) => API.delete(`/events/${id}`),
  getById: (id) => API.get(`/events/${id}`),
  getMyEvents: () => API.get('/events/my'),
};

// ===== Vendors =====
export const vendorAPI = {
  create: (data) => API.post('/vendors', data),
  update: (id, data) => API.put(`/vendors/${id}`, data),
  getById: (id) => API.get(`/vendors/${id}`),
  getMyProfile: () => API.get('/vendors/me'),
  getAll: (params) => API.get('/vendors', { params }),
  search: (params) => API.get('/vendors/search', { params }),
};

// ===== Services =====
export const serviceAPI = {
  create: (vendorId, data) => API.post(`/services/vendor/${vendorId}`, data),
  update: (id, data) => API.put(`/services/${id}`, data),
  delete: (id) => API.delete(`/services/${id}`),
  getById: (id) => API.get(`/services/${id}`),
  getByVendor: (vendorId) => API.get(`/services/vendor/${vendorId}`),
  filter: (params) => API.get('/services/filter', { params }),
};

// ===== Bookings =====
export const bookingAPI = {
  create: (data) => API.post('/bookings', data),
  updateStatus: (id, status) => API.patch(`/bookings/${id}/status`, { status }),
  cancel: (id) => API.patch(`/bookings/${id}/cancel`),
  getMyBookings: (status) => API.get('/bookings/my', { params: status ? { status } : {} }),
  getByEvent: (eventId) => API.get(`/bookings/event/${eventId}`),
  getById: (id) => API.get(`/bookings/${id}`),
};

// ===== Reviews =====
export const reviewAPI = {
  create: (data) => API.post('/reviews', data),
  update: (id, data) => API.put(`/reviews/${id}`, data),
  delete: (id) => API.delete(`/reviews/${id}`),
  getByVendor: (vendorId) => API.get(`/reviews/vendor/${vendorId}`),
};

// ===== Recommendations =====
export const recommendationAPI = {
  recommend: (params) => API.get('/recommendations', { params }),
  compare: (data) => API.post('/recommendations/compare', data),
};

// ===== Notifications =====
export const notificationAPI = {
  getAll: () => API.get('/notifications'),
  getUnreadCount: () => API.get('/notifications/unread-count'),
  markAllRead: () => API.patch('/notifications/mark-all-read'),
  markRead: (id) => API.patch(`/notifications/${id}/read`),
};

// ===== Admin =====
export const adminAPI = {
  getStats: () => API.get('/admin/stats'),
  getUsers: (params) => API.get('/admin/users', { params }),
  verifyVendor: (id) => API.patch(`/admin/vendors/${id}/verify`),
  disableUser: (id) => API.delete(`/admin/users/${id}`),
};

// ===== Users =====
export const userAPI = {
  getProfile: () => API.get('/users/me'),
  updateProfile: (data) => API.put('/users/me', data),
  verifyPhone: () => API.patch('/users/verify-phone'),
};

export default API;
