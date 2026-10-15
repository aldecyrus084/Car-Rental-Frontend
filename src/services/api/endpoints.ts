export const API_ENDPOINTS = {
  users: "/User",
  userRoles: "/user-role",
  userRole: (id: string) => `/user-role/${encodeURIComponent(id)}`,
  userStatus: (email: string) => `/User/${encodeURIComponent(email)}/status`,
} as const