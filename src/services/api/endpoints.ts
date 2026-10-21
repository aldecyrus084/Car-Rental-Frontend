export const API_ENDPOINTS = {
  branches: "/Branch",
  branch: (id: string) => `/branch/${encodeURIComponent(id)}`,
  users: "/User",
  user: (email: string) => `/User/${encodeURIComponent(email)}`,
  userRoles: "/user-role",
  userRole: (id: string) => `/user-role/${encodeURIComponent(id)}`,
  userStatus: (email: string) => `/User/${encodeURIComponent(email)}/status`,
} as const