import axios from 'axios';

const BASE_URL = 'http://localhost:8080/api/transaction';

export const createTransaction = async (data) => {
  const response = await axios.post(`${BASE_URL}/create`, data);
  return response.data;
};

export const getAllTransactions = async () => {
  const response = await axios.get(`${BASE_URL}/all`);
  return response.data;
};
