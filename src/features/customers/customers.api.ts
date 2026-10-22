import { apiRequest } from "../../services/api/client"
import { API_ENDPOINTS } from "../../services/api/endpoints"

export type Customer = {
  customerId: string
  fullName: string
  email: string
  contactNumber: string
  rentals: number
  status: string
}

type ApiListResponse<T> = T[] | { message?: string; isSuccess?: boolean; data: T[] }

function isCustomer(value: unknown): value is Customer {
  if (typeof value !== "object" || value === null) return false
  const customer = value as Partial<Customer>
  return typeof customer.customerId === "string"
    && typeof customer.fullName === "string"
    && typeof customer.email === "string"
    && typeof customer.contactNumber === "string"
    && typeof customer.rentals === "number"
    && typeof customer.status === "string"
}

export async function getCustomers(signal?: AbortSignal): Promise<Customer[]> {
  const response = await apiRequest<ApiListResponse<Customer>>(API_ENDPOINTS.customers, { signal })
  if (!Array.isArray(response) && response.isSuccess === false) {
    throw new Error(response.message || "Unable to load customers.")
  }

  const customers = Array.isArray(response) ? response : response.data
  if (!customers.every(isCustomer)) throw new Error("The server returned invalid customer data.")
  return customers
}
