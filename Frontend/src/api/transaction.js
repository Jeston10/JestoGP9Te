import api from './axios';

export const createTransaction = async (transaction) => {
  const response = await api.post('/transaction/new', transaction);
  return response.data;
};

export const getPendingTransactions = async () => {
  const response = await api.get('/transaction/pending');
  return response.data;
};
