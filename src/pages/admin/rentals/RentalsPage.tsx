import { useState } from "react"
import { Icon } from "../AdminSidebar"
import AddRentalForm, { rentalCustomerOptions, type RentalFormValues } from "../forms/AddRentalForm"
import AdminLayout from "../layout/AdminLayout"
import { getBranches } from "../../../features/branches/branches.store"

type RentalStatus = "Booked" | "Active" | "Overdue" | "Completed" | "Cancelled"
type Rental = {
  rentalNumber: string
  customerId: string
  customer: string
  vehicle: string
  pickupDate: string
  returnDate: string
  branch: string
  total: number
  status: RentalStatus
  formValues?: RentalFormValues
}

const initialRentals: Rental[] = [
  { rentalNumber: "RENT-2026-0041", customerId: "101", customer: "Maya Johnson", vehicle: "Toyota Corolla · KDA 284R", pickupDate: "2026-10-12T09:00", returnDate: "2026-10-16T09:00", branch: "Westlands", total: 26000, status: "Active" },
  { rentalNumber: "RENT-2026-0040", customerId: "102", customer: "Noah Williams", vehicle: "Honda CR-V · KDB 619M", pickupDate: "2026-10-17T10:00", returnDate: "2026-10-20T10:00", branch: "Airport branch", total: 37500, status: "Booked" },
  { rentalNumber: "RENT-2026-0039", customerId: "103", customer: "Olivia Brown", vehicle: "Mazda CX-5 · KDD 852A", pickupDate: "2026-10-08T08:00", returnDate: "2026-10-11T08:00", branch: "CBD branch", total: 39000, status: "Overdue" },
  { rentalNumber: "RENT-2026-0038", customerId: "104", customer: "Ethan Davis", vehicle: "Hyundai Tucson · KDC 407P", pickupDate: "2026-10-03T11:00", returnDate: "2026-10-06T11:00", branch: "Westlands", total: 34500, status: "Completed" },
]

const statusStyles: Record<RentalStatus, string> = {
  Booked: "bg-[#e9eff8] text-[#49688d]",
  Active: "bg-[#edf5e5] text-[#638046]",
  Overdue: "bg-[#f8ece8] text-[#a35e4b]",
  Completed: "bg-[#f1f3ee] text-[#697267]",
  Cancelled: "bg-[#f1f3ee] text-[#697267]",
}

function formatDate(date: string) {
  const value = date.length === 10 ? `${date}T00:00:00` : date
  return new Date(value).toLocaleString("en-KE", { day: "numeric", month: "short", year: "numeric", hour: "numeric", minute: "2-digit" })
}

function RentalsPage() {
  const [rentals, setRentals] = useState(initialRentals)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("All statuses")
  const [showForm, setShowForm] = useState(false)

  const filteredRentals = rentals.filter((rental) => {
    const matchesSearch = Object.values(rental).join(" ").toLowerCase().includes(search.toLowerCase())
    const matchesStatus = statusFilter === "All statuses" || rental.status === statusFilter
    return matchesSearch && matchesStatus
  })
  const activeCount = rentals.filter((rental) => rental.status === "Active").length
  const bookedCount = rentals.filter((rental) => rental.status === "Booked").length
  const overdueCount = rentals.filter((rental) => rental.status === "Overdue").length

  const addRental = (values: RentalFormValues) => {
    const branch = getBranches().find((item) => item.id === values.branchId)
    const customer = rentalCustomerOptions.find((item) => item.id === values.customerId)
    setRentals((current) => [{
      rentalNumber: values.rentalNumber,
      customerId: values.customerId,
      customer: customer?.name ?? values.customerId,
      vehicle: values.vehicle,
      pickupDate: values.startDateTime,
      returnDate: values.expectedReturnDateTime,
      branch: branch?.name ?? values.branchId,
      total: values.totalAmount,
      status: values.status as RentalStatus,
      formValues: values,
    }, ...current])
    setShowForm(false)
  }

  const advanceStatus = (rentalNumber: string) => {
    setRentals((current) => current.map((rental) => rental.rentalNumber === rentalNumber
      ? { ...rental, status: rental.status === "Booked" ? "Active" : "Completed" }
      : rental))
  }

  return <AdminLayout eyebrow="Administration / Rentals" title={<>MOTION <span className="font-normal text-[#899187]">· Rental management</span></>}>
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div><p className="text-xs font-medium uppercase tracking-[0.16em] text-[#8b9388]">Rental workspace</p><h2 className="mt-2 text-2xl font-semibold tracking-tight sm:text-[28px]">Rentals</h2><p className="mt-1.5 text-sm text-[#798177]">Manage bookings, active rentals, and vehicle returns.</p></div>
      <button onClick={() => setShowForm(true)} className="inline-flex h-10 items-center gap-2 rounded-lg bg-[#192820] px-4 text-xs font-semibold text-white transition-colors hover:bg-[#293b30]"><Icon name="plus" className="h-4 w-4" />Create rental</button>
    </div>

    <section aria-label="Rental summary" className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      <article className="rounded-xl border border-[#e7e9e2] bg-white p-5"><p className="text-xs font-medium text-[#788077]">Total rentals</p><p className="mt-3 text-2xl font-semibold tracking-tight">{rentals.length.toString().padStart(2, "0")}</p></article>
      <article className="rounded-xl border border-[#e7e9e2] bg-white p-5"><p className="text-xs font-medium text-[#788077]">Booked</p><p className="mt-3 text-2xl font-semibold tracking-tight">{bookedCount}</p></article>
      <article className="rounded-xl border border-[#e7e9e2] bg-white p-5"><p className="text-xs font-medium text-[#788077]">Active</p><p className="mt-3 text-2xl font-semibold tracking-tight">{activeCount}</p></article>
      <article className="rounded-xl border border-[#e7e9e2] bg-white p-5"><p className="text-xs font-medium text-[#788077]">Overdue</p><p className="mt-3 text-2xl font-semibold tracking-tight">{overdueCount}</p></article>
    </section>

    <section className="mt-4 rounded-xl border border-[#e7e9e2] bg-white">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#edf0e9] px-5 py-4 sm:px-6"><div><h3 className="text-sm font-semibold">Rental records</h3><p className="mt-1 text-xs text-[#858d82]">Review booking details and update rental status</p></div><div className="flex flex-wrap items-center gap-2"><label className="flex h-9 items-center gap-2 rounded-lg border border-[#e6e9e1] px-2.5 text-[#899187]"><Icon name="search" className="h-4 w-4" /><input aria-label="Search rentals" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search rentals" className="w-32 bg-transparent text-xs text-[#202720] outline-none placeholder:text-[#9ba197] sm:w-40" /></label><label><span className="sr-only">Filter by rental status</span><select aria-label="Filter by rental status" value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} className="h-9 rounded-lg border border-[#e6e9e1] bg-white px-2.5 text-xs text-[#596257] outline-none focus:border-[#81945e]"><option>All statuses</option><option>Booked</option><option>Active</option><option>Overdue</option><option>Completed</option><option>Cancelled</option></select></label></div></div>
      <div className="overflow-x-auto"><table className="w-full min-w-[980px] text-left"><thead><tr className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#9aa095]"><th className="px-5 py-3">Rental</th><th className="px-5 py-3">Customer / Vehicle</th><th className="px-5 py-3">Rental period</th><th className="px-5 py-3">Pickup branch</th><th className="px-5 py-3">Total</th><th className="px-5 py-3">Status</th><th className="px-5 py-3 text-right">Action</th></tr></thead><tbody className="divide-y divide-[#f0f1ed]">
        {filteredRentals.map((rental) => <tr key={rental.rentalNumber} className="text-xs hover:bg-[#fbfcf9]"><td className="px-5 py-4 font-semibold text-[#343d34]">{rental.rentalNumber}</td><td className="px-5 py-4"><span className="block font-semibold text-[#343d34]">{rental.customer}</span><span className="mt-1 block text-[11px] text-[#858d82]">ID {rental.customerId} · {rental.vehicle}</span></td><td className="px-5 py-4 text-[#687166]"><span className="block">{formatDate(rental.pickupDate)}</span><span className="mt-1 block text-[11px] text-[#858d82]">to {formatDate(rental.returnDate)}</span></td><td className="px-5 py-4 text-[#687166]">{rental.branch}</td><td className="px-5 py-4 font-semibold text-[#343d34]">KSh {rental.total.toLocaleString("en-KE")}</td><td className="px-5 py-4"><span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-medium ${statusStyles[rental.status]}`}><span className="h-1.5 w-1.5 rounded-full bg-current" />{rental.status}</span></td><td className="px-5 py-4 text-right"><button disabled={rental.status === "Completed" || rental.status === "Cancelled"} aria-label={rental.status === "Booked" ? `Start ${rental.rentalNumber}` : `Complete ${rental.rentalNumber}`} onClick={() => advanceStatus(rental.rentalNumber)} className="rounded-md border border-[#e6e9e1] px-2.5 py-1.5 text-[10px] font-medium text-[#596257] hover:border-[#b9c5ad] hover:text-[#53634e] disabled:cursor-not-allowed disabled:opacity-40">{rental.status === "Booked" ? "Start" : rental.status === "Completed" || rental.status === "Cancelled" ? "Closed" : "Mark returned"}</button></td></tr>)}
        {filteredRentals.length === 0 && <tr><td colSpan={7} className="px-6 py-12 text-center text-xs text-[#858d82]">No rentals match these filters.</td></tr>}
      </tbody></table></div>
      <div className="flex items-center justify-between border-t border-[#edf0e9] px-6 py-3 text-[11px] text-[#8c9489]"><span>Showing {filteredRentals.length} of {rentals.length} rentals</span><span>Demo data · changes aren’t saved to a backend</span></div>
    </section>
    {showForm && <AddRentalForm onClose={() => setShowForm(false)} onSave={addRental} />}
  </AdminLayout>
}

export default RentalsPage