import axios from '@/config/axios.config';

// Employee API
export const employeeApi = {
  filterEmployees: (params = {}) => {
    return axios.post('/api/potta/employees/filter', params);
  },
  getEmployeeById: (id) => {
    return axios.get(`/api/potta/employees/${id}`);
  },
};

// Timesheet API
export const timesheetApi = {
  filterTimesheets: (params = {}) => {
    return axios.post('/api/potta/timesheets/filter', params);
  },
  createTimesheet: (data = {}) => {
    return axios.post('/api/potta/timesheets', data);
  },
  updateTimesheet: (id, data = {}) => {
    return axios.patch(`/api/potta/timesheets/${id}`, data);
  },
  approveTimesheet: (id) => {
    return axios.put(`/api/potta/timesheets/approve/${id}`);
  },
  rejectTimesheet: (id) => {
    return axios.put(`/api/potta/timesheets/reject/${id}`);
  },
};

// Shift API
export const shiftApi = {
  filterShifts: (params = {}) => {
    return axios.post('/api/potta/shifts/filter', params);
  },
  createShift: (data = {}) => {
    return axios.post('/api/potta/shifts', data);
  },
  updateShift: (id, data = {}) => {
    return axios.patch(`/api/potta/shifts/${id}`, data);
  },
  deleteShift: (id) => {
    return axios.delete(`/api/potta/shifts/${id}`);
  },
};
