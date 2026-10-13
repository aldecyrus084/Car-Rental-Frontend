export const API_ENDPOINTS = {
  users: "/users",
  userStatus: (email: string) => `/users/${encodeURIComponent(email)}/status`,
} as const