import axios from 'axios';

const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: BASE_URL,
});

export const uploadFile = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  const response = await api.post('/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

export const runAudit = async (outcome_col, protected_attr) => {
  const response = await api.post('/audit', { outcome_col, protected_attr });
  return response.data;
};

export const fixBias = async (outcome_col, protected_attr) => {
  const response = await api.post('/fix', { outcome_col, protected_attr });
  return response.data;
};

export default api;
