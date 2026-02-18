// src/lib/api.ts
import { useQuery, useMutation, UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import axios from 'axios';
import type { Conversation, Message } from "@/types/chat"; // adjust if path is different

// Base URL from .env (falls back to localhost in development)
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// Helper to get auth token (adjust according to how you store it)
const getToken = () => localStorage.getItem('token') || '';

// Basic fetch wrapper with auth & error handling
export async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const url = `${API_BASE}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;

  const headers = {
    'Content-Type': 'application/json',
    ...(getToken() && { Authorization: `Bearer ${getToken()}` }),
    ...options.headers,
  };

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || `Request failed: ${response.status}`);
  }

  return response.json() as Promise<T>;
}

// Axios instance (optional, but kept since you had it)
export const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // You can show toast here later
    return Promise.reject(error);
  },
);

// React Query helpers

export function useApiQuery<T>(
  key: string | string[],
  endpoint: string,
  options?: Omit<UseQueryOptions<T>, 'queryKey' | 'queryFn'>,
) {
  return useQuery<T>({
    queryKey: Array.isArray(key) ? key : [key],
    queryFn: () => apiFetch<T>(endpoint),
    ...options,
  });
}

export function useApiMutation<TData, TVariables = unknown>(
  mutationFn: (variables: TVariables) => Promise<TData>,
  options?: Omit<UseMutationOptions<TData, Error, TVariables>, 'mutationFn'>,
) {
  return useMutation({
    mutationFn,
    ...options,
  });
}