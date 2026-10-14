import { useState, type FormEvent } from "react"
import { Icon } from "../AdminSidebar"
import type { BranchValues } from "../../../features/branches/branches.store"

type BranchFormProps = {
  initialValues?: BranchValues
  onClose: () => void
  onSave: (values: BranchValues) => void
}

const fieldClass = "mt-1.5 h-10 w-full rounded-lg border border-[#e1e5dc] bg-white px-3 text-sm font-normal text-[#202720] outline-none focus:border-[#81945e]"

function BranchForm({ initialValues, onClose, onSave }: BranchFormProps) {
  const [values, setValues] = useState<BranchValues>(initialValues ?? {
    name: "",
    manager: "",
    address: "",
    status: "Open",
  })

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    onSave(values)
  }

  return <div role="presentation" className="fixed inset-0 z-50 grid place-items-center bg-[#101713]/55 p-4 backdrop-blur-sm" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose() }}>
    <section role="dialog" aria-modal="true" aria-labelledby="branch-form-title" className="w-full max-w-xl overflow-hidden rounded-xl bg-white shadow-2xl">
      <header className="flex items-start justify-between gap-4 border-b border-[#edf0e9] px-6 py-5 sm:px-7">
        <div><p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[#899187]">Branch directory</p><h2 id="branch-form-title" className="mt-1 text-lg font-semibold text-[#202720]">{initialValues ? "Edit branch" : "Add branch"}</h2><p className="mt-1 text-xs text-[#858d82]">Branch information and operating status.</p></div>
        <button type="button" aria-label="Close branch form" onClick={onClose} className="grid h-9 w-9 place-items-center rounded-lg text-[#788077] transition-colors hover:bg-[#f2f4ef]"><Icon name="close" className="h-4 w-4" /></button>
      </header>
      <form onSubmit={submit} className="space-y-4 px-6 py-5 sm:px-7">
        <label className="block text-xs font-medium text-[#596257]">Branch name<input required autoFocus value={values.name} onChange={(event) => setValues((current) => ({ ...current, name: event.target.value }))} placeholder="e.g. Westlands" className={fieldClass} /></label>
        <label className="block text-xs font-medium text-[#596257]">Branch manager<input required value={values.manager} onChange={(event) => setValues((current) => ({ ...current, manager: event.target.value }))} placeholder="Manager name" className={fieldClass} /></label>
        <label className="block text-xs font-medium text-[#596257]">Address<input required value={values.address} onChange={(event) => setValues((current) => ({ ...current, address: event.target.value }))} placeholder="Street, city" className={fieldClass} /></label>
        <label className="block text-xs font-medium text-[#596257]">Status<select value={values.status} onChange={(event) => setValues((current) => ({ ...current, status: event.target.value as BranchValues["status"] }))} className={fieldClass}><option value="Open">Open</option><option value="Closed">Closed</option></select></label>
        <footer className="flex justify-end gap-2 border-t border-[#edf0e9] pt-4"><button type="button" onClick={onClose} className="rounded-lg border border-[#e1e5dc] px-4 py-2.5 text-xs font-semibold text-[#596257]">Cancel</button><button type="submit" className="rounded-lg bg-[#192820] px-4 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-[#293b30]">{initialValues ? "Save changes" : "Create branch"}</button></footer>
      </form>
    </section>
  </div>
}

export default BranchForm