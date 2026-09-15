export const API_BASE = "/api";

export async function apiFetch<T = any>(path: string, options?: RequestInit): Promise<T> {
  const token = localStorage.getItem("pm_token");
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options?.headers,
    },
  });

  if (res.status === 401) {
    localStorage.removeItem("pm_token");
    window.location.href = "/login";
    throw new Error("Unauthorized");
  }

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error || "Request failed");
  }

  return res.json();
}

export const api = {
  get: <T = any>(path: string) => apiFetch<T>(path),
  post: <T = any>(path: string, data?: any) => apiFetch<T>(path, { method: "POST", body: JSON.stringify(data) }),
  put: <T = any>(path: string, data?: any) => apiFetch<T>(path, { method: "PUT", body: JSON.stringify(data) }),
  delete: <T = any>(path: string) => apiFetch<T>(path, { method: "DELETE" }),
};
