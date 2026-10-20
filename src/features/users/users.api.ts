import { apiRequest } from "../../services/api/client"
import { API_ENDPOINTS } from "../../services/api/endpoints"

export type UserStatus = "Active" | "Inactive"

export type StaffUser = {
  name: string
  email: string
  phoneNumber: string
  role: string
  status: UserStatus
}

type ApiUser = {
  firstName: string
  middleName?: string | null
  lastName: string
  email: string
  phoneNumber: string
  role: string
  isActive: boolean
}

export type CreateUserRequest = {
  firstName: string
  middleName: string | null
  lastName: string
  userRoleId: string
  phoneNumber: string
  branch: string
  email: string
  password: string
}

type ApiListResponse<T> = T[] | { message?: string; isSuccess?: boolean; data: T[] }
type ApiResponse<T> = T | { message?: string; isSuccess?: boolean; data: T }

function toStaffUser(user: ApiUser): StaffUser {
  return {
    name: [user.firstName, user.middleName, user.lastName].filter(Boolean).join(" "),
    email: user.email,
    phoneNumber: user.phoneNumber,
    role: user.role,
    status: user.isActive ? "Active" : "Inactive",
  }
}

export async function getUsers(signal?: AbortSignal): Promise<StaffUser[]> {
  const response = await apiRequest<ApiListResponse<ApiUser>>(API_ENDPOINTS.users, { signal })
  if (!Array.isArray(response) && response.isSuccess === false) {
    throw new Error(response.message || "Unable to load users.")
  }

  const users = Array.isArray(response) ? response : response.data
  return users.map(toStaffUser)
}

export async function createUser(user: CreateUserRequest): Promise<StaffUser> {
  const response = await apiRequest<ApiResponse<ApiUser>>(API_ENDPOINTS.users, {
    method: "POST",
    body: JSON.stringify(user),
  })
  return toStaffUser("data" in response ? response.data : response)
}

export async function updateUserStatus(email: string, status: UserStatus): Promise<StaffUser> {
  const response = await apiRequest<ApiResponse<StaffUser>>(API_ENDPOINTS.userStatus(email), {
    method: "PATCH",
    body: JSON.stringify({ status }),
  })
  return "data" in response ? response.data : response
}