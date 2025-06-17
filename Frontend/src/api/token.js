import axios from 'axios';

const BASE_URL = 'http://localhost:8080/api/token';

export const issueToken = async (data) => {
  const response = await axios.post(`${BASE_URL}/issue`, data);
  return response.data;
};

export const getTokenInfo = async (tokenId) => {
  const response = await axios.get(`${BASE_URL}/${tokenId}`);
  return response.data;
};