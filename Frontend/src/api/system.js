import api from './axios';

export const getSystemHealth = async () => {
  const response = await api.get('/health');
  return response.data;
};

export const getSystemStats = async () => {
  const response = await api.get('/stats');
  return response.data;
}; 