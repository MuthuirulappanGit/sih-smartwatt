const API_BASE = '/api/v1';

export async function apiRequest<T = any>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const defaultHeaders: HeadersInit = {
    'Content-Type': 'application/json',
  };

  const config: RequestInit = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
    credentials: 'include',
  };

  const response = await fetch(`${API_BASE}${endpoint}`, config);
  const responseText = await response.text();
  let data: T & { success?: boolean; message?: string };

  try {
    data = responseText ? JSON.parse(responseText) : ({} as T & { success?: boolean; message?: string });
  } catch {
    throw new Error(`API request failed (${response.status})`);
  }

  if (!response.ok || data.success === false) {
    throw new Error(data.message || `API request failed (${response.status})`);
  }

  return data;
}
