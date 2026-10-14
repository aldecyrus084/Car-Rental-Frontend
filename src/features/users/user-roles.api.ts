import { apiRequest } from "../../services/api/client"
import { API_ENDPOINTS } from "../../services/api/endpoints"

const USER_ROLES_COOKIE = "carRentalUserRoles"
const USER_ROLES_COOKIE_MAX_AGE = 60 * 60

export type UserRole = {
  userRoleId: string
  name: string
  description: string
  isActive: boolean
}

type ApiUserRolesResponse = UserRole[] | {
  message?: string
  isSuccess?: boolean
  data: UserRole[]
}

function isUserRole(value: unknown): value is UserRole {
  if (typeof value !== "object" || value === null) return false
  const role = value as Partial<UserRole>
  return typeof role.userRoleId === "string"
    && typeof role.name === "string"
    && typeof role.description === "string"
    && typeof role.isActive === "boolean"
}

export function readCachedUserRoles(): UserRole[] {
  if (typeof document === "undefined") return []

  const cookie = document.cookie
    .split("; ")
    .find((entry) => entry.startsWith(`${USER_ROLES_COOKIE}=`))
  if (!cookie) return []

  try {
    const cachedRoles: unknown = JSON.parse(decodeURIComponent(cookie.slice(USER_ROLES_COOKIE.length + 1)))
    return Array.isArray(cachedRoles) ? cachedRoles.filter(isUserRole).filter((role) => role.isActive) : []
  } catch {
    return []
  }
}

export function cacheUserRoles(roles: UserRole[]): void {
  if (typeof document === "undefined") return

  const secure = window.location.protocol === "https:" ? "; Secure" : ""
  document.cookie = `${USER_ROLES_COOKIE}=${encodeURIComponent(JSON.stringify(roles))}; Path=/; Max-Age=${USER_ROLES_COOKIE_MAX_AGE}; SameSite=Lax${secure}`
}

export async function getUserRoles(signal?: AbortSignal): Promise<UserRole[]> {
  const response = await apiRequest<ApiUserRolesResponse>(API_ENDPOINTS.userRoles, { signal })
  if (!Array.isArray(response) && response.isSuccess === false) {
    throw new Error(response.message || "Unable to load user roles.")
  }

  const roles = Array.isArray(response) ? response : response.data
  return roles.filter((role) => role.isActive)
}