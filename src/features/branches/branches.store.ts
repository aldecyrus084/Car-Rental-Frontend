export type BranchStatus = "Open" | "Closed"

export type Branch = {
  id: string
  name: string
  manager: string
  address: string
  status: BranchStatus
}

export type BranchValues = Omit<Branch, "id">

const STORAGE_KEY = "motionBranches"

const defaultBranches: Branch[] = [
  { id: "1", name: "Westlands", manager: "Grace Wanjiku", address: "Waiyaki Way, Nairobi", status: "Open" },
  { id: "2", name: "Airport branch", manager: "Daniel Otieno", address: "JKIA arrivals, Nairobi", status: "Open" },
  { id: "3", name: "CBD branch", manager: "Faith Mwangi", address: "Kimathi Street, Nairobi", status: "Open" },
]

function isBranch(value: unknown): value is Branch {
  if (typeof value !== "object" || value === null) return false
  const branch = value as Partial<Branch>
  return typeof branch.id === "string"
    && typeof branch.name === "string"
    && typeof branch.manager === "string"
    && typeof branch.address === "string"
    && (branch.status === "Open" || branch.status === "Closed")
}

export function getBranches(): Branch[] {
  if (typeof window === "undefined") return defaultBranches

  try {
    const stored = window.localStorage.getItem(STORAGE_KEY)
    if (!stored) return defaultBranches
    const branches: unknown = JSON.parse(stored)
    return Array.isArray(branches) && branches.every(isBranch) ? branches : defaultBranches
  } catch {
    return defaultBranches
  }
}

export function saveBranches(branches: Branch[]): void {
  if (typeof window === "undefined") return
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(branches))
}