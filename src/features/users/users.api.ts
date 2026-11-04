export type UserStatus = "Active" | "Inactive"

export type StaffUser = {
  userId : string
  firstName: string
  middleName: string | null
  lastName: string
  name: string
  email: string
  phoneNumber: string
  role: string
  userRoleId: string
  branch: string
  status: UserStatus
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

export type UpdateUserRequest = Omit<CreateUserRequest, "password"> & {
  password?: string
  isActive: boolean
}