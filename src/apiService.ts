import axios, { type AxiosInstance } from 'axios';

const apiClient: AxiosInstance = axios.create({
  baseURL: 'http://localhost:3000', // URL de tu Backend (NestJS)
  headers: {
    'Content-Type': 'application/json',
  },
});

export default apiClient;