import { useState } from "react"
import { Icon } from "../AdminSidebar"
import AddPricingForm, { type PricingFormValues } from "../forms/AddPricingForm"
import AdminLayout from "../layout/AdminLayout"
import { vehicleTypeOptions } from "../fleetOptions"

type PricingRule = PricingFormValues & { id: number }

const initialRules: PricingRule[] = [
  { id: 1, vehicleTypeIds: ["1"], pricingType: "Daily", rate: 6500, minimumDays: "1", maximumDays: "6", effectiveFrom: "2026-01-01", effectiveTo: "2026-12-31" },
  { id: 2, vehicleTypeIds: ["2", "3"], pricingType: "Weekly", rate: 72000, minimumDays: "7", maximumDays: "29", effectiveFrom: "2026-01-01", effectiveTo: "2026-12-31" },
  { id: 3, vehicleTypeIds: ["4"], pricingType: "Monthly", rate: 280000, minimumDays: "30", maximumDays: "", effectiveFrom: "2026-03-01", effectiveTo: "2027-02-28" },
]

function ruleStatus(rule: PricingRule, today: string) {
  if (rule.effectiveTo < today) return "Expired"
  if (rule.effectiveFrom > today) return "Upcoming"
  return "Active"
}

function PricingPage() {
  const [rules, setRules] = useState(initialRules)
  const [search, setSearch] = useState("")
  const [showForm, setShowForm] = useState(false)
  const [nextId, setNextId] = useState(initialRules.length + 1)
  const today = new Date().toISOString().slice(0, 10)
  const filteredRules = rules.filter((rule) => {
    const vehicleNames = rule.vehicleTypeIds.map((id) => vehicleTypeOptions.find((type) => type.id === id)?.name ?? "")
    return `${vehicleNames.join(" ")} ${rule.pricingType} ${rule.rate} ${rule.effectiveFrom} ${rule.effectiveTo}`.toLowerCase().includes(search.toLowerCase())
  })
  const activeCount = rules.filter((rule) => ruleStatus(rule, today) === "Active").length
  const averageRate = rules.length ? rules.reduce((sum, rule) => sum + rule.rate, 0) / rules.length : 0
  const coveredVehicleTypes = new Set(rules.flatMap((rule) => rule.vehicleTypeIds)).size

  const addRule = (values: PricingFormValues) => {
    setRules((current) => [{ ...values, id: nextId }, ...current])
    setNextId((current) => current + 1)
    setShowForm(false)
  }

  const formatDate = (date: string) => new Date(`${date}T00:00:00`).toLocaleDateString("en-KE", { day: "numeric", month: "short", year: "numeric" })
  const formatRate = (rate: number) => `KSh ${rate.toLocaleString("en-KE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`

  return <AdminLayout eyebrow="Administration / Pricing" title={<>MOTION <span className="font-normal text-[#899187]">· Rental pricing</span></>}>
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div><p className="text-xs font-medium uppercase tracking-[0.16em] text-[#8b9388]">Rate configuration</p><h2 className="mt-2 text-2xl font-semibold tracking-tight sm:text-[28px]">Pricing</h2><p className="mt-1.5 text-sm text-[#798177]">Set vehicle rates, rental durations, and effective periods.</p></div>
      <button onClick={() => setShowForm(true)} className="inline-flex h-10 items-center gap-2 rounded-lg bg-[#192820] px-4 text-xs font-semibold text-white transition-colors hover:bg-[#293b30]"><Icon name="plus" className="h-4 w-4" />Create pricing</button>
    </div>

    <section aria-label="Pricing summary" className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      <article className="rounded-xl border border-[#e7e9e2] bg-white p-5"><p className="text-xs font-medium text-[#788077]">Pricing rules</p><p className="mt-3 text-2xl font-semibold tracking-tight">{rules.length.toString().padStart(2, "0")}</p></article>
      <article className="rounded-xl border border-[#e7e9e2] bg-white p-5"><p className="text-xs font-medium text-[#788077]">Currently active</p><p className="mt-3 text-2xl font-semibold tracking-tight">{activeCount}</p></article>
      <article className="rounded-xl border border-[#e7e9e2] bg-white p-5"><p className="text-xs font-medium text-[#788077]">Vehicle types covered</p><p className="mt-3 text-2xl font-semibold tracking-tight">{coveredVehicleTypes}</p></article>
      <article className="rounded-xl border border-[#e7e9e2] bg-white p-5"><p className="text-xs font-medium text-[#788077]">Average rule rate</p><p className="mt-3 text-2xl font-semibold tracking-tight">KSh {averageRate.toLocaleString("en-KE", { maximumFractionDigits: 0 })}</p></article>
    </section>

    <section className="mt-4 rounded-xl border border-[#e7e9e2] bg-white">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#edf0e9] px-5 py-4 sm:px-6"><div><h3 className="text-sm font-semibold">Pricing rules</h3><p className="mt-1 text-xs text-[#858d82]">Manage vehicle pricing and validity dates</p></div><label className="flex h-9 items-center gap-2 rounded-lg border border-[#e6e9e1] px-2.5 text-[#899187]"><Icon name="search" className="h-4 w-4" /><input aria-label="Search pricing rules" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search pricing" className="w-32 bg-transparent text-xs text-[#202720] outline-none placeholder:text-[#9ba197] sm:w-44" /></label></div>
      <div className="overflow-x-auto"><table className="w-full min-w-[900px] text-left"><thead><tr className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#9aa095]"><th className="px-5 py-3">Vehicle types</th><th className="px-5 py-3">Pricing type</th><th className="px-5 py-3">Rate</th><th className="px-5 py-3">Duration limits</th><th className="px-5 py-3">Effective period</th><th className="px-5 py-3">Status</th><th className="px-5 py-3 text-right">Action</th></tr></thead><tbody className="divide-y divide-[#f0f1ed]">
        {filteredRules.map((rule) => {
          const status = ruleStatus(rule, today)
          const vehicleNames = rule.vehicleTypeIds.map((id) => vehicleTypeOptions.find((type) => type.id === id)?.name ?? "Unknown type")
          return <tr key={rule.id} className="text-xs hover:bg-[#fbfcf9]"><td className="px-5 py-4 font-semibold text-[#343d34]">{vehicleNames.join(", ")}</td><td className="px-5 py-4 text-[#687166]">{rule.pricingType}</td><td className="px-5 py-4 font-semibold text-[#343d34]">{formatRate(rule.rate)}</td><td className="px-5 py-4 text-[#687166]">{rule.minimumDays || "—"} to {rule.maximumDays || "No limit"} days</td><td className="px-5 py-4 text-[#687166]">{formatDate(rule.effectiveFrom)} – {formatDate(rule.effectiveTo)}</td><td className="px-5 py-4"><span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-medium ${status === "Active" ? "bg-[#edf5e5] text-[#638046]" : status === "Upcoming" ? "bg-[#e9eff8] text-[#49688d]" : "bg-[#f1f3ee] text-[#697267]"}`}><span className="h-1.5 w-1.5 rounded-full bg-current" />{status}</span></td><td className="px-5 py-4 text-right"><button aria-label="Remove pricing rule" onClick={() => setRules((current) => current.filter((item) => item.id !== rule.id))} className="rounded-md border border-[#e6e9e1] px-2.5 py-1.5 text-[10px] font-medium text-[#747d72] hover:border-[#d7a998] hover:text-[#a35e4b]">Remove</button></td></tr>
        })}
        {filteredRules.length === 0 && <tr><td colSpan={7} className="px-6 py-12 text-center text-xs text-[#858d82]">No pricing rules found. Try another search or create a rule.</td></tr>}
      </tbody></table></div>
      <div className="flex items-center justify-between border-t border-[#edf0e9] px-6 py-3 text-[11px] text-[#8c9489]"><span>Showing {filteredRules.length} of {rules.length} pricing rules</span><span>Demo data · changes aren’t saved to a backend</span></div>
    </section>
    {showForm && <AddPricingForm onClose={() => setShowForm(false)} onSave={addRule} />}
  </AdminLayout>
}

export default PricingPage