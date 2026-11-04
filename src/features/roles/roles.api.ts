import { API_REQUEST } from "../../types/apiRequest"
import { USER_ROLES_URI } from "../../services/api/endpoints"


export type UserRole = {
  userRoleId: string
  name: string
  description: string
  isActive: boolean
}

export type CreateUserRoleRequest = {
  name: string
  description: string
}

export async function getRoles(): Promise<UserRole[]> {
  const response = await API_REQUEST<UserRole[]>(USER_ROLES_URI, {
    method: "GET",
  })

  if (!response.data) {
    throw new Error("The roles response did not include role data.")
  }

  return response.data
}