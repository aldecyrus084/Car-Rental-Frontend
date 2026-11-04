import { useState, type FormEvent } from "react"
import { Icon } from "../AdminSidebar"
import CarLoadingModal from "../../../components/CarLoadingModal"
import type { CustomerDetails, CustomerStatus, UpdateCustomerRequest } from "../../../features/customers/customers.api"

type CustomerFormValues = {
  firstName: string
  middleName: string
  lastName: string
  dateOfBirth: string
  gender: string
  email: string
  phoneNumber: string
  address: string
  city: string
  province: string
  postalCode: string
  emergencyContactName: string
  emergencyNumber: string
  status: CustomerStatus
}

type UpdateCustomerFormProps = {
  customer: CustomerDetails
  onClose: () => void
  onSave: (changes: UpdateCustomerRequest) => Promise<void>
  onStatusChange: (status: CustomerStatus) => Promise<void>
}

const inputClass = "mt-1.5 h-10 w-full rounded-lg border border-[#e1e5dc] bg-white px-3 text-sm font-normal text-[#202720] outline-none focus:border-[#81945e]"
const textFields = [
  ["firstName", "First name", "text"],
  ["middleName", "Middle name", "text"],
  ["lastName", "Last name", "text"],
  ["dateOfBirth", "Date of birth", "date"],
  ["email", "Email", "email"],
  ["phoneNumber", "Phone number", "tel"],
  ["address", "Street address", "text"],
  ["city", "City", "text"],
  ["province", "Province", "text"],
  ["postalCode", "Postal code", "text"],
  ["emergencyContactName", "Emergency contact name", "text"],
  ["emergencyNumber", "Emergency number", "tel"],
] as const

function UpdateCustomerForm({ customer, onClose, onSave, onStatusChange }: UpdateCustomerFormProps) {
  const [values, setValues] = useState<CustomerFormValues>(() => ({
    firstName: customer.firstName ?? "",
    middleName: customer.middleName ?? "",
    lastName: customer.lastName ?? "",
    dateOfBirth: customer.dateOfBirth?.slice(0, 10) ?? "",
    gender: customer.gender ?? "",
    email: customer.email ?? "",
    phoneNumber: customer.phoneNumber ?? customer.contactNumber ?? "",
    address: customer.address ?? "",
    city: customer.city ?? "",
    province: customer.province ?? "",
    postalCode: customer.postalCode ?? "",
    emergencyContactName: customer.emergencyContactName ?? "",
    emergencyNumber: customer.emergencyNumber ?? "",
    status: (customer.status === "Blocked" || customer.status === "Inactive" ? customer.status : "Active"),
  }))
  const [isSaving, setIsSaving] = useState(false)
  const [isSavingStatus, setIsSavingStatus] = useState(false)
  const [saveError, setSaveError] = useState("")
  const [statusError, setStatusError] = useState("")

  const submitDetails = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSaveError("")
    const changes: UpdateCustomerRequest = {}
    const originalValues: Record<keyof CustomerFormValues, string> = {
      firstName: customer.firstName ?? "",
      middleName: customer.middleName ?? "",
      lastName: customer.lastName ?? "",
      dateOfBirth: customer.dateOfBirth?.slice(0, 10) ?? "",
      gender: customer.gender ?? "",
      email: customer.email ?? "",
      phoneNumber: customer.phoneNumber ?? customer.contactNumber ?? "",
      address: customer.address ?? "",
      city: customer.city ?? "",
      province: customer.province ?? "",
      postalCode: customer.postalCode ?? "",
      emergencyContactName: customer.emergencyContactName ?? "",
      emergencyNumber: customer.emergencyNumber ?? "",
      status: customer.status === "Blocked" || customer.status === "Inactive" ? customer.status : "Active",
    }

    textFields.forEach(([key]) => {
      if (values[key] !== originalValues[key]) {
        if (key === "middleName" || key === "postalCode" || key === "emergencyContactName" || key === "emergencyNumber") {
          changes[key] = values[key].trim() || null
        } else {
          changes[key] = values[key].trim()
        }
      }
    })
    if (values.gender !== originalValues.gender) changes.gender = values.gender

    if (Object.keys(changes).length === 0) {
      onClose()
      return
    }

    setIsSaving(true)
    try {
      await onSave(changes)
      onClose()
    } catch (error: unknown) {
      setSaveError(error instanceof Error ? error.message : "Unable to update customer.")
    } finally {
      setIsSaving(false)
    }
  }

  const submitStatus = async () => {
    setStatusError("")
    if (values.status === (customer.status ?? "Active")) return

    setIsSavingStatus(true)
    try {
      await onStatusChange(values.status)
    } catch (error: unknown) {
      setStatusError(error instanceof Error ? error.message : "Unable to update customer status.")
    } finally {
      setIsSavingStatus(false)
    }
  }

  return <><div role="presentation" className="fixed inset-0 z-[55] grid place-items-center bg-black/40 p-4" onMouseDown={(event) => { if (event.target === event.currentTarget && !isSaving && !isSavingStatus) onClose() }}>
    <section role="dialog" aria-modal="true" aria-labelledby="update-customer-title" className="max-h-[calc(100vh-2rem)] w-full max-w-4xl overflow-y-auto rounded-xl bg-white p-5 shadow-2xl sm:p-6">
      <div className="flex items-start justify-between gap-4">
        <div><h2 id="update-customer-title" className="text-lg font-semibold">Update customer</h2><p className="mt-1 text-xs text-[#858d82]">Only changed fields are sent. Customer ID: {customer.customerId}</p></div>
        <button type="button" aria-label="Close update customer form" onClick={onClose} disabled={isSaving || isSavingStatus} className="rounded-lg p-1.5 text-[#788077] hover:bg-[#f2f4ef] disabled:opacity-50"><Icon name="close" className="h-5 w-5" /></button>
      </div>
      <form onSubmit={(event) => void submitDetails(event)} className="mt-5">
        <div className="grid gap-x-4 gap-y-3 sm:grid-cols-2 lg:grid-cols-3">
          {textFields.map(([key, label, type]) => <label key={key} className="block text-xs font-medium text-[#596257]">{label}<input type={type} autoComplete={key === "firstName" ? "given-name" : key === "middleName" ? "additional-name" : key === "lastName" ? "family-name" : key === "email" ? "email" : key === "phoneNumber" ? "tel" : "off"} value={values[key]} onChange={(event) => setValues((current) => ({ ...current, [key]: event.target.value }))} className={inputClass} /></label>)}
          <label className="block text-xs font-medium text-[#596257]">Gender<select value={values.gender} onChange={(event) => setValues((current) => ({ ...current, gender: event.target.value }))} className={`${inputClass} bg-white`}><option value="">Not specified</option><option>Female</option><option>Male</option><option>Non-binary</option><option>Prefer not to say</option></select></label>
        </div>
        <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-[#edf0e9] pt-4">
          {saveError && <p role="alert" className="text-xs text-[#a35e4b]">{saveError}</p>}
          <div className="ml-auto flex gap-2">
            <button type="button" onClick={onClose} disabled={isSaving || isSavingStatus} className="rounded-lg border border-[#e1e5dc] px-4 py-2.5 text-xs font-semibold text-[#596257] disabled:opacity-50">Cancel</button>
            <button type="submit" disabled={isSaving || isSavingStatus} className="rounded-lg bg-[#192820] px-4 py-2.5 text-xs font-semibold text-white disabled:cursor-wait disabled:opacity-60">{isSaving ? "Saving…" : "Save changed information"}</button>
          </div>
        </div>
      </form>
      <section className="mt-5 rounded-lg border border-[#e7e9e2] bg-[#fbfcf9] p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div><h3 className="text-sm font-semibold text-[#343d34]">Account status</h3><p className="mt-1 text-xs text-[#858d82]">Status updates are saved separately from customer information.</p></div>
          <div className="flex items-center gap-2">
            <select aria-label="Customer status" value={values.status} onChange={(event) => setValues((current) => ({ ...current, status: event.target.value as CustomerStatus }))} className="h-10 rounded-lg border border-[#e1e5dc] bg-white px-3 text-xs text-[#202720]">
              <option value="Active">Active · Activate</option>
              <option value="Inactive">Inactive · Deactivate</option>
              <option value="Blocked">Blocked · Ban</option>
            </select>
            <button type="button" onClick={() => void submitStatus()} disabled={isSaving || isSavingStatus || values.status === (customer.status ?? "Active")} className="rounded-lg border border-[#e1e5dc] bg-white px-3 py-2.5 text-xs font-semibold text-[#596257] disabled:opacity-50">{isSavingStatus ? "Saving…" : "Save status"}</button>
          </div>
        </div>
        {statusError && <p role="alert" className="mt-2 text-xs text-[#a35e4b]">{statusError}</p>}
      </section>
    </section>
  </div><CarLoadingModal isOpen={isSaving || isSavingStatus} message="Saving customer..." /></>
}

export default UpdateCustomerForm
