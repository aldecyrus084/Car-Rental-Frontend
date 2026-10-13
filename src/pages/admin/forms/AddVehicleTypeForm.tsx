import { useState, type FormEvent } from "react"
import { Icon } from "../AdminSidebar"

export type VehicleTypeValues = {
  name: string
  description: string
  seatingCapacity: string
  transmissionType: string
  fuelType: string
  dailyBaseRate: string
}

type AddVehicleTypeFormProps = {
  onClose: () => void
  onSave: (values: VehicleTypeValues) => void
}

const transmissions = ["Automatic", "Manual", "CVT"]
const fuelTypes = ["Petrol", "Diesel", "Hybrid", "Electric"]

function AddVehicleTypeForm({ onClose, onSave }: AddVehicleTypeFormProps) {
  const [values, setValues] = useState<VehicleTypeValues>({
    name: "",
    description: "",
    seatingCapacity: "5",
    transmissionType: transmissions[0],
    fuelType: fuelTypes[0],
    dailyBaseRate: "",
  })

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    onSave(values)
  }

  return <div role="presentation" className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose() }}>
    <section role="dialog" aria-modal="true" aria-labelledby="vehicle-type-form-title" className="max-h-[calc(100vh-2rem)] w-full max-w-2xl overflow-y-auto rounded-xl bg-white p-6 shadow-2xl">
      <div className="flex items-start justify-between gap-4"><div><h2 id="vehicle-type-form-title" className="text-lg font-semibold">Add vehicle type</h2><p className="mt-1 text-xs text-[#858d82]">Set vehicle specifications and the daily base rate.</p></div><button type="button" aria-label="Close vehicle type form" onClick={onClose} className="rounded-lg p-1.5 text-[#788077] hover:bg-[#f2f4ef]"><Icon name="close" className="h-5 w-5" /></button></div>
      <form onSubmit={submit} className="mt-5 grid gap-4 sm:grid-cols-2">
        <label className="block text-xs font-medium text-[#596257] sm:col-span-2">Name<input required autoFocus value={values.name} onChange={(event) => setValues((current) => ({ ...current, name: event.target.value }))} placeholder="e.g. Compact sedan" className="mt-1.5 h-10 w-full rounded-lg border border-[#e1e5dc] px-3 text-sm font-normal text-[#202720] outline-none placeholder:text-[#9ba197] focus:border-[#81945e]" /></label>
        <label className="block text-xs font-medium text-[#596257] sm:col-span-2">Description <span className="font-normal text-[#899187]">(optional)</span><textarea rows={3} value={values.description} onChange={(event) => setValues((current) => ({ ...current, description: event.target.value }))} placeholder="Notes about this vehicle category" className="mt-1.5 w-full resize-y rounded-lg border border-[#e1e5dc] px-3 py-2.5 text-sm font-normal text-[#202720] outline-none placeholder:text-[#9ba197] focus:border-[#81945e]" /></label>
        <label className="block text-xs font-medium text-[#596257]">Seating capacity<input required type="number" min="1" step="1" value={values.seatingCapacity} onChange={(event) => setValues((current) => ({ ...current, seatingCapacity: event.target.value }))} className="mt-1.5 h-10 w-full rounded-lg border border-[#e1e5dc] px-3 text-sm font-normal text-[#202720] outline-none focus:border-[#81945e]" /></label>
        <label className="block text-xs font-medium text-[#596257]">Transmission type<select required value={values.transmissionType} onChange={(event) => setValues((current) => ({ ...current, transmissionType: event.target.value }))} className="mt-1.5 h-10 w-full rounded-lg border border-[#e1e5dc] bg-white px-3 text-sm font-normal text-[#202720] outline-none focus:border-[#81945e]">{transmissions.map((transmission) => <option key={transmission}>{transmission}</option>)}</select></label>
        <label className="block text-xs font-medium text-[#596257]">Fuel type<select required value={values.fuelType} onChange={(event) => setValues((current) => ({ ...current, fuelType: event.target.value }))} className="mt-1.5 h-10 w-full rounded-lg border border-[#e1e5dc] bg-white px-3 text-sm font-normal text-[#202720] outline-none focus:border-[#81945e]">{fuelTypes.map((fuel) => <option key={fuel}>{fuel}</option>)}</select></label>
        <label className="block text-xs font-medium text-[#596257]">Daily base rate<input required type="number" min="0.01" step="0.01" value={values.dailyBaseRate} onChange={(event) => setValues((current) => ({ ...current, dailyBaseRate: event.target.value }))} placeholder="0.00" className="mt-1.5 h-10 w-full rounded-lg border border-[#e1e5dc] px-3 text-sm font-normal text-[#202720] outline-none placeholder:text-[#9ba197] focus:border-[#81945e]" /><span className="mt-1 block text-[10px] font-normal text-[#899187]">Amount charged per day, in KSh.</span></label>
        <div className="flex justify-end gap-2 border-t border-[#edf0e9] pt-4 sm:col-span-2"><button type="button" onClick={onClose} className="rounded-lg border border-[#e1e5dc] px-4 py-2.5 text-xs font-semibold text-[#596257]">Cancel</button><button type="submit" className="rounded-lg bg-[#192820] px-4 py-2.5 text-xs font-semibold text-white">Save vehicle type</button></div>
      </form>
    </section>
  </div>
}

export default AddVehicleTypeForm