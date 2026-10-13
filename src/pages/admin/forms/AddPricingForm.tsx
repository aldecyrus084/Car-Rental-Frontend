import { useState, type FormEvent } from "react"
import { Icon } from "../AdminSidebar"
import { pricingTypeOptions, vehicleTypeOptions } from "../fleetOptions"

export type PricingFormValues = {
  vehicleTypeIds: string[]
  pricingType: string
  rate: number
  minimumDays: string
  maximumDays: string
  effectiveFrom: string
  effectiveTo: string
}

type AddPricingFormProps = {
  onClose: () => void
  onSave: (values: PricingFormValues) => void
}

const fieldClass = "mt-1.5 h-10 w-full rounded-lg border border-[#e1e5dc] bg-white px-3 text-sm font-normal text-[#202720] outline-none focus:border-[#81945e]"

function AddPricingForm({ onClose, onSave }: AddPricingFormProps) {
  const [values, setValues] = useState<PricingFormValues>({
    vehicleTypeIds: [],
    pricingType: pricingTypeOptions[0],
    rate: 0,
    minimumDays: "",
    maximumDays: "",
    effectiveFrom: "",
    effectiveTo: "",
  })
  const [error, setError] = useState("")

  const toggleVehicleType = (vehicleTypeId: string) => {
    setValues((current) => ({
      ...current,
      vehicleTypeIds: current.vehicleTypeIds.includes(vehicleTypeId)
        ? current.vehicleTypeIds.filter((id) => id !== vehicleTypeId)
        : [...current.vehicleTypeIds, vehicleTypeId],
    }))
    setError("")
  }

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (values.vehicleTypeIds.length === 0) {
      setError("Select at least one vehicle type.")
      return
    }
    if (values.minimumDays && values.maximumDays && Number(values.maximumDays) < Number(values.minimumDays)) {
      setError("Maximum days must be greater than or equal to minimum days.")
      return
    }
    if (values.effectiveTo < values.effectiveFrom) {
      setError("Effective to must be on or after effective from.")
      return
    }
    onSave(values)
  }

  return <div role="presentation" className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose() }}>
    <section role="dialog" aria-modal="true" aria-labelledby="pricing-form-title" className="max-h-[calc(100vh-2rem)] w-full max-w-2xl overflow-y-auto rounded-xl bg-white p-6 shadow-2xl">
      <div className="flex items-start justify-between gap-4"><div><h2 id="pricing-form-title" className="text-lg font-semibold">Create pricing rule</h2><p className="mt-1 text-xs text-[#858d82]">Set a rate and validity period for selected vehicle types.</p></div><button type="button" aria-label="Close pricing form" onClick={onClose} className="rounded-lg p-1.5 text-[#788077] hover:bg-[#f2f4ef]"><Icon name="close" className="h-5 w-5" /></button></div>
      <form onSubmit={submit} className="mt-5 space-y-4">
        <fieldset className="rounded-lg border border-[#e7e9e2] p-4">
          <legend className="px-1 text-xs font-medium text-[#596257]">Vehicle types</legend>
          <p className="mb-3 text-[11px] text-[#858d82]">Select every vehicle type this pricing rule applies to.</p>
          <div className="grid gap-2 sm:grid-cols-2">
            {vehicleTypeOptions.map((vehicleType) => <label key={vehicleType.id} className="flex min-h-10 items-center gap-2 rounded-md border border-[#edf0e9] px-3 text-xs text-[#343d34]"><input type="checkbox" checked={values.vehicleTypeIds.includes(vehicleType.id)} onChange={() => toggleVehicleType(vehicleType.id)} className="h-4 w-4 accent-[#53634e]" /><span>{vehicleType.name}</span><span className="ml-auto text-[10px] text-[#858d82]">{vehicleType.transmissionType} · {vehicleType.fuelType}</span></label>)}
          </div>
        </fieldset>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block text-xs font-medium text-[#596257]">Pricing type<select required value={values.pricingType} onChange={(event) => setValues((current) => ({ ...current, pricingType: event.target.value }))} className={fieldClass}>{pricingTypeOptions.map((type) => <option key={type}>{type}</option>)}</select></label>
          <label className="block text-xs font-medium text-[#596257]">Rate (KSh)<input required type="number" min="0.01" step="0.01" value={values.rate || ""} onChange={(event) => setValues((current) => ({ ...current, rate: Number(event.target.value) }))} placeholder="0.00" className={fieldClass} /></label>
          <label className="block text-xs font-medium text-[#596257]">Minimum days <span className="font-normal text-[#899187]">(optional)</span><input type="number" min="1" step="1" value={values.minimumDays} onChange={(event) => setValues((current) => ({ ...current, minimumDays: event.target.value }))} className={fieldClass} /></label>
          <label className="block text-xs font-medium text-[#596257]">Maximum days <span className="font-normal text-[#899187]">(optional)</span><input type="number" min={values.minimumDays || "1"} step="1" value={values.maximumDays} onChange={(event) => setValues((current) => ({ ...current, maximumDays: event.target.value }))} className={fieldClass} /></label>
          <label className="block text-xs font-medium text-[#596257]">Effective from<input required type="date" value={values.effectiveFrom} onChange={(event) => setValues((current) => ({ ...current, effectiveFrom: event.target.value, effectiveTo: current.effectiveTo && current.effectiveTo < event.target.value ? "" : current.effectiveTo }))} className={fieldClass} /></label>
          <label className="block text-xs font-medium text-[#596257]">Effective to<input required type="date" min={values.effectiveFrom || undefined} value={values.effectiveTo} onChange={(event) => setValues((current) => ({ ...current, effectiveTo: event.target.value }))} className={fieldClass} /></label>
        </div>
        {error && <p role="alert" className="text-xs text-[#a35e4b]">{error}</p>}
        <div className="flex justify-end gap-2 border-t border-[#edf0e9] pt-4"><button type="button" onClick={onClose} className="rounded-lg border border-[#e1e5dc] px-4 py-2.5 text-xs font-semibold text-[#596257]">Cancel</button><button type="submit" className="rounded-lg bg-[#192820] px-4 py-2.5 text-xs font-semibold text-white">Save pricing</button></div>
      </form>
    </section>
  </div>
}

export default AddPricingForm