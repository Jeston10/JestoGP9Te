import api from './axios';

export const createWallet = async () => {
  const response = await api.get('/wallet/new');
  return response.data;
};

export const getWalletAddress = async () => {
  const response = await api.get('/wallet/address');
  return response.data;
};

export const signData = async (data) => {
  const response = await api.post('/wallet/sign', data);
  return response.data;
};

export const verifySignature = async (publicKey, data, signature) => {
  const response = await api.post('/wallet/verify', null, {
    params: { publicKey, data, signature }
  });
  return response.data;
};


