import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://192.168.43.229:5000/api';

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const login = (email, password) => {
  return apiClient.post('/auth/login', { email, password });
};

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  return apiClient.post('/auth/logout');
};

export const getCurrentUser = () => {
  return apiClient.get('/auth/me');
};

export const getDashboardData = () => {
  return apiClient.get('/dashboard');
};

export const getActiveUsers = () => {
  return apiClient.get('/auth/active-users');
};

export const getActiveSessions = () => {
  return apiClient.get('/auth/sessions');
};

export const getExpenses = () => {
  return apiClient.get('/expenses');
};

export const createExpense = (data) => {
  return apiClient.post('/expenses', data);
};

export const updateExpense = (id, data) => {
  return apiClient.put(`/expenses/${id}`, data);
};

export const deleteExpense = (id) => {
  return apiClient.delete(`/expenses/${id}`);
};

export const getGoats = () => {
  return apiClient.get('/goats');
};

export const getReproductiveReport = () => {
  return apiClient.get('/reports/reproductive');
};

export const getGeneticReport = () => {
  return apiClient.get('/reports/genetic');
};

// Vaccination API calls
export const getVaccines = () => {
  return apiClient.get('/vaccines');
};

export const createVaccine = (data) => {
  return apiClient.post('/vaccines', data);
};

export const getVaccinations = () => {
  return apiClient.get('/vaccinations');
};

export const getGoatVaccinations = (goatId) => {
  return apiClient.get(`/vaccinations/goat/${goatId}`);
};

export const createVaccination = (data) => {
  return apiClient.post('/vaccinations', data);
};

export const updateVaccination = (id, data) => {
  return apiClient.put(`/vaccinations/${id}`, data);
};

export const deleteVaccination = (id) => {
  return apiClient.delete(`/vaccinations/${id}`);
};

export default apiClient;
