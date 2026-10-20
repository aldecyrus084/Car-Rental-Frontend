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

export function getBranches(): Branch[] {
  if (typeof window === "undefined") return []

  try {
    const stored = window.localStorage.getItem(STORAGE_KEY)
    if (!stored) return []
    const branches: unknown = JSON.parse(stored)
    return Array.isArray(branches) && branches.every(isBranch) ? branches : []
  } catch {
    return []
  }
}

export function saveBranches(branches: Branch[]): void {
  if (typeof window === "undefined") return
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(branches))
}