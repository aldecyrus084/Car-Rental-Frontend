import { apiRequest } from "../../services/api/client"
import { API_ENDPOINTS } from "../../services/api/endpoints"

export type UserStatus = "Active" | "Suspended"

export type StaffUser = {
  name: string
  email: string
  role: string
  branch: string
  status: UserStatus
}

export type CreateUserRequest = {
  firstName: string
  middleName: string | null
  lastName: string
  role: string
  phoneNumber: string
  branch: string
  email: string
  password: string
}

type ApiListResponse<T> = T[] | { data: T[] }
type ApiResponse<T> = T | { data: T }

export async function getUsers(signal?: AbortSignal): Promise<StaffUser[]> {
  const response = await apiRequest<ApiListResponse<StaffUser>>(API_ENDPOINTS.users, { signal })
  return Array.isArray(response) ? response : response.data
}

export async function createUser(user: CreateUserRequest): Promise<StaffUser> {
  const response = await apiRequest<ApiResponse<StaffUser>>(API_ENDPOINTS.users, {
    method: "POST",
    body: JSON.stringify(user),
  })
  return "data" in response ? response.data : response
}

export async function updateUserStatus(email: string, status: UserStatus): Promise<StaffUser> {
  const response = await apiRequest<ApiResponse<StaffUser>>(API_ENDPOINTS.userStatus(email), {
    method: "PATCH",
    body: JSON.stringify({ status }),
  })
  return "data" in response ? response.data : response
}