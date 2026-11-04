export type Customer = {
  customerId: string
  fullName: string
  email: string
  contactNumber: string
  rentals: number
  status: string
  customersNumber?: string
  customerNumber?: string
  firstName?: string
  middleName?: string | null
  lastName?: string
  dateOfBirth?: string
  gender?: string
  phoneNumber?: string
  address?: string
  city?: string
  province?: string
  postalCode?: string | null
  emergencyContactName?: string | null
  emergencyNumber?: string | null
  documents?: CustomerDocument[]
}

export type CustomerDocument = {
  documentId?: string
  fileName: string
  fileUrl?: string
  contentType?: string
}

export type CustomerDetails = Partial<Omit<Customer, "customerId">> & Pick<Customer, "customerId">
export type UpdateCustomerRequest = Partial<Omit<CustomerDetails, "customerId" | "rentals" | "documents">>
export type CustomerStatus = "Active" | "Inactive" | "Blocked"
