import axios from 'axios';
import { API_BASE_URL } from './config';

const API_URL = API_BASE_URL;

const getErrorMessage = (error, fallback) => {
  if (error.response?.data?.error) return error.response.data.error;
  if (error.code === 'ERR_NETWORK' || !error.response) {
    return 'Cannot reach server. Make sure the backend is running on port 5001.';
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
    return response.data;
  } catch (error) {
    throw getErrorMessage(error, 'Invalid email or password.');
  }
};
