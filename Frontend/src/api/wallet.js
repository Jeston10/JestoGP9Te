import axios from 'axios';

const BASE_URL = 'http://localhost:8080/api/wallet';

export const createWallet = async () => {
  const response = await axios.post(`${BASE_URL}/create`);
  return response.data;
};

export const getWalletInfo = async (address) => {
  const response = await axios.get(`${BASE_URL}/${address}`);
  return response.data;
};


