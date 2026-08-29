import { getDeviceLocale } from '@/lib/locale';

const API_URL = process.env.EXPO_PUBLIC_API_URL ?? 'https://matchbook-production.up.railway.app';
const REQUEST_TIMEOUT_MS = 15000;

export class ApiError extends Error {
  constructor(
    public readonly statusCode: number,
    public readonly code: string,
    message: string,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export async function request<T>(path: string, token: string | null, init?: RequestInit): Promise<T> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  let response: Response;
  try {
    response = await fetch(`${API_URL}${path}`, {
      ...init,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        'Accept-Language': getDeviceLocale(),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(init?.headers ?? {}),
      },
    });
  } catch (err) {
    if (err instanceof Error && err.name === 'AbortError') {
      throw new ApiError(0, 'TIMEOUT', 'A requisição demorou demais para responder.');
    }
    throw new ApiError(0, 'NETWORK_ERROR', 'Não foi possível conectar ao servidor.');
  } finally {
    clearTimeout(timeout);
  }

  if (!response.ok) {
    let code = 'HTTP_ERROR';
    let message = 'Falha na comunicação com a API';
    try {
      const text = await response.text();
      if (text) {
        try {
          const body = JSON.parse(text);
          code = body?.error ?? code;
          message = Array.isArray(body?.message) ? (body.message as string[]).join(', ') : (body?.message ?? message);
        } catch {
          message = text;
        }
      }
    } catch {
      // keep defaults
    }
    throw new ApiError(response.status, code, message);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json();
}

export function withQuery(path: string, params?: Record<string, string | undefined>): string {
  const query = new URLSearchParams();

  Object.entries(params ?? {}).forEach(([key, value]) => {
    if (value) {
      query.set(key, value);
    }
  });

  const suffix = query.toString();
  return suffix ? `${path}?${suffix}` : path;
}
