import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000'; // Flask backend URL

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Important for session cookies
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
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
  register: (username, email, password) => api.post('/auth/register', { username, email, password }),
  me: () => api.get('/auth/me'),
};

// Resume Endpoints
export const resumeApi = {
  getDashboard: () => api.get('/api/dashboard'),
  save: (data) => api.post('/api/resumes', data),
  delete: (id) => api.delete(`/api/delete/${id}`),
  download: (id) => api.get(`/api/download/${id}`, { responseType: 'blob' }),
  preview: (data) => api.post('/api/preview', data),
};

// AI/Specialized Endpoints
export const aiApi = {
  getSuggestion: (section, context) => api.post('/api/suggest', { section, context }),
  upload: (formData) => api.post('/api/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  tailor: (resume_id, job_description) => api.post('/api/tailor', { resume_id, job_description }),
};

export default api;
