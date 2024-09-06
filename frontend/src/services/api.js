import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export const loginUser = (data) => axios.post(`${API_URL}/users/login`, data);
export const createAvailability = (data) => axios.post(`${API_URL}/availability/create`, data);
export const getUserAvailability = (userId) => axios.get(`${API_URL}/availability/user/${userId}`);
export const createSession = (data) => axios.post(`${API_URL}/sessions/create`, data);

export const getUserSessions = (userId) => axios.get(`${API_URL}/sessions/user/${userId}`).then(res => res.data);

export const scheduleSession = (data) => axios.post(`${API_URL}/sessions/schedule`, data);

export const updateSession = (id, session) => axios.put(`${API_URL}/sessions/update/${id}`, session).then(res => res.data);

export const deleteSession = (id) => axios.delete(`${API_URL}/sessions/delete/${id}`).then(res => res.data);

export const updateUserPreferences = (preferences) => {
  return axios.put(`${API_URL}/users/preferences`, { userId: localStorage.getItem('email'), preferences }).then(res => res.data);
};
