const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || "/api").replace(/\/$/, "")

type ApiErrorBody = {
  message?: string
  error?: string
}

export class ApiError extends Error {
  readonly status: number

  constructor(message: string, status: number) {
    super(message)
    this.name = "ApiError"
    this.status = status
  }
}

export async function apiRequest<T>(path: string, init: RequestInit = {}): Promise<T> {
  const headers = new Headers(init.headers)
  headers.set("Accept", "application/json")

  if (init.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json")
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers,
    credentials: "include",
  })

  const contentType = response.headers.get("content-type") ?? ""
  const body: unknown = contentType.includes("application/json")
    ? await response.json()
    : await response.text()

  if (!response.ok) {
    const errorBody = typeof body === "object" && body !== null ? body as ApiErrorBody : undefined
    const message = errorBody?.message || errorBody?.error || response.statusText || "Request failed"
    throw new ApiError(message, response.status)
  }

  return body as T
}