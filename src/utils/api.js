import apiAxios from './axios';

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
    me: () => handleAxios(apiAxios.get('/auth/me'))
  },
  teams: {
    getAll: () => handleAxios(apiAxios.get('/teams')),
    getById: (id) => handleAxios(apiAxios.get(`/teams/${id}`)),
    create: (data) => handleAxios(apiAxios.post('/teams', data)),
    update: (id, data) => handleAxios(apiAxios.put(`/teams/${id}`, data)),
    delete: (id) => handleAxios(apiAxios.delete(`/teams/${id}`))
  },
  equipment: {
    getAll: () => handleAxios(apiAxios.get('/equipment')),
    getById: (id) => handleAxios(apiAxios.get(`/equipment/${id}`)),
    getRequests: (id) => handleAxios(apiAxios.get(`/equipment/${id}/requests`)),
    getRequestsCount: (id) => handleAxios(apiAxios.get(`/equipment/${id}/requests/count`)),
    create: (data) => handleAxios(apiAxios.post('/equipment', data)),
    update: (id, data) => handleAxios(apiAxios.put(`/equipment/${id}`, data)),
    delete: (id) => handleAxios(apiAxios.delete(`/equipment/${id}`))
  },
  requests: {
    getAll: () => handleAxios(apiAxios.get('/requests')),
    getManager: () => handleAxios(apiAxios.get('/requests/manager')),
    getTechnician: () => handleAxios(apiAxios.get('/requests/technician')),
    getTechnicians: () => handleAxios(apiAxios.get('/requests/technicians')),
    getCalendar: () => handleAxios(apiAxios.get('/requests/calendar')),
    getById: (id) => handleAxios(apiAxios.get(`/requests/${id}`)),
    create: (data) => handleAxios(apiAxios.post('/requests', data)),
    update: (id, data) => handleAxios(apiAxios.put(`/requests/${id}`, data)),
    assignManager: (id, technicianId) => handleAxios(apiAxios.patch(`/requests/${id}/assign-manager`, { technicianId })),
    assignSelf: (id) => handleAxios(apiAxios.patch(`/requests/${id}/assign-self`)),
    start: (id) => handleAxios(apiAxios.patch(`/requests/${id}/start`)),
    complete: (id, hoursSpent) => handleAxios(apiAxios.patch(`/requests/${id}/complete`, { hoursSpent })),
    scrap: (id, hoursSpent) => handleAxios(apiAxios.patch(`/requests/${id}/scrap`, { hoursSpent })),
    delete: (id) => handleAxios(apiAxios.delete(`/requests/${id}`))
  },
  users: {
    me: () => handleAxios(apiAxios.get('/users/me')),
    updateMe: (data) => handleAxios(apiAxios.put('/users/me', data))
  }
};
