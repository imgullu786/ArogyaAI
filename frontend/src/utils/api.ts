import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true
});

// Request interceptor to add auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth endpoints
export const auth = {
  login: async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password });
    localStorage.setItem('token', response.data.token);
    return response.data.data;
  },
  logout: async () => {
    await api.get('/auth/logout');
    localStorage.removeItem('token');
  },
  getMe: async () => {
    const response = await api.get('/auth/me');
    return response.data.data;
  }
};

// Patients endpoints
export const patients = {
  getAll: async () => {
    const response = await api.get('/patients');
    return response.data.data;
  },
  getById: async (id: string) => {
    const response = await api.get(`/patients/${id}`);
    return response.data.data;
  },
  create: async (data: any) => {
    const response = await api.post('/patients', data);
    return response.data.data;
  },
  update: async (id: string, data: any) => {
    const response = await api.patch(`/patients/${id}`, data);
    return response.data.data;
  },
  delete: async (id: string) => {
    await api.delete(`/patients/${id}`);
  }
};

// Assessments endpoints
export const assessments = {
  getAll: async () => {
    const response = await api.get('/assessments');
    return response.data.data;
  },
  getById: async (id: string) => {
    const response = await api.get(`/assessments/${id}`);
    return response.data.data;
  },
  create: async (data: any) => {
    const response = await api.post('/assessments', data);
    return response.data.data;
  },
  analyzeSymptoms: async (symptoms: string) => {
    const response = await api.post('/assessments/analyze-symptoms', { symptoms });
    return response.data.data;
  }
};

// Diagnostics endpoints
export const diagnostics = {
  getAll: async () => {
    const response = await api.get('/diagnostics');
    return response.data.data;
  },
  getById: async (id: string) => {
    const response = await api.get(`/diagnostics/${id}`);
    return response.data.data;
  },
  create: async (formData: FormData) => {
    const response = await api.post('/diagnostics', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data.data;
  },
  analyze: async (data: any) => {
    const response = await api.post('/diagnostics/analyze', data);
    return response.data.data;
  }
};

export default api;