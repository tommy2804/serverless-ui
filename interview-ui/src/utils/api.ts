import axios from 'axios';

function getCookie(name: string): string | null {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    return parts.pop()?.split(';').shift() || null;
  }
  return null;
}

export const baseUrl = `http://localhost:5001/api`;
const api = axios.create({
  baseURL: baseUrl,
});

api.interceptors.request.use((config) => {
  const sessionCookie = getCookie('session');
  if (sessionCookie) {
    config.headers['Cookie'] = `session=${sessionCookie}`;
  }
  return config;
});

export default api;
