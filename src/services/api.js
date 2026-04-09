import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Important for session cookies
});

// Response Interceptor for Global Error Handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Basic error handling log
    console.error('API Error:', error.response || error.message);
    
    // Check for 401/403 (Unauthorized/Forbidden)
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
        // Potentially redirect to login or clear auth state
        // For now, let the component handle specific alerts
    }
    
    return Promise.reject(error);
  }
);

// Auth Endpoints
export const authApi = {
  login: (email, password) => api.post('/auth/login', { email, password }),
  logout: () => api.post('/auth/logout'),
  register: (email, password) => api.post('/auth/register', { email, password }),
  me: () => api.get('/auth/me'),
  togglePremium: () => api.post('/auth/toggle-premium'),
};

// Resume Endpoints
export const resumeApi = {
  getDashboard: () => api.get('/api/dashboard'),
  getById: (id) => api.get(`/api/resumes/${id}`),
  save: (data) => api.post('/api/resumes', data),
  delete: (id) => api.delete(`/api/delete/${id}`),
  download: (id) => api.get(`/api/download/${id}`, { responseType: 'blob' }),
  preview: (data) => api.post('/api/preview', data),
};

// AI/Specialized Endpoints
export const aiApi = {
  getSuggestion: (section, context, full_resume = null) => 
    api.post('/api/suggest', { section, context, full_resume }),
  upload: (formData) => api.post('/api/upload', formData, {
    headers: { 
      'Content-Type': undefined // Let browser set it with boundary
    }
  }),
  tailor: (resume_id, job_description) => api.post('/api/tailor', { resume_id, job_description }),
};

export default api;
