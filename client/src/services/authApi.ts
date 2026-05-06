export type User = {
  id: string;
  name: string | null;
  email: string;
  createdAt: string;
  updatedAt: string;
};

export type AuthResponse = {
  user: User;
  token: string;
};

export type LoginPayload = {
  email: string;
  password: string;
};

export type SignupPayload = {
  name?: string;
  email: string;
  password: string;
};

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:5050';

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  const data = (await response.json().catch(() => ({}))) as { message?: string };

  if (!response.ok) {
    throw new Error(data.message ?? 'Request failed. Please try again.');
  }

  return data as T;
}

export function signupUser(payload: SignupPayload) {
  return request<AuthResponse>('/api/auth/signup', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function loginUser(payload: LoginPayload) {
  return request<AuthResponse>('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function getCurrentUser(token: string) {
  return request<{ user: User }>('/api/auth/me', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export function logoutUser(token: string | null) {
  return request<{ message: string }>('/api/auth/logout', {
    method: 'POST',
    headers: token
      ? {
          Authorization: `Bearer ${token}`,
        }
      : undefined,
  });
}
