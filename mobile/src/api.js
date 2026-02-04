import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Configure API base URL - update with your backend IP
const API_BASE_URL = 'http://192.168.43.229:5000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token interceptor
apiClient.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('Error retrieving token:', error);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle response errors
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Token expired - logout user
      await AsyncStorage.removeItem('authToken');
      await AsyncStorage.removeItem('user');
    }
    return Promise.reject(error);
  }
);

// Auth APIs
export const authAPI = {
  login: (email, password) => 
    apiClient.post('/auth/login', { email, password }),
  
  logout: () => 
    apiClient.post('/auth/logout'),
  
  getCurrentUser: () => 
    apiClient.get('/auth/me'),
  
  getActiveUsers: () => 
    apiClient.get('/auth/active-users'),
  
  getActiveSessions: () => 
    apiClient.get('/auth/sessions'),
};

// Dashboard APIs
export const dashboardAPI = {
  getDashboardData: () => 
    apiClient.get('/dashboard'),
};

// Goat Management APIs
export const goatAPI = {
  getGoats: () => 
    apiClient.get('/goats'),
  
  getGoat: (id) => 
    apiClient.get(`/goats/${id}`),
  
  createGoat: (data) => 
    apiClient.post('/goats', data),
  
  updateGoat: (id, data) => 
    apiClient.put(`/goats/${id}`, data),
  
  deleteGoat: (id) => 
    apiClient.delete(`/goats/${id}`),
  
  getGoatById: (id) => 
    apiClient.get(`/goats/${id}`),
  
  getFamilyTree: () => 
    apiClient.get('/goats/family-tree'),
};

// Chicken Management APIs
export const chickenAPI = {
  getChickens: () => 
    apiClient.get('/chickens'),
  
  createChicken: (data) => 
    apiClient.post('/chickens', data),
  
  updateChicken: (id, data) => 
    apiClient.put(`/chickens/${id}`, data),
  
  deleteChicken: (id) => 
    apiClient.delete(`/chickens/${id}`),
};

// Expense APIs
export const expenseAPI = {
  getExpenses: (filters = {}) => 
    apiClient.get('/expenses', { params: filters }),
  
  createExpense: (data) => 
    apiClient.post('/expenses', data),
  
  updateExpense: (id, data) => 
    apiClient.put(`/expenses/${id}`, data),
  
  deleteExpense: (id) => 
    apiClient.delete(`/expenses/${id}`),
  
  getExpenseStats: () => 
    apiClient.get('/expenses/stats'),
};

// Activity Log APIs
export const activityAPI = {
  getActivities: () => 
    apiClient.get('/activity-log'),
  
  createActivity: (data) => 
    apiClient.post('/activity-log', data),
  
  updateActivity: (id, data) => 
    apiClient.put(`/activity-log/${id}`, data),
  
  deleteActivity: (id) => 
    apiClient.delete(`/activity-log/${id}`),
};

// Vaccination APIs
export const vaccineAPI = {
  getVaccines: () => 
    apiClient.get('/vaccines'),
  
  createVaccine: (data) => 
    apiClient.post('/vaccines', data),
  
  updateVaccine: (id, data) => 
    apiClient.put(`/vaccines/${id}`, data),
  
  deleteVaccine: (id) => 
    apiClient.delete(`/vaccines/${id}`),
  
  recordVaccination: (data) => 
    apiClient.post('/vaccines/record', data),
};

// Breeding APIs
export const breedingAPI = {
  getBreedingRecords: () => 
    apiClient.get('/breeding'),
  
  createBreedingRecord: (data) => 
    apiClient.post('/breeding', data),
  
  updateBreedingRecord: (id, data) => 
    apiClient.put(`/breeding/${id}`, data),
};

// Health APIs
export const healthAPI = {
  getHealthRecords: () => 
    apiClient.get('/health'),
  
  createHealthRecord: (data) => 
    apiClient.post('/health', data),
  
  updateHealthRecord: (id, data) => 
    apiClient.put(`/health/${id}`, data),
};

// Reports APIs
export const reportAPI = {
  getReproductiveReport: () => 
    apiClient.get('/reports/reproductive'),
  
  getGeneticReport: () => 
    apiClient.get('/reports/genetic'),
  
  getHealthReport: () => 
    apiClient.get('/reports/health'),
  
  getExpenseReport: () => 
    apiClient.get('/reports/expenses'),
  
  generateReport: (type, filters = {}) => 
    apiClient.post(`/reports/${type}`, filters),
};

export default apiClient;
