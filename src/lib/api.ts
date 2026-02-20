import axios, { AxiosError } from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

// Interceptor para adicionar token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('adjpa_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor para tratamento de erros
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('adjpa_token');
      localStorage.removeItem('adjpa_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth
export const authApi = {
  login: async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password });
    if (response.data.token) {
      localStorage.setItem('adjpa_token', response.data.token);
      localStorage.setItem('adjpa_user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  logout: async () => {
    try {
      await api.post('/auth/logout');
    } finally {
      localStorage.removeItem('adjpa_token');
      localStorage.removeItem('adjpa_user');
    }
  },

  me: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },

  changePassword: async (currentPassword: string, newPassword: string) => {
    const response = await api.post('/auth/change-password', {
      currentPassword,
      newPassword,
    });
    return response.data;
  },
};

// Members
export const membersApi = {
  list: async (params?: any) => {
    const response = await api.get('/members', { params });
    return response.data;
  },

  get: async (id: string) => {
    const response = await api.get(`/members/${id}`);
    return response.data;
  },

  create: async (data: any) => {
    const response = await api.post('/members', data);
    return response.data;
  },

  update: async (id: string, data: any) => {
    const response = await api.put(`/members/${id}`, data);
    return response.data;
  },

  delete: async (id: string) => {
    const response = await api.delete(`/members/${id}`);
    return response.data;
  },
};

// Employees
export const employeesApi = {
  list: async (params?: any) => {
    const response = await api.get('/employees', { params });
    return response.data;
  },

  get: async (id: string) => {
    const response = await api.get(`/employees/${id}`);
    return response.data;
  },

  create: async (data: any) => {
    const response = await api.post('/employees', data);
    return response.data;
  },

  update: async (id: string, data: any) => {
    const response = await api.put(`/employees/${id}`, data);
    return response.data;
  },

  updatePhoto: async (id: string, photo_url: string) => {
    const response = await api.patch(`/employees/${id}/photo`, { photo_url });
    return response.data;
  },

  delete: async (id: string) => {
    const response = await api.delete(`/employees/${id}`);
    return response.data;
  },
};

// Financial
export const financialApi = {
  transactions: {
    list: async (params?: any) => {
      const response = await api.get('/financial/transactions', { params });
      return response.data;
    },

    get: async (id: string) => {
      const response = await api.get(`/financial/transactions/${id}`);
      return response.data;
    },

    create: async (data: any) => {
      const response = await api.post('/financial/transactions', data);
      return response.data;
    },

    update: async (id: string, data: any) => {
      const response = await api.put(`/financial/transactions/${id}`, data);
      return response.data;
    },

    delete: async (id: string) => {
      const response = await api.delete(`/financial/transactions/${id}`);
      return response.data;
    },
  },

  accounts: {
    list: async (params?: any) => {
      const response = await api.get('/financial/accounts', { params });
      return response.data;
    },
  },
};

// Units
export const unitsApi = {
  list: async () => {
    const response = await api.get('/units');
    return response.data;
  },

  get: async (id: string) => {
    const response = await api.get(`/units/${id}`);
    return response.data;
  },

  create: async (data: any) => {
    const response = await api.post('/units', data);
    return response.data;
  },

  update: async (id: string, data: any) => {
    const response = await api.put(`/units/${id}`, data);
    return response.data;
  },
};

// Ministries
export const ministriesApi = {
  list: async (params?: any) => {
    const response = await api.get('/ministries', { params });
    return response.data;
  },

  get: async (id: string) => {
    const response = await api.get(`/ministries/${id}`);
    return response.data;
  },

  create: async (data: any) => {
    const response = await api.post('/ministries', data);
    return response.data;
  },

  update: async (id: string, data: any) => {
    const response = await api.put(`/ministries/${id}`, data);
    return response.data;
  },

  delete: async (id: string) => {
    const response = await api.delete(`/ministries/${id}`);
    return response.data;
  },
};

// Cells
export const cellsApi = {
  list: async (params?: any) => {
    const response = await api.get('/cells', { params });
    return response.data;
  },

  get: async (id: string) => {
    const response = await api.get(`/cells/${id}`);
    return response.data;
  },

  create: async (data: any) => {
    const response = await api.post('/cells', data);
    return response.data;
  },

  update: async (id: string, data: any) => {
    const response = await api.put(`/cells/${id}`, data);
    return response.data;
  },

  delete: async (id: string) => {
    const response = await api.delete(`/cells/${id}`);
    return response.data;
  },
};

// Contributions
export const contributionsApi = {
  list: async (params?: any) => {
    const response = await api.get('/contributions', { params });
    return response.data;
  },

  get: async (id: string) => {
    const response = await api.get(`/contributions/${id}`);
    return response.data;
  },

  create: async (data: any) => {
    const response = await api.post('/contributions', data);
    return response.data;
  },

  update: async (id: string, data: any) => {
    const response = await api.put(`/contributions/${id}`, data);
    return response.data;
  },

  delete: async (id: string) => {
    const response = await api.delete(`/contributions/${id}`);
    return response.data;
  },

  stats: async (params?: any) => {
    const response = await api.get('/contributions/stats', { params });
    return response.data;
  },
};

export default api;

// Upload API
export const uploadApi = {
  uploadPhoto: async (file: File, type: string, id: string) => {
    const formData = new FormData();
    formData.append('photo', file);
    formData.append('type', type);
    formData.append('id', id);

    const response = await api.post('/upload/photo', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  deletePhoto: async (filename: string) => {
    const response = await api.delete(`/upload/photo/${filename}`);
    return response.data;
  },

  getPhotoUrl: (filename: string) => {
    // Construir URL completa para a imagem
    const baseUrl = API_URL.replace('/api', '');
    return `${baseUrl}/uploads/${filename}`;
  },
};
