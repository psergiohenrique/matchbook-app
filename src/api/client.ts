const API_URL = process.env.EXPO_PUBLIC_API_URL ?? 'https://matchbook-production.up.railway.app';

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
  const response = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(init?.headers ?? {}),
    },
  });

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
