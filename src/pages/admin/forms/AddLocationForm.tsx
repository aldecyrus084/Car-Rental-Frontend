import { useState, type FormEvent } from "react"
import { Icon } from "../AdminSidebar"

type AddLocationFormProps = { onClose: () => void; onSave: (values: Record<string, string>) => void }

function AddLocationForm({ onClose, onSave }: AddLocationFormProps) {
  const [values, setValues] = useState({ branch: "", manager: "", address: "" })
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    onSave(values)
  }

  return <div role="presentation" className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose() }}>
    <section role="dialog" aria-modal="true" aria-labelledby="location-form-title" className="w-full max-w-lg rounded-xl bg-white p-6 shadow-2xl">
      <div className="flex items-start justify-between gap-4"><div><h2 id="location-form-title" className="text-lg font-semibold">Add location</h2><p className="mt-1 text-xs text-[#858d82]">Add a branch to the directory.</p></div><button aria-label="Close location form" onClick={onClose} className="rounded-lg p-1.5 text-[#788077] hover:bg-[#f2f4ef]"><Icon name="close" className="h-5 w-5" /></button></div>
      <form onSubmit={submit} className="mt-5 space-y-4">
        <label className="block text-xs font-medium text-[#596257]">Branch name<input required value={values.branch} onChange={(event) => setValues((current) => ({ ...current, branch: event.target.value }))} className="mt-1.5 h-10 w-full rounded-lg border border-[#e1e5dc] px-3 text-sm font-normal text-[#202720] outline-none focus:border-[#81945e]" /></label>
        <label className="block text-xs font-medium text-[#596257]">Branch manager<input required value={values.manager} onChange={(event) => setValues((current) => ({ ...current, manager: event.target.value }))} className="mt-1.5 h-10 w-full rounded-lg border border-[#e1e5dc] px-3 text-sm font-normal text-[#202720] outline-none focus:border-[#81945e]" /></label>
        <label className="block text-xs font-medium text-[#596257]">Address<input required value={values.address} onChange={(event) => setValues((current) => ({ ...current, address: event.target.value }))} className="mt-1.5 h-10 w-full rounded-lg border border-[#e1e5dc] px-3 text-sm font-normal text-[#202720] outline-none focus:border-[#81945e]" /></label>
        <div className="flex justify-end gap-2 border-t border-[#edf0e9] pt-4"><button type="button" onClick={onClose} className="rounded-lg border border-[#e1e5dc] px-4 py-2.5 text-xs font-semibold text-[#596257]">Cancel</button><button type="submit" className="rounded-lg bg-[#192820] px-4 py-2.5 text-xs font-semibold text-white">Save location</button></div>
      </form>
    </section>
  </div>
}

export default AddLocationForm
