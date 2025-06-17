import axios from 'axios';

const BASE_URL = 'http://localhost:8080/api/peer';

export const getPeers = async () => {
  const response = await axios.get(`${BASE_URL}/list`);
  return response.data;
};

export const addPeer = async (peerUrl) => {
  const response = await axios.post(`${BASE_URL}/add`, { url: peerUrl });
  return response.data;
};