import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export const signupUser = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/auth/signup`, userData);
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || 'Failed to signup. Please try again.';
  }
};

export const loginUser = async (credentials) => {
  try {
    const response = await axios.post(`${API_URL}/auth/login`, credentials);
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || 'Invalid email or password.';
  }
};
