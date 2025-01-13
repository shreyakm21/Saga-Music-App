import axios from 'axios';

// Base URL for the backend server
const API = axios.create({ baseURL: 'http://localhost:3001/api/users' });

export const login = (credentials) => API.post('/login', credentials);
export const signup = (credentials) => API.post('/signup', credentials);

export default API;
