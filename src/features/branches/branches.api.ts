import { apiRequest } from "../../services/api/client"
import { API_ENDPOINTS } from "../../services/api/endpoints"
import type { Branch, BranchValues } from "./branches.store"

type ApiListResponse<T> = T[] | { message?: string; isSuccess?: boolean; data: T[] }
type ApiResponse<T> = T | { message?: string; isSuccess?: boolean; data: T }

function isBranch(value: unknown): value is Branch {
  if (typeof value !== "object" || value === null) return false
  const branch = value as Partial<Branch>
  return typeof branch.branchId === "string"
    && typeof branch.name === "string"
    && typeof branch.address === "string"
    && typeof branch.city === "string"
    && typeof branch.province === "string"
    && typeof branch.contactNumber === "string"
    && typeof branch.isActive === "boolean"
}

function unwrapBranch(response: ApiResponse<Branch>, errorMessage: string): Branch {
  if (typeof response === "object" && response !== null && "isSuccess" in response && response.isSuccess === false) {
    throw new Error(response.message || errorMessage)
  }

  const branch = typeof response === "object" && response !== null && "data" in response
    ? response.data
    : response
  if (!isBranch(branch)) throw new Error("The server did not return a valid branch.")
  return branch
}

export async function getBranches(signal?: AbortSignal): Promise<Branch[]> {
  const response = await apiRequest<ApiListResponse<Branch>>(API_ENDPOINTS.branches, { signal })
  if (!Array.isArray(response) && response.isSuccess === false) {
    throw new Error(response.message || "Unable to load branches.")
  }

  const branches = Array.isArray(response) ? response : response.data
  if (!branches.every(isBranch)) throw new Error("The server returned invalid branch data.")
  return branches
}

export async function getBranch(id: string, signal?: AbortSignal): Promise<Branch> {
  const response = await apiRequest<ApiResponse<Branch>>(API_ENDPOINTS.branch(id), { signal })
  return unwrapBranch(response, "Unable to load branch.")
}

export async function createBranch(values: BranchValues): Promise<Branch> {
  const response = await apiRequest<ApiResponse<Branch>>(API_ENDPOINTS.branches, {
    method: "POST",
    body: JSON.stringify(values),
  })
  return unwrapBranch(response, "Unable to create branch.")
}

export async function updateBranch(id: string, values: BranchValues): Promise<Branch> {
  const response = await apiRequest<ApiResponse<Branch>>(API_ENDPOINTS.branch(id), {
    method: "PUT",
    body: JSON.stringify(values),
  })
  return unwrapBranch(response, "Unable to update branch.")
}

export async function deleteBranch(id: string): Promise<void> {
  await apiRequest<unknown>(API_ENDPOINTS.branch(id), { method: "PUT" })
}
