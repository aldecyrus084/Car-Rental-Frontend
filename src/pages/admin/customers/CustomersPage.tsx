import { useState } from "react"
import { Icon } from "../AdminSidebar"
import AddCustomerForm from "../forms/AddCustomerForm"
import AdminLayout from "../layout/AdminLayout"

type Customer = { customer: string; email: string; phone: string; rentals: string; status: string }
const columns: { key: keyof Customer; label: string }[] = [
  { key: "customer", label: "Customer" },
  { key: "email", label: "Email" },
  { key: "phone", label: "Phone" },
  { key: "rentals", label: "Rentals" },
  { key: "status", label: "Status" },
]

function exportCustomers(records: Customer[]) {
  const rows = [columns.map(({ label }) => label), ...records.map((record) => columns.map(({ key }) => record[key]))]
  const csv = rows.map((row) => row.map((cell) => `"${cell.replaceAll('"', '""')}"`).join(",")).join("\n")
  const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }))
  const link = document.createElement("a")
  link.href = url
  link.download = "customers.csv"
  link.click()
  URL.revokeObjectURL(url)
}

function CustomersPage() {
  const [records, setRecords] = useState<Customer[]>([
    { customer: "Maya Johnson", email: "maya.johnson@example.com", phone: "+254 712 340 821", rentals: "8 rentals", status: "Active" },
    { customer: "Noah Williams", email: "noah.w@example.com", phone: "+254 733 186 402", rentals: "3 rentals", status: "Active" },
    { customer: "Olivia Brown", email: "olivia.b@example.com", phone: "+254 701 509 277", rentals: "5 rentals", status: "Active" },
    { customer: "Ethan Davis", email: "ethan.d@example.com", phone: "+254 728 411 650", rentals: "1 rental", status: "Review" },
  ])
  const [search, setSearch] = useState("")
  const [showForm, setShowForm] = useState(false)
  const filteredRecords = records.filter((record) => Object.values(record).join(" ").toLowerCase().includes(search.toLowerCase()))
  const activeCount = records.filter((record) => record.status === "Active").length

  const addCustomer = (values: Record<string, string>) => {
    setRecords((current) => [{
      customer: values.customer,
      email: values.email,
      phone: values.phone,
      rentals: values.rentals ?? "—",
      status: "Active",
    }, ...current])
    setShowForm(false)
  }

  return <AdminLayout eyebrow="Administration / Customers" title={<>MOTION <span className="font-normal text-[#899187]">· Customers</span></>}>
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div><p className="text-xs font-medium uppercase tracking-[0.16em] text-[#8b9388]">Customer workspace</p><h2 className="mt-2 text-2xl font-semibold tracking-tight sm:text-[28px]">Customers</h2><p className="mt-1.5 text-sm text-[#798177]">Review customer profiles and rental activity.</p></div>
      <button onClick={() => setShowForm(true)} className="inline-flex h-10 items-center gap-2 rounded-lg bg-[#192820] px-4 text-xs font-semibold text-white transition-colors hover:bg-[#293b30]"><Icon name="plus" className="h-4 w-4" />Add customer</button>
    </div>

    <section aria-label="Customer summary" className="mt-7 grid gap-3 sm:grid-cols-3">
      <article className="rounded-xl border border-[#e7e9e2] bg-white p-5"><p className="text-xs font-medium text-[#788077]">Total customers</p><p className="mt-3 text-2xl font-semibold tracking-tight">{records.length.toString().padStart(2, "0")}</p></article>
      <article className="rounded-xl border border-[#e7e9e2] bg-white p-5"><p className="text-xs font-medium text-[#788077]">Active</p><p className="mt-3 text-2xl font-semibold tracking-tight">{activeCount}</p></article>
      <article className="rounded-xl border border-[#e7e9e2] bg-white p-5"><p className="text-xs font-medium text-[#788077]">Needs review</p><p className="mt-3 text-2xl font-semibold tracking-tight">{records.length - activeCount}</p></article>
    </section>

    <section className="mt-4 rounded-xl border border-[#e7e9e2] bg-white">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#edf0e9] px-5 py-4 sm:px-6">
        <div><h3 className="text-sm font-semibold">Customer records</h3><p className="mt-1 text-xs text-[#858d82]">Search and manage customer profiles</p></div>
        <div className="flex items-center gap-2">
          <label className="flex h-9 items-center gap-2 rounded-lg border border-[#e6e9e1] px-2.5 text-[#899187]"><Icon name="search" className="h-4 w-4" /><input aria-label="Search customers" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search customers" className="w-32 bg-transparent text-xs text-[#202720] outline-none placeholder:text-[#9ba197] sm:w-44" /></label>
          <button onClick={() => exportCustomers(filteredRecords)} className="inline-flex h-9 items-center gap-2 rounded-lg border border-[#e6e9e1] px-3 text-xs font-semibold text-[#596257] hover:bg-[#f8f9f6]"><Icon name="download" className="h-4 w-4" /><span className="hidden sm:inline">Export</span></button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-170 text-left">
          <thead><tr className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#9aa095]">{columns.map((column) => <th key={column.key} className="px-5 py-3">{column.label}</th>)}<th className="px-5 py-3 text-right">Actions</th></tr></thead>
          <tbody className="divide-y divide-[#f0f1ed]">
            {filteredRecords.map((record, index) => <tr key={`${record.email}-${index}`} className="text-xs hover:bg-[#fbfcf9]">{columns.map((column) => <td key={column.key} className="px-5 py-4">{column.key === "status" ? <span className="inline-flex items-center gap-1.5 rounded-full bg-[#edf5e5] px-2.5 py-1 text-[10px] font-medium text-[#638046]"><span className="h-1.5 w-1.5 rounded-full bg-current" />{record.status}</span> : <span className={`${column.key === "customer" ? "font-semibold text-[#343d34]" : "text-[#687166]"}`}>{record[column.key]}</span>}</td>)}<td className="px-5 py-4 text-right"><button onClick={() => setRecords((current) => current.filter((item) => item !== record))} className="rounded-md border border-[#e6e9e1] px-2.5 py-1.5 text-[10px] font-medium text-[#747d72] hover:border-[#d7a998] hover:text-[#a35e4b]">Remove</button></td></tr>)}
            {filteredRecords.length === 0 && <tr><td colSpan={columns.length + 1} className="px-6 py-12 text-center text-xs text-[#858d82]">No customers found. Try another search or add a customer.</td></tr>}
          </tbody>
        </table>
      </div>
      <div className="flex items-center justify-between border-t border-[#edf0e9] px-6 py-3 text-[11px] text-[#8c9489]"><span>Showing {filteredRecords.length} of {records.length} customers</span><span>Demo data · changes aren’t saved to a backend</span></div>
    </section>
    {showForm && <AddCustomerForm onClose={() => setShowForm(false)} onSave={addCustomer} />}
  </AdminLayout>
}

export default CustomersPage
