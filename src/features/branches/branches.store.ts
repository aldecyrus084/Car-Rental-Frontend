import { BRANCH_URI } from "../../services/api/endpoints"
import { API_REQUEST } from "../../types/apiRequest"

export type Branch = {
  branchId: string
  name: string
  address: string
  city: string
  province: string
  contactNumber: string
  isActive: boolean
}

export type BranchValues = Omit<Branch, "branchId">

const STORAGE_KEY = "motionBranches"

export async function getBranches(): Promise<Branch[]> {
  try
  {
    const response = await API_REQUEST<Branch[]>(BRANCH_URI);
    console.log(response);

    return Array.isArray(response.data) ? response.data : [];
  }
  catch(error)
  {
    console.error(error);
    return [];
  }
}

export function saveBranches(branches: Branch[]): void {
  if (typeof window === "undefined") return
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(branches))
}