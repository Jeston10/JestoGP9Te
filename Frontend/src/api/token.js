import api from './axios';

export const getTokenBalance = async (address) => {
  const response = await api.get('/token/balance', {
    params: { address }
  });
  return response.data;
};

export const mintToken = async (to, amount) => {
  const response = await api.post('/token/mint', null, {
    params: { to, amount }
  });
  return response.data;
};

export const transferToken = async (from, to, amount) => {
  const response = await api.post('/token/transfer', null, {
    params: { from, to, amount }
  });
  return response.data;
};