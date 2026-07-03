import apiAxios from './axios';

const getAuthHeaders = () => {
  const token = localStorage.getItem('mainteno_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const handleAxios = async (promise) => {
  try {
    const res = await promise;
    return res.data;
  } catch (err) {
    const message = err?.response?.data?.message || err.message || 'An error occurred';
    throw new Error(message);
  }
};

export const api = {
  auth: {
    register: (data) => handleAxios(apiAxios.post('/auth/register', data)),
    login: (data) => handleAxios(apiAxios.post('/auth/login', data)),
    me: () => handleAxios(apiAxios.get('/auth/me', { headers: getAuthHeaders() }))
  },
  teams: {
    getAll: () => handleAxios(apiAxios.get('/teams', { headers: getAuthHeaders() })),
    getById: (id) => handleAxios(apiAxios.get(`/teams/${id}`, { headers: getAuthHeaders() })),
    create: (data) => handleAxios(apiAxios.post('/teams', data, { headers: { ...getAuthHeaders() } })),
    update: (id, data) => handleAxios(apiAxios.put(`/teams/${id}`, data, { headers: { ...getAuthHeaders() } })),
    delete: (id) => handleAxios(apiAxios.delete(`/teams/${id}`, { headers: getAuthHeaders() }))
  },
  equipment: {
    getAll: () => handleAxios(apiAxios.get('/equipment', { headers: getAuthHeaders() })),
    getById: (id) => handleAxios(apiAxios.get(`/equipment/${id}`, { headers: getAuthHeaders() })),
    getRequests: (id) => handleAxios(apiAxios.get(`/equipment/${id}/requests`, { headers: getAuthHeaders() })),
    getRequestsCount: (id) => handleAxios(apiAxios.get(`/equipment/${id}/requests/count`, { headers: getAuthHeaders() })),
    create: (data) => handleAxios(apiAxios.post('/equipment', data, { headers: { ...getAuthHeaders() } })),
    update: (id, data) => handleAxios(apiAxios.put(`/equipment/${id}`, data, { headers: { ...getAuthHeaders() } })),
    delete: (id) => handleAxios(apiAxios.delete(`/equipment/${id}`, { headers: getAuthHeaders() }))
  },
  requests: {
    getAll: () => handleAxios(apiAxios.get('/requests', { headers: getAuthHeaders() })),
    getManager: () => handleAxios(apiAxios.get('/requests/manager', { headers: getAuthHeaders() })),
    getTechnician: () => handleAxios(apiAxios.get('/requests/technician', { headers: getAuthHeaders() })),
    getTechnicians: () => handleAxios(apiAxios.get('/requests/technicians', { headers: getAuthHeaders() })),
    getCalendar: () => handleAxios(apiAxios.get('/requests/calendar', { headers: getAuthHeaders() })),
    getById: (id) => handleAxios(apiAxios.get(`/requests/${id}`, { headers: getAuthHeaders() })),
    create: (data) => handleAxios(apiAxios.post('/requests', data, { headers: { ...getAuthHeaders() } })),
    update: (id, data) => handleAxios(apiAxios.put(`/requests/${id}`, data, { headers: { ...getAuthHeaders() } })),
    assignManager: (id, technicianId) => handleAxios(apiAxios.patch(`/requests/${id}/assign-manager`, { technicianId }, { headers: { ...getAuthHeaders() } })),
    assignSelf: (id) => handleAxios(apiAxios.patch(`/requests/${id}/assign-self`, {}, { headers: { ...getAuthHeaders() } })),
    start: (id) => handleAxios(apiAxios.patch(`/requests/${id}/start`, {}, { headers: { ...getAuthHeaders() } })),
    complete: (id, hoursSpent) => handleAxios(apiAxios.patch(`/requests/${id}/complete`, { hoursSpent }, { headers: { ...getAuthHeaders() } })),
    scrap: (id, hoursSpent) => handleAxios(apiAxios.patch(`/requests/${id}/scrap`, { hoursSpent }, { headers: { ...getAuthHeaders() } })),
    delete: (id) => handleAxios(apiAxios.delete(`/requests/${id}`, { headers: getAuthHeaders() }))
  },
  users: {
    me: () => handleAxios(apiAxios.get('/users/me', { headers: getAuthHeaders() })),
    updateMe: (data) => handleAxios(apiAxios.put('/users/me', data, { headers: { ...getAuthHeaders() } }))
  }
};
