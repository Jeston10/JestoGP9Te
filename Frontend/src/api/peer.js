import api from './axios';

export const getPeers = async () => {
  const response = await api.get('/peer/list');
  return response.data;
};

export const addPeer = async (address) => {
  const response = await api.post('/peer/add', null, {
    params: { address }
  });
  return response.data;
};