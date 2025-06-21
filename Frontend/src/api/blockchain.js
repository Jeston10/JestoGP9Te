import api from './axios';

export const getChain = async () => {
  const response = await api.get('/blockchain/chain');
  return response.data;
};

export const getLatestBlock = async () => {
  const response = await api.get('/blockchain/latest');
  return response.data;
};

export const getBlock = async (index) => {
  const response = await api.get(`/blockchain/block/${index}`);
  return response.data;
};

export const getAllTransactions = async () => {
  const response = await api.get('/blockchain/transactions');
  return response.data;
};

export const isValid = async () => {
  const response = await api.get('/blockchain/isValid');
  return response.data;
};

export const getLength = async () => {
  const response = await api.get('/blockchain/length');
  return response.data;
};