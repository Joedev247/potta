import axios from '@/config/axios.config';

// Employee API
export const employeeApi = {
  filterEmployees: (params = {}) => {
    return axios.post('/employees/filter', params);
  },
  getEmployeeById: (id) => {
    return axios.get(`/employees/${id}`);
  },
};

// Timesheet API
export const timesheetApi = {
  filterTimesheets: (params = {}) => {
    return axios.post('/api/timesheets/filter', params);
  },
  createTimesheet: (data = {}) => {
    return axios.post('/api/timesheets', data);
  },
  updateTimesheet: (id, data = {}) => {
    return axios.patch(`/api/timesheets/${id}`, data);
  },
  approveTimesheet: (id) => {
    return axios.put(`/api/timesheets/approve/${id}`);
  },
  rejectTimesheet: (id) => {
    return axios.put(`/api/timesheets/reject/${id}`);
  },
};

// Shift API
export const shiftApi = {
  filterShifts: (params = {}) => {
    return axios.post('/api/shifts/filter', params);
  },
  createShift: (data = {}) => {
    return axios.post('/api/shifts', data);
  },
  updateShift: (id, data = {}) => {
    return axios.patch(`/api/shifts/${id}`, data);
  },
  deleteShift: (id) => {
    return axios.delete(`/api/shifts/${id}`);
  },
};
