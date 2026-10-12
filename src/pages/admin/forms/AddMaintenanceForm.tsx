import { useState, type FormEvent } from "react"
import { Icon } from "../AdminSidebar"

type AddMaintenanceFormProps = { onClose: () => void; onSave: (values: Record<string, string>) => void }

function AddMaintenanceForm({ onClose, onSave }: AddMaintenanceFormProps) {
  const [values, setValues] = useState({ vehicle: "", service: "", branch: "", due: "" })
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    onSave(values)
  }

  return <div role="presentation" className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose() }}>
    <section role="dialog" aria-modal="true" aria-labelledby="maintenance-form-title" className="w-full max-w-lg rounded-xl bg-white p-6 shadow-2xl">
      <div className="flex items-start justify-between gap-4"><div><h2 id="maintenance-form-title" className="text-lg font-semibold">Schedule service</h2><p className="mt-1 text-xs text-[#858d82]">Add work to the maintenance schedule.</p></div><button aria-label="Close maintenance form" onClick={onClose} className="rounded-lg p-1.5 text-[#788077] hover:bg-[#f2f4ef]"><Icon name="close" className="h-5 w-5" /></button></div>
      <form onSubmit={submit} className="mt-5 space-y-4">
        <label className="block text-xs font-medium text-[#596257]">Vehicle<input required value={values.vehicle} onChange={(event) => setValues((current) => ({ ...current, vehicle: event.target.value }))} className="mt-1.5 h-10 w-full rounded-lg border border-[#e1e5dc] px-3 text-sm font-normal text-[#202720] outline-none focus:border-[#81945e]" /></label>
        <label className="block text-xs font-medium text-[#596257]">Service required<input required value={values.service} onChange={(event) => setValues((current) => ({ ...current, service: event.target.value }))} className="mt-1.5 h-10 w-full rounded-lg border border-[#e1e5dc] px-3 text-sm font-normal text-[#202720] outline-none focus:border-[#81945e]" /></label>
        <label className="block text-xs font-medium text-[#596257]">Service location<input required value={values.branch} onChange={(event) => setValues((current) => ({ ...current, branch: event.target.value }))} className="mt-1.5 h-10 w-full rounded-lg border border-[#e1e5dc] px-3 text-sm font-normal text-[#202720] outline-none focus:border-[#81945e]" /></label>
        <label className="block text-xs font-medium text-[#596257]">Due date<input required value={values.due} onChange={(event) => setValues((current) => ({ ...current, due: event.target.value }))} className="mt-1.5 h-10 w-full rounded-lg border border-[#e1e5dc] px-3 text-sm font-normal text-[#202720] outline-none focus:border-[#81945e]" /></label>
        <div className="flex justify-end gap-2 border-t border-[#edf0e9] pt-4"><button type="button" onClick={onClose} className="rounded-lg border border-[#e1e5dc] px-4 py-2.5 text-xs font-semibold text-[#596257]">Cancel</button><button type="submit" className="rounded-lg bg-[#192820] px-4 py-2.5 text-xs font-semibold text-white">Schedule service</button></div>
      </form>
    </section>
  </div>
}

export default AddMaintenanceForm
