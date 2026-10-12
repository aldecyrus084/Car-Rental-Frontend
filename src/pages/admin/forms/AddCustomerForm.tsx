import { useState, type FormEvent } from "react"
import { Icon } from "../AdminSidebar"

type AddCustomerFormProps = {
  onClose: () => void
  onSave: (record: Record<string, string>) => void
}

function AddCustomerForm({ onClose, onSave }: AddCustomerFormProps) {
  const [values, setValues] = useState({ customer: "", email: "", phone: "" })

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    onSave({ ...values, rentals: "—" })
  }

  return <div role="presentation" className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose() }}>
    <section role="dialog" aria-modal="true" aria-labelledby="customer-form-title" className="w-full max-w-lg rounded-xl bg-white p-6 shadow-2xl">
      <div className="flex items-start justify-between gap-4">
        <div><h2 id="customer-form-title" className="text-lg font-semibold">Add customer</h2><p className="mt-1 text-xs text-[#858d82]">Add a customer profile.</p></div>
        <button aria-label="Close form" onClick={onClose} className="rounded-lg p-1.5 text-[#788077] hover:bg-[#f2f4ef]"><Icon name="close" className="h-5 w-5" /></button>
      </div>
      <form onSubmit={submit} className="mt-5 space-y-4">
        <label className="block text-xs font-medium text-[#596257]">Full name<input required value={values.customer} onChange={(event) => setValues((current) => ({ ...current, customer: event.target.value }))} className="mt-1.5 h-10 w-full rounded-lg border border-[#e1e5dc] px-3 text-sm font-normal text-[#202720] outline-none focus:border-[#81945e]" /></label>
        <label className="block text-xs font-medium text-[#596257]">Email address<input required type="email" value={values.email} onChange={(event) => setValues((current) => ({ ...current, email: event.target.value }))} className="mt-1.5 h-10 w-full rounded-lg border border-[#e1e5dc] px-3 text-sm font-normal text-[#202720] outline-none focus:border-[#81945e]" /></label>
        <label className="block text-xs font-medium text-[#596257]">Phone number<input required type="tel" value={values.phone} onChange={(event) => setValues((current) => ({ ...current, phone: event.target.value }))} className="mt-1.5 h-10 w-full rounded-lg border border-[#e1e5dc] px-3 text-sm font-normal text-[#202720] outline-none focus:border-[#81945e]" /></label>
        <div className="flex justify-end gap-2 border-t border-[#edf0e9] pt-4"><button type="button" onClick={onClose} className="rounded-lg border border-[#e1e5dc] px-4 py-2.5 text-xs font-semibold text-[#596257]">Cancel</button><button type="submit" className="rounded-lg bg-[#192820] px-4 py-2.5 text-xs font-semibold text-white">Save customer</button></div>
      </form>
    </section>
  </div>
}

export default AddCustomerForm
