import axios from 'axios';

const baseURL =
  import.meta.env.VITE_API_URL ||
  (typeof window !== 'undefined' ? window.location.origin : '');

const instance = axios.create({
  baseURL,
  withCredentials: true,
});

export default instance;
