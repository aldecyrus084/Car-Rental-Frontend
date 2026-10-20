import { useState, type ChangeEvent, type FormEvent } from "react"
import { Icon } from "../AdminSidebar"
import { getBranches } from "../../../features/branches/branches.store"

export type RentalFormValues = {
  rentalNumber: string
  customerId: string
  vehicleId: string
  vehicle: string
  branchId: string
  startDateTime: string
  expectedReturnDateTime: string
  actualReturnDateTime: string
  status: string
  rentalType: string
  pickupLocation: string
  returnLocation: string
  startingMileage: string
  endingMileage: string
  startingFuelLevel: string
  endingFuelLevel: string
  dailyBaseRate: number
  subtotal: number
  discountAmount: number
  penaltyAmount: number
  additionalCharges: number
  totalAmount: number
  depositAmount: number
  area: string
  destinationName: string
  city: string
  province: string
  distanceKm: string
  destinationType: string
  destinationRemarks: string
  documentType: string
  customerDocuments: File[]
  inspectionSheet: File | null
  inspectionNotes: string
}

type AddRentalFormProps = {
  onClose: () => void
  onSave: (values: RentalFormValues) => void
}

export const rentalCustomerOptions = [
  { id: "101", customerNumber: "CUS-2026-0010-001", name: "Maya Johnson", email: "maya.johnson@example.com", phone: "+254 712 340 821" },
  { id: "102", customerNumber: "CUS-2026-0010-002", name: "Noah Williams", email: "noah.w@example.com", phone: "+254 733 186 402" },
  { id: "103", customerNumber: "CUS-2026-0010-003", name: "Olivia Brown", email: "olivia.b@example.com", phone: "+254 701 509 277" },
  { id: "104", customerNumber: "CUS-2026-0010-004", name: "Ethan Davis", email: "ethan.d@example.com", phone: "+254 728 411 650" },
]

const vehicles = [
  { id: "1", name: "Toyota Corolla · KDA 284R", dailyRate: 6500 },
  { id: "2", name: "Honda CR-V · KDB 619M", dailyRate: 12500 },
  { id: "3", name: "Hyundai Tucson · KDC 407P", dailyRate: 11500 },
  { id: "4", name: "Mazda CX-5 · KDD 852A", dailyRate: 13000 },
]

const documentTypes = ["Water bill", "Utility bill", "Bank statement", "Proof of address", "Other valid document"]
const areas = ["Westlands", "Airport area", "Nairobi CBD", "Karen", "Mombasa", "Other"]
const destinationTypes = ["Business", "Tourism", "Airport transfer", "Personal", "Other"]
const fieldClass = "mt-1.5 h-10 w-full rounded-lg border border-[#e1e5dc] bg-white px-3 text-sm font-normal text-[#202720] outline-none focus:border-[#81945e]"
const disabledFieldClass = `${fieldClass} disabled:bg-[#f5f6f2] disabled:text-[#788077]`
const fileClass = "mt-1.5 block w-full rounded-lg border border-[#e1e5dc] bg-white text-xs text-[#596257] file:mr-3 file:border-0 file:border-r file:border-[#e1e5dc] file:bg-[#f8f9f6] file:px-3 file:py-2.5 file:text-xs file:font-medium file:text-[#596257]"
const allowedDocumentFiles = ".pdf,.png,.jpg,.jpeg,.webp,.doc,.docx,application/pdf,image/*,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"

function generateRentalNumber() {
  const digits = Array.from(crypto.getRandomValues(new Uint8Array(8)), (value) => value % 10).join("")
  return `RENT-${digits.slice(0, 4)}-${digits.slice(4)}`
}

function AddRentalForm({ onClose, onSave }: AddRentalFormProps) {
  const [branches] = useState(() => getBranches().filter((branch) => branch.isActive))
  const [values, setValues] = useState<RentalFormValues>({
    rentalNumber: generateRentalNumber(),
    customerId: "",
    vehicleId: "",
    vehicle: "",
    branchId: "",
    startDateTime: "",
    expectedReturnDateTime: "",
    actualReturnDateTime: "",
    status: "Booked",
    rentalType: "Daily",
    pickupLocation: "",
    returnLocation: "",
    startingMileage: "",
    endingMileage: "",
    startingFuelLevel: "",
    endingFuelLevel: "",
    dailyBaseRate: 0,
    subtotal: 0,
    discountAmount: 0,
    penaltyAmount: 0,
    additionalCharges: 0,
    totalAmount: 0,
    depositAmount: 0,
    area: "",
    destinationName: "",
    city: "",
    province: "",
    distanceKm: "",
    destinationType: "",
    destinationRemarks: "",
    documentType: "",
    customerDocuments: [],
    inspectionSheet: null,
    inspectionNotes: "",
  })

  const selectedCustomer = rentalCustomerOptions.find((customer) => customer.id === values.customerId)
  const rentalDays = values.startDateTime && values.expectedReturnDateTime
    ? Math.max(1, Math.ceil((new Date(values.expectedReturnDateTime).getTime() - new Date(values.startDateTime).getTime()) / 86_400_000))
    : 0
  const subtotal = values.dailyBaseRate * rentalDays
  const totalAmount = Math.max(0, subtotal - values.discountAmount + values.penaltyAmount + values.additionalCharges)

  const updateVehicle = (vehicleId: string) => {
    const vehicle = vehicles.find((option) => option.id === vehicleId)
    setValues((current) => ({ ...current, vehicleId, vehicle: vehicle?.name ?? "", dailyBaseRate: vehicle?.dailyRate ?? 0 }))
  }

  const updateCustomerDocuments = (event: ChangeEvent<HTMLInputElement>) => {
    setValues((current) => ({ ...current, customerDocuments: Array.from(event.target.files ?? []) }))
  }

  const updateInspectionSheet = (event: ChangeEvent<HTMLInputElement>) => {
    setValues((current) => ({ ...current, inspectionSheet: event.target.files?.[0] ?? null }))
  }

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!selectedCustomer) return
    onSave({ ...values, subtotal, totalAmount })
  }

  return <div role="presentation" className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose() }}>
    <section role="dialog" aria-modal="true" aria-labelledby="rental-form-title" className="max-h-[calc(100vh-2rem)] w-full max-w-5xl overflow-y-auto rounded-xl bg-white p-5 shadow-2xl sm:p-6">
      <div className="flex items-start justify-between gap-4"><div><h2 id="rental-form-title" className="text-lg font-semibold">Create rental</h2><p className="mt-1 text-xs text-[#858d82]">Record rental details, destination, and supporting documents.</p></div><button type="button" aria-label="Close rental form" onClick={onClose} className="rounded-lg p-1.5 text-[#788077] hover:bg-[#f2f4ef]"><Icon name="close" className="h-5 w-5" /></button></div>
      <form onSubmit={submit} className="mt-5 space-y-5">
        <section aria-labelledby="rental-information-title" className="rounded-lg border border-[#e7e9e2] p-4 sm:p-5">
          <div className="mb-4"><h3 id="rental-information-title" className="text-sm font-semibold text-[#343d34]">01 · Rental information</h3><p className="mt-1 text-xs text-[#858d82]">Booking, customer, vehicle, return, and payment details.</p></div>
          <div className="grid gap-x-4 gap-y-3 sm:grid-cols-2 lg:grid-cols-3">
            <label className="block text-xs font-medium text-[#596257]">Rental number<input readOnly value={values.rentalNumber} className={`${disabledFieldClass} font-semibold`} /><span className="mt-1 block text-[10px] font-normal text-[#899187]">Generated automatically.</span></label>
            <label className="block text-xs font-medium text-[#596257]">Customer<select required value={values.customerId} onChange={(event) => setValues((current) => ({ ...current, customerId: event.target.value }))} className={fieldClass}><option value="">Select renter</option>{rentalCustomerOptions.map((customer) => <option key={customer.id} value={customer.id}>{customer.name} · {customer.customerNumber}</option>)}</select></label>
            <label className="block text-xs font-medium text-[#596257]">Vehicle<select required value={values.vehicleId} onChange={(event) => updateVehicle(event.target.value)} className={fieldClass}><option value="">Select vehicle</option>{vehicles.map((vehicle) => <option key={vehicle.id} value={vehicle.id}>{vehicle.name}</option>)}</select></label>
            {selectedCustomer && <div className="rounded-lg border border-[#e7e9e2] bg-[#f8f9f6] p-3 text-xs sm:col-span-2 lg:col-span-3"><p className="font-semibold text-[#343d34]">{selectedCustomer.name}<span className="ml-2 font-normal text-[#899187]">{selectedCustomer.customerNumber} · Customer ID {selectedCustomer.id}</span></p><p className="mt-1 text-[#687166]">{selectedCustomer.email} · {selectedCustomer.phone}</p></div>}
            <label className="block text-xs font-medium text-[#596257]">Branch<select required value={values.branchId} onChange={(event) => setValues((current) => ({ ...current, branchId: event.target.value }))} className={fieldClass}><option value="">Select branch</option>{branches.map((branch) => <option key={branch.branchId} value={branch.branchId}>{branch.name}</option>)}</select><span className="mt-1 block text-[10px] font-normal text-[#899187]">Submits the branch ID.</span></label>
            <label className="block text-xs font-medium text-[#596257]">Start date &amp; time<input required type="datetime-local" value={values.startDateTime} onChange={(event) => setValues((current) => ({ ...current, startDateTime: event.target.value, expectedReturnDateTime: current.expectedReturnDateTime && current.expectedReturnDateTime <= event.target.value ? "" : current.expectedReturnDateTime }))} className={fieldClass} /></label>
            <label className="block text-xs font-medium text-[#596257]">Expected return date &amp; time<input required type="datetime-local" min={values.startDateTime || undefined} value={values.expectedReturnDateTime} onChange={(event) => setValues((current) => ({ ...current, expectedReturnDateTime: event.target.value }))} className={fieldClass} /></label>
            <label className="block text-xs font-medium text-[#596257]">Actual return date &amp; time <span className="font-normal text-[#899187]">(optional)</span><input type="datetime-local" value={values.actualReturnDateTime} onChange={(event) => setValues((current) => ({ ...current, actualReturnDateTime: event.target.value }))} className={fieldClass} /></label>
            <label className="block text-xs font-medium text-[#596257]">Status<select value={values.status} onChange={(event) => setValues((current) => ({ ...current, status: event.target.value }))} className={fieldClass}><option>Booked</option><option>Active</option><option>Overdue</option><option>Completed</option><option>Cancelled</option></select></label>
            <label className="block text-xs font-medium text-[#596257]">Rental type<select value={values.rentalType} onChange={(event) => setValues((current) => ({ ...current, rentalType: event.target.value }))} className={fieldClass}><option>Daily</option><option>Weekly</option><option>Monthly</option></select></label>
            <label className="block text-xs font-medium text-[#596257]">Pickup location<input required value={values.pickupLocation} onChange={(event) => setValues((current) => ({ ...current, pickupLocation: event.target.value }))} placeholder="Pickup point" className={fieldClass} /></label>
            <label className="block text-xs font-medium text-[#596257]">Return location<input required value={values.returnLocation} onChange={(event) => setValues((current) => ({ ...current, returnLocation: event.target.value }))} placeholder="Return point" className={fieldClass} /></label>
            <label className="block text-xs font-medium text-[#596257]">Starting mileage (km)<input required type="number" min="0" step="1" value={values.startingMileage} onChange={(event) => setValues((current) => ({ ...current, startingMileage: event.target.value }))} className={fieldClass} /></label>
            <label className="block text-xs font-medium text-[#596257]">Ending mileage (km) <span className="font-normal text-[#899187]">(optional)</span><input type="number" min={values.startingMileage || "0"} step="1" value={values.endingMileage} onChange={(event) => setValues((current) => ({ ...current, endingMileage: event.target.value }))} className={fieldClass} /></label>
            <label className="block text-xs font-medium text-[#596257]">Starting fuel level (%)<input required type="number" min="0" max="100" step="1" value={values.startingFuelLevel} onChange={(event) => setValues((current) => ({ ...current, startingFuelLevel: event.target.value }))} className={fieldClass} /></label>
            <label className="block text-xs font-medium text-[#596257]">Ending fuel level (%) <span className="font-normal text-[#899187]">(optional)</span><input type="number" min="0" max="100" step="1" value={values.endingFuelLevel} onChange={(event) => setValues((current) => ({ ...current, endingFuelLevel: event.target.value }))} className={fieldClass} /></label>
            <label className="block text-xs font-medium text-[#596257]">Daily base rate (KSh)<input readOnly value={values.dailyBaseRate || ""} className={disabledFieldClass} /></label>
            <label className="block text-xs font-medium text-[#596257]">Subtotal (KSh)<input readOnly value={subtotal} className={disabledFieldClass} /><span className="mt-1 block text-[10px] font-normal text-[#899187]">Daily rate × {rentalDays} {rentalDays === 1 ? "day" : "days"}.</span></label>
            <label className="block text-xs font-medium text-[#596257]">Discount amount (KSh)<input type="number" min="0" max={subtotal} step="0.01" value={values.discountAmount} onChange={(event) => setValues((current) => ({ ...current, discountAmount: Number(event.target.value) }))} className={fieldClass} /></label>
            <label className="block text-xs font-medium text-[#596257]">Penalty amount (KSh)<input type="number" min="0" step="0.01" value={values.penaltyAmount} onChange={(event) => setValues((current) => ({ ...current, penaltyAmount: Number(event.target.value) }))} className={fieldClass} /></label>
            <label className="block text-xs font-medium text-[#596257]">Additional charges (KSh)<input type="number" min="0" step="0.01" value={values.additionalCharges} onChange={(event) => setValues((current) => ({ ...current, additionalCharges: Number(event.target.value) }))} className={fieldClass} /></label>
            <label className="block text-xs font-medium text-[#596257]">Deposit amount (KSh)<input required type="number" min="0" step="0.01" value={values.depositAmount} onChange={(event) => setValues((current) => ({ ...current, depositAmount: Number(event.target.value) }))} className={fieldClass} /></label>
            <label className="block text-xs font-medium text-[#596257]">Total amount (KSh)<input readOnly value={totalAmount} className={`${disabledFieldClass} font-semibold`} /></label>
          </div>
        </section>

        <section aria-labelledby="rental-destination-title" className="rounded-lg border border-[#e7e9e2] p-4 sm:p-5">
          <div className="mb-4"><h3 id="rental-destination-title" className="text-sm font-semibold text-[#343d34]">02 · Rental destination</h3><p className="mt-1 text-xs text-[#858d82]">Capture the renter’s planned destination.</p></div>
          <div className="grid gap-x-4 gap-y-3 sm:grid-cols-2 lg:grid-cols-3">
            <label className="block text-xs font-medium text-[#596257]">Area<select required value={values.area} onChange={(event) => setValues((current) => ({ ...current, area: event.target.value }))} className={fieldClass}><option value="">Select area</option>{areas.map((area) => <option key={area}>{area}</option>)}</select></label>
            <label className="block text-xs font-medium text-[#596257]">Destination name<input required value={values.destinationName} onChange={(event) => setValues((current) => ({ ...current, destinationName: event.target.value }))} className={fieldClass} /></label>
            <label className="block text-xs font-medium text-[#596257]">City<input required value={values.city} onChange={(event) => setValues((current) => ({ ...current, city: event.target.value }))} className={fieldClass} /></label>
            <label className="block text-xs font-medium text-[#596257]">Province<input required value={values.province} onChange={(event) => setValues((current) => ({ ...current, province: event.target.value }))} className={fieldClass} /></label>
            <label className="block text-xs font-medium text-[#596257]">Distance (km) <span className="font-normal text-[#899187]">(optional)</span><input type="number" min="0" step="0.1" value={values.distanceKm} onChange={(event) => setValues((current) => ({ ...current, distanceKm: event.target.value }))} className={fieldClass} /></label>
            <label className="block text-xs font-medium text-[#596257]">Destination type<select required value={values.destinationType} onChange={(event) => setValues((current) => ({ ...current, destinationType: event.target.value }))} className={fieldClass}><option value="">Select destination type</option>{destinationTypes.map((type) => <option key={type}>{type}</option>)}</select></label>
            <label className="block text-xs font-medium text-[#596257] sm:col-span-2 lg:col-span-3">Remarks <span className="font-normal text-[#899187]">(optional)</span><textarea rows={2} value={values.destinationRemarks} onChange={(event) => setValues((current) => ({ ...current, destinationRemarks: event.target.value }))} className="mt-1.5 w-full rounded-lg border border-[#e1e5dc] px-3 py-2.5 text-sm font-normal text-[#202720] outline-none focus:border-[#81945e]" /></label>
          </div>
        </section>

        <section aria-labelledby="rental-documents-title" className="rounded-lg border border-[#e7e9e2] p-4 sm:p-5">
          <div className="mb-4"><h3 id="rental-documents-title" className="text-sm font-semibold text-[#343d34]">03 · Rental documents</h3><p className="mt-1 text-xs text-[#858d82]">Attach renter documentation and the vehicle inspection record.</p></div>
          <div className="grid gap-x-4 gap-y-3 sm:grid-cols-2">
            <label className="block text-xs font-medium text-[#596257]">Customer document type<select required value={values.documentType} onChange={(event) => setValues((current) => ({ ...current, documentType: event.target.value }))} className={fieldClass}><option value="">Select document type</option>{documentTypes.map((type) => <option key={type}>{type}</option>)}</select></label>
            <label className="block text-xs font-medium text-[#596257]">Customer documents <span className="font-normal text-[#899187]">(multiple files)</span><input required type="file" multiple accept={allowedDocumentFiles} onChange={updateCustomerDocuments} className={fileClass} /><span className="mt-1 block text-[10px] font-normal text-[#899187]">Water bills and other valid customer documents.</span></label>
            <label className="block text-xs font-medium text-[#596257]">Vehicle inspection sheet<input required type="file" accept={allowedDocumentFiles} onChange={updateInspectionSheet} className={fileClass} /><span className="mt-1 block text-[10px] font-normal text-[#899187]">Upload the inspection sheet showing pre-existing scratches.</span></label>
            <label className="block text-xs font-medium text-[#596257]">Inspection notes <span className="font-normal text-[#899187]">(optional)</span><textarea rows={3} value={values.inspectionNotes} onChange={(event) => setValues((current) => ({ ...current, inspectionNotes: event.target.value }))} placeholder="Note existing scratches or vehicle condition" className="mt-1.5 w-full rounded-lg border border-[#e1e5dc] px-3 py-2.5 text-sm font-normal text-[#202720] outline-none focus:border-[#81945e]" /></label>
          </div>
        </section>

        <div className="flex justify-end gap-2 border-t border-[#edf0e9] pt-4"><button type="button" onClick={onClose} className="rounded-lg border border-[#e1e5dc] px-4 py-2.5 text-xs font-semibold text-[#596257]">Cancel</button><button type="submit" className="rounded-lg bg-[#192820] px-4 py-2.5 text-xs font-semibold text-white">Save rental</button></div>
      </form>
    </section>
  </div>
}

export default AddRentalForm