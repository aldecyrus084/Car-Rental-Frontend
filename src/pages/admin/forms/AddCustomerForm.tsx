import { useState, type ChangeEvent, type FormEvent } from "react"
import { Icon } from "../AdminSidebar"

export type AddCustomerFormValues = {
  customerNumber: string
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
  documentType: string
  documentNumber: string
  expirationDate: string
  isVerified: boolean
  documents: File[]
}

type AddCustomerFormProps = {
  onClose: () => void
  onSave: (record: AddCustomerFormValues) => void
}

const fieldClass = "mt-1.5 h-10 w-full rounded-lg border border-[#e1e5dc] bg-white px-3 text-sm font-normal text-[#202720] outline-none focus:border-[#81945e]"
const fileClass = "mt-1.5 block w-full rounded-lg border border-[#e1e5dc] bg-white text-xs text-[#596257] file:mr-3 file:border-0 file:border-r file:border-[#e1e5dc] file:bg-[#f8f9f6] file:px-3 file:py-2.5 file:text-xs file:font-medium file:text-[#596257]"
const documentTypes = ["National ID", "Passport", "Driver's license", "Alien ID", "Other"]

function createCustomerNumber() {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
  const randomBytes = crypto.getRandomValues(new Uint8Array(11))
  const identifier = Array.from(randomBytes, (value) => characters[value % characters.length]).join("")
  return `CUS-${identifier.slice(0, 4)}-${identifier.slice(4, 8)}-${identifier.slice(8)}`
}

function AddCustomerForm({ onClose, onSave }: AddCustomerFormProps) {
  const [values, setValues] = useState<AddCustomerFormValues>({
    customerNumber: createCustomerNumber(),
    firstName: "",
    middleName: "",
    lastName: "",
    dateOfBirth: "",
    gender: "",
    email: "",
    phoneNumber: "",
    address: "",
    city: "",
    province: "",
    postalCode: "",
    emergencyContactName: "",
    emergencyNumber: "",
    documentType: "",
    documentNumber: "",
    expirationDate: "",
    isVerified: false,
    documents: [],
  })
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    onSave(values)
  }

  const updateFiles = (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? [])
    setSelectedFiles(files)
    setValues((current) => ({ ...current, documents: files }))
  }

  return <div role="presentation" className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose() }}>
    <section role="dialog" aria-modal="true" aria-labelledby="customer-form-title" className="max-h-[calc(100vh-2rem)] w-full max-w-5xl overflow-y-auto rounded-xl bg-white p-5 shadow-2xl sm:p-6">
      <div className="flex items-start justify-between gap-4">
        <div><h2 id="customer-form-title" className="text-lg font-semibold">Add customer</h2><p className="mt-1 text-xs text-[#858d82]">Add a customer profile.</p></div>
        <button type="button" aria-label="Close form" onClick={onClose} className="rounded-lg p-1.5 text-[#788077] hover:bg-[#f2f4ef]"><Icon name="close" className="h-5 w-5" /></button>
      </div>
      <form onSubmit={submit} className="mt-5 space-y-5">
        <section aria-labelledby="customer-details-title" className="rounded-lg border border-[#e7e9e2] p-4 sm:p-5">
          <div className="mb-4"><h3 id="customer-details-title" className="text-sm font-semibold text-[#343d34]">01 · Customer information</h3><p className="mt-1 text-xs text-[#858d82]">Personal details, contact information, and emergency contact.</p></div>
          <div className="grid gap-x-4 gap-y-3 sm:grid-cols-2 lg:grid-cols-3">
            <label className="block text-xs font-medium text-[#596257]">Customer number <span className="font-normal text-[#899187]">(auto generated)</span><input required readOnly value={values.customerNumber} className={`${fieldClass} bg-[#f5f6f2]`} /></label>
            <label className="block text-xs font-medium text-[#596257]">First name<input required autoComplete="given-name" value={values.firstName} onChange={(event) => setValues((current) => ({ ...current, firstName: event.target.value }))} className={fieldClass} /></label>
            <label className="block text-xs font-medium text-[#596257]">Middle name <span className="font-normal text-[#899187]">(optional)</span><input autoComplete="additional-name" value={values.middleName} onChange={(event) => setValues((current) => ({ ...current, middleName: event.target.value }))} className={fieldClass} /></label>
            <label className="block text-xs font-medium text-[#596257]">Last name<input required autoComplete="family-name" value={values.lastName} onChange={(event) => setValues((current) => ({ ...current, lastName: event.target.value }))} className={fieldClass} /></label>
            <label className="block text-xs font-medium text-[#596257]">Date of birth<input required type="date" autoComplete="bday" value={values.dateOfBirth} onChange={(event) => setValues((current) => ({ ...current, dateOfBirth: event.target.value }))} className={fieldClass} /></label>
            <label className="block text-xs font-medium text-[#596257]">Gender<select required value={values.gender} onChange={(event) => setValues((current) => ({ ...current, gender: event.target.value }))} className={fieldClass}><option value="">Select gender</option><option>Female</option><option>Male</option><option>Non-binary</option><option>Prefer not to say</option></select></label>
            <label className="block text-xs font-medium text-[#596257]">Email<input required type="email" autoComplete="email" value={values.email} onChange={(event) => setValues((current) => ({ ...current, email: event.target.value }))} className={fieldClass} /></label>
            <label className="block text-xs font-medium text-[#596257]">Phone number<input required type="tel" autoComplete="tel" value={values.phoneNumber} onChange={(event) => setValues((current) => ({ ...current, phoneNumber: event.target.value }))} className={fieldClass} /></label>
            <label className="block text-xs font-medium text-[#596257]">Address<input required autoComplete="street-address" value={values.address} onChange={(event) => setValues((current) => ({ ...current, address: event.target.value }))} className={fieldClass} /></label>
            <label className="block text-xs font-medium text-[#596257]">City<input required autoComplete="address-level2" value={values.city} onChange={(event) => setValues((current) => ({ ...current, city: event.target.value }))} className={fieldClass} /></label>
            <label className="block text-xs font-medium text-[#596257]">Province<input required autoComplete="address-level1" value={values.province} onChange={(event) => setValues((current) => ({ ...current, province: event.target.value }))} className={fieldClass} /></label>
            <label className="block text-xs font-medium text-[#596257]">Postal code<input required autoComplete="postal-code" value={values.postalCode} onChange={(event) => setValues((current) => ({ ...current, postalCode: event.target.value }))} className={fieldClass} /></label>
            <label className="block text-xs font-medium text-[#596257]">Emergency contact name<input required autoComplete="off" value={values.emergencyContactName} onChange={(event) => setValues((current) => ({ ...current, emergencyContactName: event.target.value }))} className={fieldClass} /></label>
            <label className="block text-xs font-medium text-[#596257]">Emergency number<input required type="tel" autoComplete="off" value={values.emergencyNumber} onChange={(event) => setValues((current) => ({ ...current, emergencyNumber: event.target.value }))} className={fieldClass} /></label>
          </div>
        </section>

        <section aria-labelledby="customer-documents-title" className="rounded-lg border border-[#e7e9e2] p-4 sm:p-5">
          <div className="mb-4"><h3 id="customer-documents-title" className="text-sm font-semibold text-[#343d34]">02 · Customer documents</h3><p className="mt-1 text-xs text-[#858d82]">Record an identity document and attach supporting files.</p></div>
          <div className="grid gap-x-4 gap-y-3 sm:grid-cols-2 lg:grid-cols-3">
            <label className="block text-xs font-medium text-[#596257]">Document type<select required value={values.documentType} onChange={(event) => setValues((current) => ({ ...current, documentType: event.target.value }))} className={fieldClass}><option value="">Select document type</option>{documentTypes.map((type) => <option key={type}>{type}</option>)}</select></label>
            <label className="block text-xs font-medium text-[#596257]">Document number<input required value={values.documentNumber} onChange={(event) => setValues((current) => ({ ...current, documentNumber: event.target.value }))} className={fieldClass} /></label>
            <label className="block text-xs font-medium text-[#596257]">Expiration date <span className="font-normal text-[#899187]">(optional)</span><input type="date" value={values.expirationDate} onChange={(event) => setValues((current) => ({ ...current, expirationDate: event.target.value }))} className={fieldClass} /></label>
            <label className="flex min-h-10 items-center gap-2 text-xs font-medium text-[#596257]"><input type="checkbox" checked={values.isVerified} onChange={(event) => setValues((current) => ({ ...current, isVerified: event.target.checked }))} className="h-4 w-4 accent-[#53634e]" />Document is verified</label>
            <label className="block text-xs font-medium text-[#596257] sm:col-span-2">Upload documents <span className="font-normal text-[#899187]">(optional, multiple files)</span><input type="file" multiple accept=".pdf,.png,.jpg,.jpeg,.webp,.doc,.docx,application/pdf,image/*,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document" onChange={updateFiles} className={fileClass} />{selectedFiles.length > 0 && <span className="mt-1.5 block text-[11px] font-normal text-[#788077]">{selectedFiles.map((file) => file.name).join(", ")}</span>}</label>
          </div>
        </section>

        <div className="flex justify-end gap-2 border-t border-[#edf0e9] pt-4"><button type="button" onClick={onClose} className="rounded-lg border border-[#e1e5dc] px-4 py-2.5 text-xs font-semibold text-[#596257]">Cancel</button><button type="submit" className="rounded-lg bg-[#192820] px-4 py-2.5 text-xs font-semibold text-white">Save customer</button></div>
      </form>
    </section>
  </div>
}

export default AddCustomerForm
