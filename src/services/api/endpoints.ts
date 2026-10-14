export const API_ENDPOINTS = {
  users: "/User",
  userRoles: "/user-role",
  userStatus: (email: string) => `/User/${encodeURIComponent(email)}/status`,
} as const