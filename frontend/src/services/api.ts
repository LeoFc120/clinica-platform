// URL centralizada del backend
export const API_URL = 'http://localhost:4000/api/v1';

// Función estándar para hacer peticiones al backend
export const apiFetch = async (endpoint: string, options: RequestInit = {}) => {
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Error en la petición al servidor');
  }

  return data; // Retorna el JSON ya procesado
};
