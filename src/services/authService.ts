import apiClient from './apiClient';

interface SignupData {
  email: string;
  name: string;
  password: string;
}

interface SigninData {
  email: string;
  password: string;
}

interface User {
  id: string;
  email: string;
  name: string;
  createdAt?: string;
}

export const authService = {
  async signup(email: string, name: string, password: string): Promise<void> {
    const data: SignupData = { email, name, password };
    await apiClient.post('/auth/signup', data);
  },

  async signin(email: string, password: string): Promise<void> {
    const data: SigninData = { email, password };
    await apiClient.post('/auth/signin', data);
  },

  async logout(): Promise<void> {
    await apiClient.post('/auth/logout');
  },

  async getProfile(): Promise<User> {
    const response = await apiClient.get('/auth/profile');
    return response.data;
  },
};

