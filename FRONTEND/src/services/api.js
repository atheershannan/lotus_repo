import axios from 'axios';

// Create axios instance with default config
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3001/api',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (refreshToken) {
          const response = await axios.post(`${api.defaults.baseURL}/auth/refresh`, {
            refreshToken
          });

          const { accessToken, refreshToken: newRefreshToken } = response.data.data.session;
          localStorage.setItem('accessToken', accessToken);
          localStorage.setItem('refreshToken', newRefreshToken);

          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed, redirect to login
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (email, password) => api.post('/auth/login', { email, password }),
  logout: (refreshToken) => api.post('/auth/logout', { refreshToken }),
  refresh: (refreshToken) => api.post('/auth/refresh', { refreshToken }),
  getMe: () => api.get('/auth/me'),
};

// Chat API
export const chatAPI = {
  sendMessage: (message, sessionId, options = {}) => 
    api.post('/chat/message', { message, sessionId, options }),
  getChatHistory: (sessionId) => 
    api.get(`/chat/history/${sessionId}`),
  getChatSessions: (params = {}) => 
    api.get('/chat/sessions', { params }),
  deleteChatSession: (sessionId) => 
    api.delete(`/chat/session/${sessionId}`),
  provideFeedback: (messageId, feedback, comment) => 
    api.post('/chat/feedback', { messageId, feedback, comment }),
  getChatAnalytics: (period = '30d') => 
    api.get('/chat/analytics', { params: { period } }),
};

// Content API
export const contentAPI = {
  getContent: (params = {}) => api.get('/content', { params }),
  getContentById: (id) => api.get(`/content/${id}`),
  createContent: (data) => api.post('/content', data),
  updateContent: (id, data) => api.put(`/content/${id}`, data),
  deleteContent: (id) => api.delete(`/content/${id}`),
  publishContent: (id) => api.post(`/content/${id}/publish`),
  getContentProgress: (id, params = {}) => 
    api.get(`/content/${id}/progress`, { params }),
};

// Skills API
export const skillsAPI = {
  getSkills: (params = {}) => api.get('/skills', { params }),
  getSkillById: (id) => api.get(`/skills/${id}`),
  createSkill: (data) => api.post('/skills', data),
  updateSkill: (id, data) => api.put(`/skills/${id}`, data),
  deleteSkill: (id) => api.delete(`/skills/${id}`),
};

// Progress API
export const progressAPI = {
  getProgress: (params = {}) => api.get('/progress', { params }),
  updateProgress: (data) => api.post('/progress', data),
  getProgressStats: (period = '30d') => 
    api.get('/progress/stats', { params: { period } }),
};

// Search API
export const searchAPI = {
  searchContent: (query, options = {}) => 
    api.post('/search/content', { query, ...options }),
  searchSkills: (query, options = {}) => 
    api.post('/search/skills', { query, ...options }),
  getSuggestions: (q, type = 'all') => 
    api.get('/search/suggestions', { params: { q, type } }),
  getTrending: (period = '7d', limit = 10) => 
    api.get('/search/trending', { params: { period, limit } }),
};

// Recommendations API
export const recommendationsAPI = {
  getRecommendations: (params = {}) => 
    api.get('/recommendations', { params }),
  provideFeedback: (recommendationId, isAccepted, comment) => 
    api.post('/recommendations/feedback', { recommendationId, isAccepted, comment }),
};

// Analytics API
export const analyticsAPI = {
  getOverview: (period = '30d') => 
    api.get('/analytics/overview', { params: { period } }),
  getLearningAnalytics: (period = '30d', department) => 
    api.get('/analytics/learning', { params: { period, department } }),
  getUserAnalytics: (period = '30d', department) => 
    api.get('/analytics/users', { params: { period, department } }),
};

// Users API
export const usersAPI = {
  getProfile: () => api.get('/users/profile'),
  updateProfile: (data) => api.put('/users/profile', data),
  getUsers: (params = {}) => api.get('/users', { params }),
  createUser: (data) => api.post('/users', data),
  getUserById: (id) => api.get(`/users/${id}`),
  updateUser: (id, data) => api.put(`/users/${id}`, data),
  deleteUser: (id) => api.delete(`/users/${id}`),
  getUserProgress: (id, params = {}) => 
    api.get(`/users/${id}/progress`, { params }),
  getUserAnalytics: (id, period = '30d') => 
    api.get(`/users/${id}/analytics`, { params: { period } }),
};

// Health check
export const healthAPI = {
  check: () => api.get('/health'),
};

export default api;


