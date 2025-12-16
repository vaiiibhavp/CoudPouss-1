/**
 * API client utilities with error handling
 */

import { ApiResponse } from '@/types';
import { setTokens, logout } from '../lib/redux/authSlice';
import { handleError, NetworkError } from '@/lib/errors';
import { API_ENDPOINTS } from '@/constants/api';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || '/api';

// Lazy import store to avoid circular dependency
let storeInstance: any = null;
function getStore() {
  if (!storeInstance) {
    // Use dynamic import to break circular dependency
    const storeModule = require('@/lib/redux/store');
    storeInstance = storeModule.store;
  }
  return storeInstance;
}

/**
 * Custom fetch wrapper with error handling
 */
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  try {
    const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`;
    
     // Get access token from Redux (lazy import to avoid circular dependency)
    const store = getStore();
    const { accessToken } = store.getState().auth;
    let token = accessToken;

    let headers = {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
    }

        // Make the API request
    const response = await fetch(url, {
      ...options,
      headers,
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      return {
        success: false,
        error: {
          message: data?.message || `HTTP error! status: ${response.status}`,
          code: data?.code,
          fields: data?.fields,
        },
      };
    }
    
    return { success: true, data };
  } catch (error) {
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new NetworkError('Network request failed. Please check your connection.');
    }
    throw error;
  }
}

/**
 * GET request
 */
export async function apiGet<T>(endpoint: string): Promise<ApiResponse<T>> {
  return apiRequest<T>(endpoint, {
    method: 'GET',
  });
}

/**
 * POST request
 */
export async function apiPost<T>(
  endpoint: string,
  body?: unknown
): Promise<ApiResponse<T>> {
  return apiRequest<T>(endpoint, {
    method: 'POST',
    body: body ? JSON.stringify(body) : undefined,
  });
}

/**
 * PUT request
 */
export async function apiPut<T>(
  endpoint: string,
  body?: unknown
): Promise<ApiResponse<T>> {
  return apiRequest<T>(endpoint, {
    method: 'PUT',
    body: body ? JSON.stringify(body) : undefined,
  });
}

/**
 * DELETE request
 */
export async function apiDelete<T>(endpoint: string): Promise<ApiResponse<T>> {
  return apiRequest<T>(endpoint, {
    method: 'DELETE',
  });
}

/**
 * Handle API errors consistently
 */
export function handleApiError(error: unknown): {
  message: string;
  statusCode: number;
  code?: string;
} {
  return handleError(error);
}

