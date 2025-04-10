import Axios, { AxiosResponse, InternalAxiosRequestConfig } from 'axios';

const axios = Axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
});

// Request interceptor to add headers and log requests
axios.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  // Add the required headers to every request
  config.headers = config.headers || {};
  config.headers['Content-Type'] = 'application/json',
  config.headers['accept'] = '*/*',
  config.headers['branchId'] = 'f7b1b3b0-0b1b-4b3b-8b1b-0b1b3b0b1b3b';
  config.headers['orgId'] = '8f79d19a-5319-4783-8ddc-c863d98ecc16';
  config.headers['userId'] = '8f79d19a-5319-4783-8ddc-c863d98ecc16';

  // Log the outgoing request
  console.log('REQUEST:', {
    url: (config.baseURL || '') + (config.url || ''),
    method: config.method,
    headers: config.headers,
    data: config.data,
    params: config.params
  });

  return config;
});

// Response interceptor to log responses
axios.interceptors.response.use(
  (response: AxiosResponse) => {
    // Log successful response
    console.log('RESPONSE:', {
      url: response.config.url,
      status: response.status,
      statusText: response.statusText,
      headers: response.headers,
      data: response.data
    });

    return response;
  },
  (error) => {
    // Log error response
    console.log('RESPONSE ERROR:', {
      url: error.config?.url,
      status: error.response?.status,
      statusText: error.response?.statusText,
      headers: error.response?.headers,
      data: error.response?.data,
      message: error.message
    });

    return Promise.reject(error);
  }
);

export default axios;

// anywhere where u need axios, import it from this directory and not from axios itself
