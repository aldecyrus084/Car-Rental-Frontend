import { useState, type ChangeEvent, type FormEvent } from "react"
import { Icon } from "../AdminSidebar"
import { branches, vehicleTypeOptions } from "../fleetOptions"

export type AddCarFormValues = {
  plateNumber: string
  vehicleCode: string
  vin: string
  make: string
  model: string
  year: string
  color: string
  currentMileage: string
  fuelLevel: string
  status: string
  registrationExpiryDate: string
  insuranceExpiryDate: string
  branchId: string
  vehicleTypeId: string
  vehicleTypeName: string
  seatingCapacity: string
  transmissionType: string
  fuelType: string
  dailyBaseRate: string
  frontImage: File | null
  backImage: File | null
  rightImage: File | null
  leftImage: File | null
  vehicleDocuments: File[]
}

type AddCarFormProps = { onClose: () => void; onSave: (values: AddCarFormValues) => void }

const fieldClass = "mt-1.5 h-10 w-full rounded-lg border border-[#e1e5dc] bg-white px-3 text-sm font-normal text-[#202720] outline-none focus:border-[#81945e]"
const fileClass = "mt-1.5 block w-full rounded-lg border border-[#e1e5dc] bg-white text-xs text-[#596257] file:mr-3 file:border-0 file:border-r file:border-[#e1e5dc] file:bg-[#f8f9f6] file:px-3 file:py-2.5 file:text-xs file:font-medium file:text-[#596257]"

function AddCarForm({ onClose, onSave }: AddCarFormProps) {
  const [values, setValues] = useState<AddCarFormValues>({
    plateNumber: "",
    vehicleCode: "",
    vin: "",
    make: "",
    model: "",
    year: "",
    color: "",
    currentMileage: "",
    fuelLevel: "",
    status: "Available",
    registrationExpiryDate: "",
    insuranceExpiryDate: "",
    branchId: "",
    vehicleTypeId: "",
    vehicleTypeName: "",
    seatingCapacity: "",
    transmissionType: "",
    fuelType: "",
    dailyBaseRate: "",
    frontImage: null,
    backImage: null,
    rightImage: null,
    leftImage: null,
    vehicleDocuments: [],
  })
    
  const setImage = (key: "frontImage" | "backImage" | "rightImage" | "leftImage", event: ChangeEvent<HTMLInputElement>) => {
    setValues((current) => ({ ...current, [key]: event.target.files?.[0] ?? null }))
  }
    
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    onSave(values)
  }
    
  return <div role="presentation" className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose() }}>
    <section role="dialog" aria-modal="true" aria-labelledby="car-form-title" className="max-h-[calc(100vh-2rem)] w-full max-w-5xl overflow-y-auto rounded-xl bg-white p-5 shadow-2xl sm:p-6">
      <div className="flex items-start justify-between gap-4"><div><h2 id="car-form-title" className="text-lg font-semibold">Add car</h2><p className="mt-1 text-xs text-[#858d82]">Enter vehicle details, upload photos, and assign a vehicle type.</p></div><button type="button" aria-label="Close car form" onClick={onClose} className="rounded-lg p-1.5 text-[#788077] hover:bg-[#f2f4ef]"><Icon name="close" className="h-5 w-5" /></button></div>
      <form onSubmit={submit} className="mt-5 space-y-5">
        <section aria-labelledby="vehicle-details-title" className="rounded-lg border border-[#e7e9e2] p-4 sm:p-5">
          <div className="mb-4"><h3 id="vehicle-details-title" className="text-sm font-semibold text-[#343d34]">01 · Vehicle details</h3><p className="mt-1 text-xs text-[#858d82]">Identification, condition, and branch assignment.</p></div>
          <div className="grid gap-x-4 gap-y-3 sm:grid-cols-2 lg:grid-cols-3">
            <label className="block text-xs font-medium text-[#596257]">Plate number<input required autoComplete="off" value={values.plateNumber} onChange={(event) => setValues((current) => ({ ...current, plateNumber: event.target.value }))} placeholder="e.g. KDA 284R" className={fieldClass} /></label>
            <label className="block text-xs font-medium text-[#596257]">Vehicle code<input required value={values.vehicleCode} onChange={(event) => setValues((current) => ({ ...current, vehicleCode: event.target.value }))} placeholder="e.g. VH-001" className={fieldClass} /></label>
            <label className="block text-xs font-medium text-[#596257]">VIN <span className="font-normal text-[#899187]">(optional)</span><input value={values.vin} onChange={(event) => setValues((current) => ({ ...current, vin: event.target.value }))} className={fieldClass} /></label>
            <label className="block text-xs font-medium text-[#596257]">Make<input required list="vehicle-makes" value={values.make} onChange={(event) => setValues((current) => ({ ...current, make: event.target.value }))} placeholder="Select or enter make" className={fieldClass} /><datalist id="vehicle-makes"><option value="Toyota" /><option value="Honda" /><option value="Nissan" /><option value="Hyundai" /><option value="Mazda" /><option value="Kia" /><option value="Subaru" /><option value="Other" /></datalist></label>
            <label className="block text-xs font-medium text-[#596257]">Model<input required value={values.model} onChange={(event) => setValues((current) => ({ ...current, model: event.target.value }))} placeholder="e.g. Corolla" className={fieldClass} /></label>
            <label className="block text-xs font-medium text-[#596257]">Year<input required type="number" min="1900" max="2100" step="1" value={values.year} onChange={(event) => setValues((current) => ({ ...current, year: event.target.value }))} className={fieldClass} /></label>
            <label className="block text-xs font-medium text-[#596257]">Color<input required value={values.color} onChange={(event) => setValues((current) => ({ ...current, color: event.target.value }))} className={fieldClass} /></label>
            <label className="block text-xs font-medium text-[#596257]">Current mileage (km)<input required type="number" min="0" step="1" value={values.currentMileage} onChange={(event) => setValues((current) => ({ ...current, currentMileage: event.target.value }))} className={fieldClass} /></label>
            <label className="block text-xs font-medium text-[#596257]">Fuel level (%)<input required type="number" min="0" max="100" step="1" value={values.fuelLevel} onChange={(event) => setValues((current) => ({ ...current, fuelLevel: event.target.value }))} className={fieldClass} /></label>
            <label className="block text-xs font-medium text-[#596257]">Status<select value={values.status} onChange={(event) => setValues((current) => ({ ...current, status: event.target.value }))} className={fieldClass}><option>Available</option><option>On rent</option><option>Maintenance</option><option>Unavailable</option></select></label>
            <label className="block text-xs font-medium text-[#596257]">Registration expiry date<input required type="date" value={values.registrationExpiryDate} onChange={(event) => setValues((current) => ({ ...current, registrationExpiryDate: event.target.value }))} className={fieldClass} /></label>
            <label className="block text-xs font-medium text-[#596257]">Insurance expiry date<input required type="date" value={values.insuranceExpiryDate} onChange={(event) => setValues((current) => ({ ...current, insuranceExpiryDate: event.target.value }))} className={fieldClass} /></label>
            <label className="block text-xs font-medium text-[#596257]">Branch<select required value={values.branchId} onChange={(event) => setValues((current) => ({ ...current, branchId: event.target.value }))} className={fieldClass}><option value="">Select branch</option>{branches.map((branch) => <option key={branch.id} value={branch.id}>{branch.name}</option>)}</select><span className="mt-1 block text-[10px] font-normal text-[#899187]">Submits the branch ID.</span></label>
          </div>
        </section>

        <section aria-labelledby="vehicle-images-title" className="rounded-lg border border-[#e7e9e2] p-4 sm:p-5">
          <div className="mb-4"><h3 id="vehicle-images-title" className="text-sm font-semibold text-[#343d34]">02 · Vehicle images &amp; documents</h3><p className="mt-1 text-xs text-[#858d82]">Add four exterior views and supporting papers.</p></div>
          <div className="grid gap-x-4 gap-y-3 sm:grid-cols-2 lg:grid-cols-3">
            {(["frontImage", "backImage", "rightImage", "leftImage"] as const).map((key) => <label key={key} className="block text-xs font-medium capitalize text-[#596257]">{key.replace("Image", " view")} photo<input required type="file" accept="image/*" onChange={(event) => setImage(key, event)} className={fileClass} /></label>)}
            <label className="block text-xs font-medium text-[#596257]">Vehicle documents <span className="font-normal text-[#899187]">(optional)</span><input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" onChange={(event) => setValues((current) => ({ ...current, vehicleDocuments: Array.from(event.target.files ?? []) }))} className={fileClass} /></label>
          </div>
        </section>

        <section aria-labelledby="vehicle-type-title" className="rounded-lg border border-[#e7e9e2] p-4 sm:p-5">
          <div className="mb-4"><h3 id="vehicle-type-title" className="text-sm font-semibold text-[#343d34]">03 · Vehicle type &amp; pricing</h3><p className="mt-1 text-xs text-[#858d82]">Choose a type to fill its specifications and daily base rate.</p></div>
          <div className="grid gap-x-4 gap-y-3 sm:grid-cols-2 lg:grid-cols-3">
            <label className="block text-xs font-medium text-[#596257]">Vehicle type<select required value={values.vehicleTypeId} onChange={(event) => {
              const vehicleTypeId = event.target.value
              const type = vehicleTypeOptions.find((option) => option.id === vehicleTypeId)
              setValues((current) => ({ ...current, vehicleTypeId, vehicleTypeName: type?.name ?? "", seatingCapacity: type?.seatingCapacity ?? "", transmissionType: type?.transmissionType ?? "", fuelType: type?.fuelType ?? "", dailyBaseRate: type?.dailyBaseRate ?? "" }))
            }} className={fieldClass}><option value="">Select vehicle type</option>{vehicleTypeOptions.map((type) => <option key={type.id} value={type.id}>{type.name}</option>)}</select></label>
            <label className="block text-xs font-medium text-[#596257]">Name<input disabled value={values.vehicleTypeName} className={`${fieldClass} disabled:bg-[#f5f6f2] disabled:text-[#788077]`} /></label>
            <label className="block text-xs font-medium text-[#596257]">Seating capacity<input disabled value={values.seatingCapacity} className={`${fieldClass} disabled:bg-[#f5f6f2] disabled:text-[#788077]`} /></label>
            <label className="block text-xs font-medium text-[#596257]">Transmission type<input disabled value={values.transmissionType} className={`${fieldClass} disabled:bg-[#f5f6f2] disabled:text-[#788077]`} /></label>
            <label className="block text-xs font-medium text-[#596257]">Fuel type<input disabled value={values.fuelType} className={`${fieldClass} disabled:bg-[#f5f6f2] disabled:text-[#788077]`} /></label>
            <label className="block text-xs font-medium text-[#596257]">Daily base rate (KSh)<input disabled value={values.dailyBaseRate} className={`${fieldClass} disabled:bg-[#f5f6f2] disabled:text-[#788077]`} /></label>
          </div>
        </section>

        <div className="flex justify-end gap-2 border-t border-[#edf0e9] pt-4"><button type="button" onClick={onClose} className="rounded-lg border border-[#e1e5dc] px-4 py-2.5 text-xs font-semibold text-[#596257]">Cancel</button><button type="submit" className="rounded-lg bg-[#192820] px-4 py-2.5 text-xs font-semibold text-white">Save car</button></div>
      </form>
    </section>
  </div>
}

export default AddCarForm
