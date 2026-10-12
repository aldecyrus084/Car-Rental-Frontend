import { useState } from "react"
import { Icon } from "../AdminSidebar"
import AddPaymentForm from "../forms/AddPaymentForm"
import AdminLayout from "../layout/AdminLayout"

type Payment = { reference: string; customer: string; amount: string; date: string; status: string }
const columns: { key: keyof Payment; label: string }[] = [
  { key: "reference", label: "Reference" },
  { key: "customer", label: "Customer" },
  { key: "amount", label: "Amount" },
  { key: "date", label: "Date" },
  { key: "status", label: "Status" },
]

function exportPayments(records: Payment[]) {
  const rows = [columns.map(({ label }) => label), ...records.map((record) => columns.map(({ key }) => record[key]))]
  const csv = rows.map((row) => row.map((cell) => `"${cell.replaceAll('"', '""')}"`).join(",")).join("\n")
  const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }))
  const link = document.createElement("a")
  link.href = url
  link.download = "payments.csv"
  link.click()
  URL.revokeObjectURL(url)
}

function PaymentsPage() {
  const [records, setRecords] = useState<Payment[]>([
    { reference: "PAY-20481", customer: "Maya Johnson", amount: "$420.00", date: "Oct 12, 2026", status: "Paid" },
    { reference: "PAY-20480", customer: "Noah Williams", amount: "$285.00", date: "Oct 12, 2026", status: "Pending" },
    { reference: "PAY-20479", customer: "Olivia Brown", amount: "$610.00", date: "Oct 11, 2026", status: "Paid" },
    { reference: "PAY-20478", customer: "Ethan Davis", amount: "$190.00", date: "Oct 10, 2026", status: "Overdue" },
  ])
  const [search, setSearch] = useState("")
  const [showForm, setShowForm] = useState(false)
  const filteredRecords = records.filter((record) => Object.values(record).join(" ").toLowerCase().includes(search.toLowerCase()))
  const paidCount = records.filter((record) => record.status === "Paid").length
  const totalPaid = records.filter((record) => record.status === "Paid").reduce((total, record) => total + Number.parseFloat(record.amount.replace("$", "")), 0)

  const addPayment = (values: Record<string, string>) => {
    setRecords((current) => [{ reference: values.reference, customer: values.customer, amount: values.amount, date: values.date, status: "Paid" }, ...current])
    setShowForm(false)
  }

  return <AdminLayout eyebrow="Administration / Payments" title={<>MOTION <span className="font-normal text-[#899187]">· Payments</span></>}>
    <div className="flex flex-wrap items-end justify-between gap-4"><div><p className="text-xs font-medium uppercase tracking-[0.16em] text-[#8b9388]">Finance workspace</p><h2 className="mt-2 text-2xl font-semibold tracking-tight sm:text-[28px]">Payments</h2><p className="mt-1.5 text-sm text-[#798177]">Review rental charges, payment status, and recent transactions.</p></div><button onClick={() => setShowForm(true)} className="inline-flex h-10 items-center gap-2 rounded-lg bg-[#192820] px-4 text-xs font-semibold text-white transition-colors hover:bg-[#293b30]"><Icon name="plus" className="h-4 w-4" />Record payment</button></div>
    <section aria-label="Payment summary" className="mt-7 grid gap-3 sm:grid-cols-3"><article className="rounded-xl border border-[#e7e9e2] bg-white p-5"><p className="text-xs font-medium text-[#788077]">Transactions</p><p className="mt-3 text-2xl font-semibold tracking-tight">{records.length.toString().padStart(2, "0")}</p></article><article className="rounded-xl border border-[#e7e9e2] bg-white p-5"><p className="text-xs font-medium text-[#788077]">Paid transactions</p><p className="mt-3 text-2xl font-semibold tracking-tight">{paidCount}</p></article><article className="rounded-xl border border-[#e7e9e2] bg-white p-5"><p className="text-xs font-medium text-[#788077]">Collected</p><p className="mt-3 text-2xl font-semibold tracking-tight">${totalPaid.toFixed(2)}</p></article></section>
    <section className="mt-4 rounded-xl border border-[#e7e9e2] bg-white"><div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#edf0e9] px-5 py-4 sm:px-6"><div><h3 className="text-sm font-semibold">Payment history</h3><p className="mt-1 text-xs text-[#858d82]">Review recent rental transactions</p></div><div className="flex items-center gap-2"><label className="flex h-9 items-center gap-2 rounded-lg border border-[#e6e9e1] px-2.5 text-[#899187]"><Icon name="search" className="h-4 w-4" /><input aria-label="Search payments" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search payments" className="w-32 bg-transparent text-xs text-[#202720] outline-none placeholder:text-[#9ba197] sm:w-44" /></label><button onClick={() => exportPayments(filteredRecords)} className="inline-flex h-9 items-center gap-2 rounded-lg border border-[#e6e9e1] px-3 text-xs font-semibold text-[#596257] hover:bg-[#f8f9f6]"><Icon name="download" className="h-4 w-4" /><span className="hidden sm:inline">Export</span></button></div></div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-170 text-left">
            <thead>
                <tr className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#9aa095]">
                    {columns.map((column) => <th key={column.key} className="px-5 py-3">{column.label}</th>)}
                    <th className="px-5 py-3 text-right">Actions</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-[#f0f1ed]">
                {filteredRecords.map((record, index) => 
                    <tr key={`${record.reference}-${index}`} className="text-xs hover:bg-[#fbfcf9]">
                        {columns.map((column) => 
                        <td key={column.key} className="px-5 py-4">{column.key === "status" ? <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-medium ${record.status === "Paid" ? "bg-[#edf5e5] text-[#638046]" : record.status === "Overdue" ? "bg-[#f8ece8] text-[#a35e4b]" : "bg-[#fbf0e5] text-[#a46e42]"}`}><span className="h-1.5 w-1.5 rounded-full bg-current" />{record.status}</span> : <span className={`${column.key === "reference" ? "font-semibold text-[#343d34]" : "text-[#687166]"}`}>{record[column.key]}</span>}</td>)}<td className="px-5 py-4 text-right"><button onClick={() => setRecords((current) => current.filter((item) => item !== record))} className="rounded-md border border-[#e6e9e1] px-2.5 py-1.5 text-[10px] font-medium text-[#747d72] hover:border-[#d7a998] hover:text-[#a35e4b]">Remove</button></td></tr>)}
                {filteredRecords.length === 0 && <tr><td colSpan={columns.length + 1} className="px-6 py-12 text-center text-xs text-[#858d82]">No payments found.</td></tr>}
      </tbody></table></div><div className="flex items-center justify-between border-t border-[#edf0e9] px-6 py-3 text-[11px] text-[#8c9489]"><span>Showing {filteredRecords.length} of {records.length} transactions</span><span>Demo data · changes aren’t saved to a backend</span></div>
    </section>
    {showForm && <AddPaymentForm onClose={() => setShowForm(false)} onSave={addPayment} />}
  </AdminLayout>
}

export default PaymentsPage
