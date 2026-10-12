import { useState, type FormEvent } from "react"
import { Icon } from "../AdminSidebar"

type AddCarFormProps = { onClose: () => void; onSave: (values: Record<string, string>) => void }

function AddCarForm({ onClose, onSave }: AddCarFormProps) {
  const [values, setValues] = useState({ vehicle: "", registration: "", category: "", branch: "" })
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    onSave(values)
  }

  return <div role="presentation" className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose() }}>
    <section role="dialog" aria-modal="true" aria-labelledby="car-form-title" className="w-full max-w-lg rounded-xl bg-white p-6 shadow-2xl">
      <div className="flex items-start justify-between gap-4"><div><h2 id="car-form-title" className="text-lg font-semibold">Add car</h2><p className="mt-1 text-xs text-[#858d82]">Add a vehicle to the fleet.</p></div><button aria-label="Close car form" onClick={onClose} className="rounded-lg p-1.5 text-[#788077] hover:bg-[#f2f4ef]"><Icon name="close" className="h-5 w-5" /></button></div>
      <form onSubmit={submit} className="mt-5 space-y-4">
        <label className="block text-xs font-medium text-[#596257]">Vehicle name<input required value={values.vehicle} onChange={(event) => setValues((current) => ({ ...current, vehicle: event.target.value }))} className="mt-1.5 h-10 w-full rounded-lg border border-[#e1e5dc] px-3 text-sm font-normal text-[#202720] outline-none focus:border-[#81945e]" /></label>
        <label className="block text-xs font-medium text-[#596257]">Registration<input required value={values.registration} onChange={(event) => setValues((current) => ({ ...current, registration: event.target.value }))} className="mt-1.5 h-10 w-full rounded-lg border border-[#e1e5dc] px-3 text-sm font-normal text-[#202720] outline-none focus:border-[#81945e]" /></label>
        <label className="block text-xs font-medium text-[#596257]">Category<input required value={values.category} onChange={(event) => setValues((current) => ({ ...current, category: event.target.value }))} className="mt-1.5 h-10 w-full rounded-lg border border-[#e1e5dc] px-3 text-sm font-normal text-[#202720] outline-none focus:border-[#81945e]" /></label>
        <label className="block text-xs font-medium text-[#596257]">Branch<input required value={values.branch} onChange={(event) => setValues((current) => ({ ...current, branch: event.target.value }))} className="mt-1.5 h-10 w-full rounded-lg border border-[#e1e5dc] px-3 text-sm font-normal text-[#202720] outline-none focus:border-[#81945e]" /></label>
        <div className="flex justify-end gap-2 border-t border-[#edf0e9] pt-4"><button type="button" onClick={onClose} className="rounded-lg border border-[#e1e5dc] px-4 py-2.5 text-xs font-semibold text-[#596257]">Cancel</button><button type="submit" className="rounded-lg bg-[#192820] px-4 py-2.5 text-xs font-semibold text-white">Save car</button></div>
      </form>
    </section>
  </div>
}

export default AddCarForm
