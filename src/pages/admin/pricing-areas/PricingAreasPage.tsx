import { useState } from "react"
import { Icon } from "../AdminSidebar"
import AddPricingAreaForm, { type PricingAreaFormValues } from "../forms/AddPricingAreaForm"
import AdminLayout from "../layout/AdminLayout"
import { vehicleTypeOptions } from "../fleetOptions"

type PricingArea = PricingAreaFormValues & { id: number }

const initialPricingAreas: PricingArea[] = [
  { id: 1, name: "Nairobi Central", city: "Nairobi", province: "Nairobi County", areaType: "City center", vehicleTypeIds: ["1", "2"], pricingType: "Daily", amount: 7200, minimumDays: 1, maximumDays: 6, effectiveFrom: "2026-01-01", effectiveTo: "2026-12-31" },
  { id: 2, name: "Airport zone", city: "Nairobi", province: "Nairobi County", areaType: "Airport", vehicleTypeIds: ["1", "3"], pricingType: "Daily", amount: 9800, minimumDays: null, maximumDays: null, effectiveFrom: "2026-01-01", effectiveTo: null },
  { id: 3, name: "Mombasa Coast", city: "Mombasa", province: "Coast Province", areaType: "Tourism", vehicleTypeIds: ["3", "4"], pricingType: "Weekly", amount: 82000, minimumDays: 7, maximumDays: null, effectiveFrom: "2026-05-01", effectiveTo: "2027-04-30" },
]

function getStatus(area: PricingArea, today: string) {
  if (area.effectiveFrom > today) return "Upcoming"
  if (area.effectiveTo && area.effectiveTo < today) return "Expired"
  return "Active"
}

function PricingAreasPage() {
  const [pricingAreas, setPricingAreas] = useState(initialPricingAreas)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("All statuses")
  const [showForm, setShowForm] = useState(false)
  const [nextId, setNextId] = useState(initialPricingAreas.length + 1)
  const today = new Date().toISOString().slice(0, 10)
  const filteredAreas = pricingAreas.filter((area) => {
    const vehicleNames = area.vehicleTypeIds.map((id) => vehicleTypeOptions.find((vehicleType) => vehicleType.id === id)?.name ?? "")
    const matchesSearch = `${area.name} ${area.city} ${area.province} ${area.areaType} ${vehicleNames.join(" ")} ${area.pricingType}`.toLowerCase().includes(search.toLowerCase())
    const matchesStatus = statusFilter === "All statuses" || getStatus(area, today) === statusFilter
    return matchesSearch && matchesStatus
  })
  const activeCount = pricingAreas.filter((area) => getStatus(area, today) === "Active").length
  const areaCount = new Set(pricingAreas.map((area) => area.name)).size

  const addPricingArea = (values: PricingAreaFormValues) => {
    setPricingAreas((current) => [{ ...values, id: nextId }, ...current])
    setNextId((current) => current + 1)
    setShowForm(false)
  }

  const formatDate = (date: string | null) => date ? new Date(`${date}T00:00:00`).toLocaleDateString("en-KE", { day: "numeric", month: "short", year: "numeric" }) : "No end date"
  const formatAmount = (amount: number) => `KSh ${amount.toLocaleString("en-KE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`

  return <AdminLayout eyebrow="Administration / Pricing areas" title={<>MOTION <span className="font-normal text-[#899187]">· Location pricing</span></>}>
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div><p className="text-xs font-medium uppercase tracking-[0.16em] text-[#8b9388]">Rate configuration</p><h2 className="mt-2 text-2xl font-semibold tracking-tight sm:text-[28px]">Pricing areas</h2><p className="mt-1.5 text-sm text-[#798177]">Manage rates by city, province, and area type.</p></div>
      <button onClick={() => setShowForm(true)} className="inline-flex h-10 items-center gap-2 rounded-lg bg-[#192820] px-4 text-xs font-semibold text-white transition-colors hover:bg-[#293b30]"><Icon name="plus" className="h-4 w-4" />Create pricing area</button>
    </div>

    <section aria-label="Pricing area summary" className="mt-7 grid gap-3 sm:grid-cols-3">
      <article className="rounded-xl border border-[#e7e9e2] bg-white p-5"><p className="text-xs font-medium text-[#788077]">Pricing areas</p><p className="mt-3 text-2xl font-semibold tracking-tight">{areaCount.toString().padStart(2, "0")}</p></article>
      <article className="rounded-xl border border-[#e7e9e2] bg-white p-5"><p className="text-xs font-medium text-[#788077]">Active rules</p><p className="mt-3 text-2xl font-semibold tracking-tight">{activeCount}</p></article>
      <article className="rounded-xl border border-[#e7e9e2] bg-white p-5"><p className="text-xs font-medium text-[#788077]">Vehicle types covered</p><p className="mt-3 text-2xl font-semibold tracking-tight">{new Set(pricingAreas.flatMap((area) => area.vehicleTypeIds)).size}</p></article>
    </section>

    <section className="mt-4 rounded-xl border border-[#e7e9e2] bg-white">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#edf0e9] px-5 py-4 sm:px-6"><div><h3 className="text-sm font-semibold">Location pricing rules</h3><p className="mt-1 text-xs text-[#858d82]">Search by area, city, vehicle type, or pricing type</p></div><div className="flex flex-wrap items-center gap-2"><label className="flex h-9 items-center gap-2 rounded-lg border border-[#e6e9e1] px-2.5 text-[#899187]"><Icon name="search" className="h-4 w-4" /><input aria-label="Search pricing areas" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search areas" className="w-32 bg-transparent text-xs text-[#202720] outline-none placeholder:text-[#9ba197] sm:w-40" /></label><label><span className="sr-only">Filter by pricing status</span><select aria-label="Filter by pricing status" value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} className="h-9 rounded-lg border border-[#e6e9e1] bg-white px-2.5 text-xs text-[#596257] outline-none focus:border-[#81945e]"><option>All statuses</option><option>Active</option><option>Upcoming</option><option>Expired</option></select></label></div></div>
      <div className="overflow-x-auto"><table className="w-full min-w-[1120px] text-left"><thead><tr className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#9aa095]"><th className="px-5 py-3">Pricing area</th><th className="px-5 py-3">Location</th><th className="px-5 py-3">Vehicle types</th><th className="px-5 py-3">Pricing type</th><th className="px-5 py-3">Amount</th><th className="px-5 py-3">Days</th><th className="px-5 py-3">Effective period</th><th className="px-5 py-3">Status</th><th className="px-5 py-3 text-right">Action</th></tr></thead><tbody className="divide-y divide-[#f0f1ed]">
        {filteredAreas.map((area) => {
          const status = getStatus(area, today)
          const vehicleNames = area.vehicleTypeIds.map((id) => vehicleTypeOptions.find((type) => type.id === id)?.name ?? "Unknown type")
          return <tr key={area.id} className="text-xs hover:bg-[#fbfcf9]"><td className="px-5 py-4 font-semibold text-[#343d34]">{area.name}<span className="mt-1 block text-[11px] font-normal text-[#858d82]">{area.areaType}</span></td><td className="px-5 py-4 text-[#687166]">{area.city}, {area.province}</td><td className="max-w-56 px-5 py-4 text-[#687166]">{vehicleNames.join(", ")}</td><td className="px-5 py-4 text-[#687166]">{area.pricingType}</td><td className="px-5 py-4 font-semibold text-[#343d34]">{formatAmount(area.amount)}</td><td className="px-5 py-4 text-[#687166]">{area.minimumDays ?? "—"} to {area.maximumDays ?? "No max"}</td><td className="px-5 py-4 text-[#687166]">{formatDate(area.effectiveFrom)} – {formatDate(area.effectiveTo)}</td><td className="px-5 py-4"><span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-medium ${status === "Active" ? "bg-[#edf5e5] text-[#638046]" : status === "Upcoming" ? "bg-[#e9eff8] text-[#49688d]" : "bg-[#f1f3ee] text-[#697267]"}`}><span className="h-1.5 w-1.5 rounded-full bg-current" />{status}</span></td><td className="px-5 py-4 text-right"><button aria-label={`Remove ${area.name} pricing`} onClick={() => setPricingAreas((current) => current.filter((item) => item.id !== area.id))} className="rounded-md border border-[#e6e9e1] px-2.5 py-1.5 text-[10px] font-medium text-[#747d72] hover:border-[#d7a998] hover:text-[#a35e4b]">Remove</button></td></tr>
        })}
        {filteredAreas.length === 0 && <tr><td colSpan={9} className="px-6 py-12 text-center text-xs text-[#858d82]">No pricing areas found. Try another search or create one.</td></tr>}
      </tbody></table></div>
      <div className="flex items-center justify-between border-t border-[#edf0e9] px-6 py-3 text-[11px] text-[#8c9489]"><span>Showing {filteredAreas.length} of {pricingAreas.length} pricing rules</span><span>Demo data · changes aren’t saved to a backend</span></div>
    </section>
    {showForm && <AddPricingAreaForm onClose={() => setShowForm(false)} onSave={addPricingArea} />}
  </AdminLayout>
}

export default PricingAreasPage