import { useState } from "react"
import { Icon } from "../AdminSidebar"
import AddVehicleTypeForm, { type VehicleTypeValues } from "../forms/AddVehicleTypeForm"
import AdminLayout from "../layout/AdminLayout"
import { vehicleTypeOptions } from "../fleetOptions"

type VehicleType = VehicleTypeValues & { id: string }

const initialTypes: VehicleType[] = vehicleTypeOptions

const columns: { key: keyof VehicleTypeValues; label: string }[] = [
  { key: "name", label: "Name" },
  { key: "description", label: "Description" },
  { key: "seatingCapacity", label: "Seats" },
  { key: "transmissionType", label: "Transmission" },
  { key: "fuelType", label: "Fuel" },
  { key: "dailyBaseRate", label: "Daily base rate" },
]

function VehicleTypesPage() {
  const [types, setTypes] = useState(initialTypes)
  const [search, setSearch] = useState("")
  const [showForm, setShowForm] = useState(false)
  const [nextId, setNextId] = useState(initialTypes.length + 1)
  const filteredTypes = types.filter((type) => Object.values(type).join(" ").toLowerCase().includes(search.toLowerCase()))
  const averageRate = types.length ? types.reduce((sum, type) => sum + Number(type.dailyBaseRate), 0) / types.length : 0

  const addType = (values: VehicleTypeValues) => {
    setTypes((current) => [{ ...values, id: String(nextId) }, ...current])
    setNextId((current) => current + 1)
    setShowForm(false)
  }

  const formatRate = (rate: string) => `KSh ${Number(rate).toLocaleString("en-KE")}`

  return <AdminLayout eyebrow="Administration / Vehicle types" title={<>MOTION <span className="font-normal text-[#899187]">· Vehicle categories</span></>}>
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div><p className="text-xs font-medium uppercase tracking-[0.16em] text-[#8b9388]">Fleet setup</p><h2 className="mt-2 text-2xl font-semibold tracking-tight sm:text-[28px]">Vehicle types</h2><p className="mt-1.5 text-sm text-[#798177]">Manage vehicle specifications and daily rental rates.</p></div>
      <button onClick={() => setShowForm(true)} className="inline-flex h-10 items-center gap-2 rounded-lg bg-[#192820] px-4 text-xs font-semibold text-white transition-colors hover:bg-[#293b30]"><Icon name="plus" className="h-4 w-4" />Add vehicle type</button>
    </div>

    <section aria-label="Vehicle type summary" className="mt-7 grid gap-3 sm:grid-cols-3">
      <article className="rounded-xl border border-[#e7e9e2] bg-white p-5"><p className="text-xs font-medium text-[#788077]">Vehicle types</p><p className="mt-3 text-2xl font-semibold tracking-tight">{types.length.toString().padStart(2, "0")}</p></article>
      <article className="rounded-xl border border-[#e7e9e2] bg-white p-5"><p className="text-xs font-medium text-[#788077]">Transmission options</p><p className="mt-3 text-2xl font-semibold tracking-tight">{new Set(types.map((type) => type.transmissionType)).size}</p></article>
      <article className="rounded-xl border border-[#e7e9e2] bg-white p-5"><p className="text-xs font-medium text-[#788077]">Average daily base rate</p><p className="mt-3 text-2xl font-semibold tracking-tight">{formatRate(averageRate.toFixed(0))}</p></article>
    </section>

    <section className="mt-4 rounded-xl border border-[#e7e9e2] bg-white">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#edf0e9] px-5 py-4 sm:px-6"><div><h3 className="text-sm font-semibold">Vehicle type directory</h3><p className="mt-1 text-xs text-[#858d82]">Specifications and pricing used for rental categories</p></div><label className="flex h-9 items-center gap-2 rounded-lg border border-[#e6e9e1] px-2.5 text-[#899187]"><Icon name="search" className="h-4 w-4" /><input aria-label="Search vehicle types" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search types" className="w-32 bg-transparent text-xs text-[#202720] outline-none placeholder:text-[#9ba197] sm:w-44" /></label></div>
      <div className="overflow-x-auto"><table className="w-full min-w-[900px] text-left"><thead><tr className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#9aa095]">{columns.map((column) => <th key={column.key} className="px-5 py-3">{column.label}</th>)}<th className="px-5 py-3 text-right">Actions</th></tr></thead><tbody className="divide-y divide-[#f0f1ed]">
        {filteredTypes.map((type) => <tr key={type.id} className="text-xs hover:bg-[#fbfcf9]"><td className="px-5 py-4 font-semibold text-[#343d34]">{type.name}</td><td className="max-w-56 truncate px-5 py-4 text-[#687166]">{type.description || "—"}</td><td className="px-5 py-4 text-[#687166]">{type.seatingCapacity}</td><td className="px-5 py-4 text-[#687166]">{type.transmissionType}</td><td className="px-5 py-4 text-[#687166]">{type.fuelType}</td><td className="px-5 py-4 font-semibold text-[#343d34]">{formatRate(type.dailyBaseRate)}</td><td className="px-5 py-4 text-right"><button aria-label={`Remove ${type.name}`} onClick={() => setTypes((current) => current.filter((item) => item.id !== type.id))} className="rounded-md border border-[#e6e9e1] px-2.5 py-1.5 text-[10px] font-medium text-[#747d72] hover:border-[#d7a998] hover:text-[#a35e4b]">Remove</button></td></tr>)}
        {filteredTypes.length === 0 && <tr><td colSpan={columns.length + 1} className="px-6 py-12 text-center text-xs text-[#858d82]">No vehicle types found. Try another search or add a type.</td></tr>}
      </tbody></table></div>
      <div className="flex items-center justify-between border-t border-[#edf0e9] px-6 py-3 text-[11px] text-[#8c9489]"><span>Showing {filteredTypes.length} of {types.length} vehicle types</span><span>Demo data · changes aren’t saved to a backend</span></div>
    </section>
    {showForm && <AddVehicleTypeForm onClose={() => setShowForm(false)} onSave={addType} />}
  </AdminLayout>
}

export default VehicleTypesPage