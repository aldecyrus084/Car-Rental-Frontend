import { useState, type FormEvent } from "react"
import { Icon } from "../AdminSidebar"
import { pricingTypeOptions, vehicleTypeOptions } from "../fleetOptions"

export type PricingAreaFormValues = {
  name: string
  city: string
  province: string
  areaType: string
  vehicleTypeIds: string[]
  pricingType: string
  amount: number
  minimumDays: number | null
  maximumDays: number | null
  effectiveFrom: string
  effectiveTo: string | null
}

type AddPricingAreaFormProps = {
  onClose: () => void
  onSave: (values: PricingAreaFormValues) => void
}

const areaTypes = ["City center", "Airport", "Urban", "Suburban", "Rural", "Intercity", "Custom"]
const fieldClass = "mt-1.5 h-10 w-full rounded-lg border border-[#e1e5dc] bg-white px-3 text-sm font-normal text-[#202720] outline-none focus:border-[#81945e]"

function AddPricingAreaForm({ onClose, onSave }: AddPricingAreaFormProps) {
  const [values, setValues] = useState({
    name: "",
    city: "",
    province: "",
    areaType: "",
    vehicleTypeIds: [] as string[],
    pricingType: pricingTypeOptions[0],
    amount: "",
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
    if (values.effectiveTo && values.effectiveTo < values.effectiveFrom) {
      setError("Effective to must be on or after effective from.")
      return
    }

    onSave({
      name: values.name.trim(),
      city: values.city.trim(),
      province: values.province.trim(),
      areaType: values.areaType,
      vehicleTypeIds: values.vehicleTypeIds,
      pricingType: values.pricingType,
      amount: Number(values.amount),
      minimumDays: values.minimumDays ? Number(values.minimumDays) : null,
      maximumDays: values.maximumDays ? Number(values.maximumDays) : null,
      effectiveFrom: values.effectiveFrom,
      effectiveTo: values.effectiveTo || null,
    })
  }

  return <div role="presentation" className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose() }}>
    <section role="dialog" aria-modal="true" aria-labelledby="pricing-area-form-title" className="max-h-[calc(100vh-2rem)] w-full max-w-3xl overflow-y-auto rounded-xl bg-white p-6 shadow-2xl">
      <div className="flex items-start justify-between gap-4"><div><h2 id="pricing-area-form-title" className="text-lg font-semibold">Create pricing area</h2><p className="mt-1 text-xs text-[#858d82]">Set location-specific rates and vehicle applicability.</p></div><button type="button" aria-label="Close pricing area form" onClick={onClose} className="rounded-lg p-1.5 text-[#788077] hover:bg-[#f2f4ef]"><Icon name="close" className="h-5 w-5" /></button></div>
      <form onSubmit={submit} className="mt-5 space-y-5">
        <section aria-labelledby="pricing-area-location-title" className="rounded-lg border border-[#e7e9e2] p-4 sm:p-5">
          <div className="mb-4"><h3 id="pricing-area-location-title" className="text-sm font-semibold text-[#343d34]">Location</h3><p className="mt-1 text-xs text-[#858d82]">Identify the area this pricing applies to.</p></div>
          <div className="grid gap-x-4 gap-y-3 sm:grid-cols-2">
            <label className="block text-xs font-medium text-[#596257]">Name<input required value={values.name} onChange={(event) => setValues((current) => ({ ...current, name: event.target.value }))} placeholder="e.g. Nairobi Central" className={fieldClass} /></label>
            <label className="block text-xs font-medium text-[#596257]">Area type<select required value={values.areaType} onChange={(event) => setValues((current) => ({ ...current, areaType: event.target.value }))} className={fieldClass}><option value="">Select area type</option>{areaTypes.map((type) => <option key={type}>{type}</option>)}</select></label>
            <label className="block text-xs font-medium text-[#596257]">City<input required value={values.city} onChange={(event) => setValues((current) => ({ ...current, city: event.target.value }))} className={fieldClass} /></label>
            <label className="block text-xs font-medium text-[#596257]">Province<input required value={values.province} onChange={(event) => setValues((current) => ({ ...current, province: event.target.value }))} className={fieldClass} /></label>
          </div>
        </section>

        <section aria-labelledby="pricing-area-rates-title" className="rounded-lg border border-[#e7e9e2] p-4 sm:p-5">
          <div className="mb-4"><h3 id="pricing-area-rates-title" className="text-sm font-semibold text-[#343d34]">Rate configuration</h3><p className="mt-1 text-xs text-[#858d82]">Choose vehicle types and the price schedule.</p></div>
          <fieldset>
            <legend className="text-xs font-medium text-[#596257]">Vehicle types</legend>
            <div className="mt-2 grid gap-2 sm:grid-cols-2">
              {vehicleTypeOptions.map((vehicleType) => <label key={vehicleType.id} className="flex min-h-10 items-center gap-2 rounded-md border border-[#edf0e9] px-3 text-xs text-[#343d34]"><input type="checkbox" checked={values.vehicleTypeIds.includes(vehicleType.id)} onChange={() => toggleVehicleType(vehicleType.id)} className="h-4 w-4 accent-[#53634e]" /><span>{vehicleType.name}</span><span className="ml-auto text-[10px] text-[#858d82]">{vehicleType.transmissionType} · {vehicleType.fuelType}</span></label>)}
            </div>
          </fieldset>
          <div className="mt-4 grid gap-x-4 gap-y-3 sm:grid-cols-2">
            <label className="block text-xs font-medium text-[#596257]">Pricing type<select required value={values.pricingType} onChange={(event) => setValues((current) => ({ ...current, pricingType: event.target.value }))} className={fieldClass}>{pricingTypeOptions.map((type) => <option key={type}>{type}</option>)}</select></label>
            <label className="block text-xs font-medium text-[#596257]">Amount (KSh)<input required type="number" min="0.01" step="0.01" value={values.amount} onChange={(event) => setValues((current) => ({ ...current, amount: event.target.value }))} placeholder="0.00" className={fieldClass} /></label>
            <label className="block text-xs font-medium text-[#596257]">Minimum days <span className="font-normal text-[#899187]">(optional)</span><input type="number" min="1" step="1" value={values.minimumDays} onChange={(event) => setValues((current) => ({ ...current, minimumDays: event.target.value }))} className={fieldClass} /></label>
            <label className="block text-xs font-medium text-[#596257]">Maximum days <span className="font-normal text-[#899187]">(optional)</span><input type="number" min={values.minimumDays || "1"} step="1" value={values.maximumDays} onChange={(event) => setValues((current) => ({ ...current, maximumDays: event.target.value }))} className={fieldClass} /></label>
            <label className="block text-xs font-medium text-[#596257]">Effective from<input required type="date" value={values.effectiveFrom} onChange={(event) => setValues((current) => ({ ...current, effectiveFrom: event.target.value, effectiveTo: current.effectiveTo && current.effectiveTo < event.target.value ? "" : current.effectiveTo }))} className={fieldClass} /></label>
            <label className="block text-xs font-medium text-[#596257]">Effective to <span className="font-normal text-[#899187]">(optional)</span><input type="date" min={values.effectiveFrom || undefined} value={values.effectiveTo} onChange={(event) => setValues((current) => ({ ...current, effectiveTo: event.target.value }))} className={fieldClass} /></label>
          </div>
        </section>
        {error && <p role="alert" className="text-xs text-[#a35e4b]">{error}</p>}
        <div className="flex justify-end gap-2 border-t border-[#edf0e9] pt-4"><button type="button" onClick={onClose} className="rounded-lg border border-[#e1e5dc] px-4 py-2.5 text-xs font-semibold text-[#596257]">Cancel</button><button type="submit" className="rounded-lg bg-[#192820] px-4 py-2.5 text-xs font-semibold text-white">Save pricing area</button></div>
      </form>
    </section>
  </div>
}

export default AddPricingAreaForm