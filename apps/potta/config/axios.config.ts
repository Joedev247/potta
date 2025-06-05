import Axios, {
  AxiosResponse,
  InternalAxiosRequestConfig,
  AxiosHeaders,
} from 'axios';

const axios = Axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
});

// Request interceptor to add headers and log requests
axios.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  // Ensure headers is an AxiosHeaders instance
  if (!config.headers) {
    config.headers = new AxiosHeaders();
  }

  // Convert to AxiosHeaders if it's a plain object
  if (!(config.headers instanceof AxiosHeaders)) {
    config.headers = new AxiosHeaders(config.headers);
  }

  // Only set Content-Type to application/json if it's not already set
  // This allows the uploadImage function to set its own Content-Type
  if (
    !config.headers.get('Content-Type') &&
    !config.data?.toString().includes('FormData')
  ) {
    config.headers.set('Content-Type', 'application/json');
  }

  // For FormData (file uploads), don't set Content-Type as the browser will set it with the boundary
  if (config.data instanceof FormData) {
    config.headers.delete('Content-Type');
  }

  config.headers.set('accept', '*/*');
  config.headers.set('branchId', 'f7b1b3b0-0b1b-4b3b-8b1b-0b1b3b0b1b3b');
  config.headers.set('orgId', '8f79d19a-5319-4783-8ddc-c863d98ecc16');
  config.headers.set('userId', '8f79d19a-5319-4783-8ddc-c863d98ecc16');

  // Log the outgoing request
  console.log('REQUEST:', {
    url: (config.baseURL || '') + (config.url || ''),
    method: config.method,
    headers: config.headers.toJSON(), // Convert to plain object for logging
    data:
      config.data instanceof FormData ? 'FormData (file upload)' : config.data,
    params: config.params,
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
      data: response.data,
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
      message: error.message,
    });

    return Promise.reject(error);
  }
);

export default axios;
