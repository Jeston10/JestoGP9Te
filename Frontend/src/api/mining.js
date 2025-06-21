import api from './axios';

export const mineBlock = async () => {
  const response = await api.post('/mining/mine');
  return response.data;
};