const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4610/api';

async function fetchApi(path: string, options: RequestInit = {}) {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: 'Bir hata oluştu' }));
    throw new Error(error.message || `HTTP ${res.status}`);
  }

  return res.json();
}

export const api = {
  login: (data: { email: string; password: string }) =>
    fetchApi('/auth/login', { method: 'POST', body: JSON.stringify(data) }),

  register: (data: { email: string; password: string; name: string }) =>
    fetchApi('/auth/register', { method: 'POST', body: JSON.stringify(data) }),

  getProfile: () => fetchApi('/auth/profile'),

  health: () => fetchApi('/health'),

  getBatches: (status?: string) => fetchApi(`/batches${status ? `?status=${status}` : ''}`),
  getBatch: (id: string) => fetchApi(`/batches/${id}`),
  createBatch: (data: any) => fetchApi('/batches', { method: 'POST', body: JSON.stringify(data) }),
  updateBatch: (id: string, data: any) => fetchApi(`/batches/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteBatch: (id: string) => fetchApi(`/batches/${id}`, { method: 'DELETE' }),
  getBatchStats: () => fetchApi('/batches/stats'),

  getAgingRooms: () => fetchApi('/aging-rooms'),
  getAgingRoom: (id: string) => fetchApi(`/aging-rooms/${id}`),
  createAgingRoom: (data: any) => fetchApi('/aging-rooms', { method: 'POST', body: JSON.stringify(data) }),
  updateAgingRoom: (id: string, data: any) => fetchApi(`/aging-rooms/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteAgingRoom: (id: string) => fetchApi(`/aging-rooms/${id}`, { method: 'DELETE' }),

  getRecipes: () => fetchApi('/recipes'),
  getRecipe: (id: string) => fetchApi(`/recipes/${id}`),
  createRecipe: (data: any) => fetchApi('/recipes', { method: 'POST', body: JSON.stringify(data) }),
  updateRecipe: (id: string, data: any) => fetchApi(`/recipes/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteRecipe: (id: string) => fetchApi(`/recipes/${id}`, { method: 'DELETE' }),

  getQualityChecks: (batchId?: string) => fetchApi(`/quality-checks${batchId ? `?batchId=${batchId}` : ''}`),
  createQualityCheck: (data: any) => fetchApi('/quality-checks', { method: 'POST', body: JSON.stringify(data) }),

  getInventory: () => fetchApi('/inventory'),
  getInventorySummary: () => fetchApi('/inventory/summary'),
  createInventory: (data: any) => fetchApi('/inventory', { method: 'POST', body: JSON.stringify(data) }),
  updateInventory: (id: string, data: any) => fetchApi(`/inventory/${id}`, { method: 'PUT', body: JSON.stringify(data) }),

  getCustomers: () => fetchApi('/customers'),
  getCustomer: (id: string) => fetchApi(`/customers/${id}`),
  createCustomer: (data: any) => fetchApi('/customers', { method: 'POST', body: JSON.stringify(data) }),
  updateCustomer: (id: string, data: any) => fetchApi(`/customers/${id}`, { method: 'PUT', body: JSON.stringify(data) }),

  getOrders: (status?: string) => fetchApi(`/orders${status ? `?status=${status}` : ''}`),
  getOrder: (id: string) => fetchApi(`/orders/${id}`),
  createOrder: (data: any) => fetchApi('/orders', { method: 'POST', body: JSON.stringify(data) }),
  updateOrder: (id: string, data: any) => fetchApi(`/orders/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  getOrderStats: () => fetchApi('/orders/stats'),
};
