import { useState, type FormEvent } from "react"
import { Icon } from "../AdminSidebar"

type AddPaymentFormProps = { onClose: () => void; onSave: (values: Record<string, string>) => void }

function AddPaymentForm({ onClose, onSave }: AddPaymentFormProps) {
  const [values, setValues] = useState({ reference: "", customer: "", amount: "", date: "" })
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    onSave(values)
  }

  return <div role="presentation" className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose() }}>
    <section role="dialog" aria-modal="true" aria-labelledby="payment-form-title" className="w-full max-w-lg rounded-xl bg-white p-6 shadow-2xl">
      <div className="flex items-start justify-between gap-4"><div><h2 id="payment-form-title" className="text-lg font-semibold">Record payment</h2><p className="mt-1 text-xs text-[#858d82]">Add a transaction to payment history.</p></div><button aria-label="Close payment form" onClick={onClose} className="rounded-lg p-1.5 text-[#788077] hover:bg-[#f2f4ef]"><Icon name="close" className="h-5 w-5" /></button></div>
      <form onSubmit={submit} className="mt-5 space-y-4">
        <label className="block text-xs font-medium text-[#596257]">Payment reference<input required value={values.reference} onChange={(event) => setValues((current) => ({ ...current, reference: event.target.value }))} className="mt-1.5 h-10 w-full rounded-lg border border-[#e1e5dc] px-3 text-sm font-normal text-[#202720] outline-none focus:border-[#81945e]" /></label>
        <label className="block text-xs font-medium text-[#596257]">Customer<input required value={values.customer} onChange={(event) => setValues((current) => ({ ...current, customer: event.target.value }))} className="mt-1.5 h-10 w-full rounded-lg border border-[#e1e5dc] px-3 text-sm font-normal text-[#202720] outline-none focus:border-[#81945e]" /></label>
        <label className="block text-xs font-medium text-[#596257]">Amount<input required inputMode="decimal" value={values.amount} onChange={(event) => setValues((current) => ({ ...current, amount: event.target.value }))} className="mt-1.5 h-10 w-full rounded-lg border border-[#e1e5dc] px-3 text-sm font-normal text-[#202720] outline-none focus:border-[#81945e]" /></label>
        <label className="block text-xs font-medium text-[#596257]">Payment date<input required value={values.date} onChange={(event) => setValues((current) => ({ ...current, date: event.target.value }))} className="mt-1.5 h-10 w-full rounded-lg border border-[#e1e5dc] px-3 text-sm font-normal text-[#202720] outline-none focus:border-[#81945e]" /></label>
        <div className="flex justify-end gap-2 border-t border-[#edf0e9] pt-4"><button type="button" onClick={onClose} className="rounded-lg border border-[#e1e5dc] px-4 py-2.5 text-xs font-semibold text-[#596257]">Cancel</button><button type="submit" className="rounded-lg bg-[#192820] px-4 py-2.5 text-xs font-semibold text-white">Save payment</button></div>
      </form>
    </section>
  </div>
}

export default AddPaymentForm
