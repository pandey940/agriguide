import axios from 'axios';
import { API_BASE_URL } from './config';

const API_URL = API_BASE_URL;

const getErrorMessage = (error, fallback) => {
  if (error.response?.data?.error) return error.response.data.error;
  if (error.code === 'ERR_NETWORK' || !error.response) {
    return 'Cannot reach server. Deploy the backend and set VITE_API_URL in Netlify.';
  }
  if (typeof error.response?.data === 'string' && error.response.data.includes('<!DOCTYPE')) {
    return 'API not configured. Set VITE_API_URL to your deployed backend URL in Netlify.';
  }
  return fallback;
};

export const signupUser = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/auth/signup`, userData);
    return response.data;
  } catch (error) {
    throw getErrorMessage(error, 'Failed to signup. Please try again.');
  }
};

export const loginUser = async (credentials) => {
  try {
    const response = await axios.post(`${API_URL}/auth/login`, credentials);
    if (!response.data?.token || !response.data?.user) {
      throw new Error('Invalid server response. Check VITE_API_URL in Netlify settings.');
    }
    return response.data;
  } catch (error) {
    throw getErrorMessage(error, 'Invalid email or password.');
  }
};
