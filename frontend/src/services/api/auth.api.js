/**
 * Real auth API service — POST /auth/login
 */
import axiosInstance from '@/lib/axiosInstance';

export async function login(email, password) {
  try {
    const response = await axiosInstance.post('/auth/login', { email, password });
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || 'Login failed. Please try again.';
    throw new Error(message);
  }
}