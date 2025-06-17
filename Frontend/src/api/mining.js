import axios from 'axios';

const BASE_URL = 'http://localhost:8080/api/mining';

export const mineBlock = async () => {
  const response = await axios.post(`${BASE_URL}/mine`);
  return response.data;
};